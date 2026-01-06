import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoyaltyLedger, LoyaltyLedgerSchema } from './schemas/loyalty-ledger.schema';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LoyaltyLedger.name, schema: LoyaltyLedgerSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [LoyaltyController],
    providers: [LoyaltyService],
    exports: [LoyaltyService],
})
export class LoyaltyModule { }
