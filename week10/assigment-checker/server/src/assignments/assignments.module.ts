import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { CloudinaryService } from '../common/cloudinary.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Assignment.name, schema: AssignmentSchema },
            { name: Submission.name, schema: SubmissionSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [AssignmentsService, CloudinaryService],
    controllers: [AssignmentsController],
})
export class AssignmentsModule { }
