import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Assignment, AssignmentDocument } from '../assignments/schemas/assignment.schema';
import { Submission, SubmissionDocument } from '../assignments/schemas/submission.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userModel.find().select('-password').exec();
    }

    async toggleBlock(id: string, requesterId: string): Promise<User> {
        if (id === requesterId) {
            throw new BadRequestException('You cannot block yourself');
        }

        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isBlocked = !user.isBlocked;
        return user.save();
    }

    async changeRole(id: string, newRole: string, requesterId: string): Promise<User> {
        if (id === requesterId) {
            throw new BadRequestException('You cannot change your own role');
        }

        if (!['student', 'teacher', 'moderator'].includes(newRole)) {
            throw new BadRequestException('Invalid role');
        }

        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const oldRole = user.role;
        if (oldRole === newRole) return user;

        // Handle Edge Cases
        if (oldRole === 'teacher' && newRole === 'student') {
            // Demoting teacher to student
            // For simplicity, we keep their assignments but they can't manage them anymore
            // Optionally, we could hide them or reassign them
            console.log(`Demoting teacher ${user.email} to student. Created assignments remain in DB.`);
        } else if (oldRole === 'student' && newRole === 'teacher') {
            // Promoting student to teacher
            // Their previous submissions remain as historical data
            console.log(`Promoting student ${user.email} to teacher. Historical submissions preserved.`);
        }

        user.role = newRole;
        return user.save();
    }
}
