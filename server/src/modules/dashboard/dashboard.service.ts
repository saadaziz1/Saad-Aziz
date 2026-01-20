import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schema/order.schema';
import { Product, ProductDocument } from '../products/schema/product.schema';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schema/raw-material.schema';
import dayjs from 'dayjs';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
    ) { }

    async getStats() {
        const totalSalesResult = await this.orderModel.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalSales = totalSalesResult[0]?.total || 0;

        const totalOrders = await this.orderModel.countDocuments();

        const lowStockMaterials = await this.rawMaterialModel.find({
            $expr: { $lte: ['$stockQty', '$minAlertQty'] },
        }).sort({ stockQty: 1 }).limit(5);

        // Most sold products
        const topProducts = await this.orderModel.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.product', totalQty: { $sum: '$items.quantity' } } },
            { $sort: { totalQty: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    name: '$productDetails.name',
                    image: '$productDetails.image',
                    totalQty: 1,
                },
            },
        ]);

        // Sales over last 7 days for graph
        const last7Days: { date: string, sales: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').startOf('day');
            const dailySales = await this.orderModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: date.toDate(),
                            $lt: date.add(1, 'day').toDate(),
                        },
                    },
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]);
            last7Days.push({
                date: date.format('MMM DD'),
                sales: dailySales[0]?.total || 0,
            });
        }

        // Order Type distribution for Pie Chart
        const orderTypeStats = await this.orderModel.aggregate([
            { $group: { _id: '$type', value: { $sum: 1 } } },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        const defaultOrderTypes = [
            { name: 'IN_STORE', value: 0 },
            { name: 'PICKUP', value: 0 },
            { name: 'SHIPPING', value: 0 }
        ];

        const pieData = defaultOrderTypes.map(type => {
            const found = orderTypeStats.find(s => s.name === type.name);
            return {
                name: type.name.replace('_', ' '),
                value: found ? found.value : 0
            };
        });

        // Recent Orders for Report
        const recentOrders = await this.orderModel.find()
            .populate('processedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        return {
            summary: {
                totalSales,
                totalOrders,
                lowStockCount: lowStockMaterials.length,
            },
            lowStockMaterials,
            topProducts,
            salesHistory: last7Days,
            pieData,
            recentOrders,
        };
    }
}
