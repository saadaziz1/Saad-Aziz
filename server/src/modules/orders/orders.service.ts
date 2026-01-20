import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product, ProductDocument } from '../products/schema/product.schema';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schema/raw-material.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
        try {
            let totalAmount = 0;
            const orderItems: any[] = [];
            const materialsToUpdate: { id: string, qty: number }[] = [];

            // Phase 1: Validations and calculations
            for (const itemDto of createOrderDto.items) {
                const product = await this.productModel
                    .findById(itemDto.product)
                    .populate('recipe.rawMaterial')
                    .exec();

                if (!product) {
                    throw new BadRequestException(`Product ${itemDto.product} not found`);
                }

                // Check stock for each item's recipe
                for (const recipeItem of product.recipe) {
                    const material = recipeItem.rawMaterial as any;
                    const requiredQty = recipeItem.quantity * itemDto.quantity;

                    if (!material || material.stockQty < requiredQty) {
                        throw new BadRequestException(
                            `Insufficient stock for raw material: ${material?.name || 'Unknown'}`,
                        );
                    }

                    materialsToUpdate.push({
                        id: material._id.toString(),
                        qty: requiredQty
                    });
                }

                totalAmount += product.price * itemDto.quantity;
                orderItems.push({
                    product: product._id,
                    quantity: itemDto.quantity,
                    priceAtSale: product.price,
                });
            }

            // Phase 2: Stock deduction (performed if all validations pass)
            for (const update of materialsToUpdate) {
                await this.rawMaterialModel.findByIdAndUpdate(
                    update.id,
                    { $inc: { stockQty: -update.qty } }
                );
            }

            const newOrder = new this.orderModel({
                items: orderItems,
                totalAmount,
                type: createOrderDto.type,
                paymentMethod: createOrderDto.paymentMethod,
                processedBy: new Types.ObjectId(userId),
            });

            return await newOrder.save();
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to process order: ' + error.message);
        }
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find()
            .populate('items.product')
            .populate('processedBy', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id)
            .populate('items.product')
            .populate('processedBy', 'name email')
            .exec();

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
}
