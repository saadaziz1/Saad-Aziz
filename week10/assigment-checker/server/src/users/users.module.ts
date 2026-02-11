import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Assignment, AssignmentSchema } from '../assignments/schemas/assignment.schema';
import { Submission, SubmissionSchema } from '../assignments/schemas/submission.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Assignment.name, schema: AssignmentSchema },
            { name: Submission.name, schema: SubmissionSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
