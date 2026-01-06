import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoyaltyLedger, LoyaltyLedgerDocument, LedgerType } from './schemas/loyalty-ledger.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class LoyaltyService {
    constructor(
        @InjectModel(LoyaltyLedger.name) private ledgerModel: Model<LoyaltyLedgerDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async createEntry(
        userId: string | Types.ObjectId,
        type: LedgerType,
        points: number,
        description: string,
        orderId?: string | Types.ObjectId,
    ): Promise<LoyaltyLedgerDocument> {
        const entry = new this.ledgerModel({
            userId: new Types.ObjectId(userId.toString()),
            type,
            points,
            description,
            orderId: orderId ? new Types.ObjectId(orderId.toString()) : undefined,
        });

        const savedEntry = await entry.save();

        // Update user cached balance
        const pointsChange = (type === LedgerType.EARN || type === LedgerType.REFUND) ? points : -points;
        await this.userModel.updateOne(
            { _id: userId },
            { $inc: { loyaltyPoints: pointsChange } },
        );

        return savedEntry;
    }

    async getBalance(userId: string): Promise<number> {
        const user = await this.userModel.findById(userId).select('loyaltyPoints').exec();
        return user?.loyaltyPoints || 0;
    }

    async getHistory(userId: string): Promise<LoyaltyLedger[]> {
        return this.ledgerModel
            .find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Recalculate balance from ledger to ensure consistency
     */
    async reconcileBalance(userId: string): Promise<number> {
        const result = await this.ledgerModel.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$userId',
                    total: {
                        $sum: {
                            $cond: [
                                { $or: [{ $eq: ['$type', LedgerType.EARN] }, { $eq: ['$type', LedgerType.REFUND] }] },
                                '$points',
                                { $multiply: ['$points', -1] },
                            ],
                        },
                    },
                },
            },
        ]);

        const balance = result[0]?.total || 0;
        await this.userModel.updateOne({ _id: userId }, { loyaltyPoints: balance });
        return balance;
    }
}
