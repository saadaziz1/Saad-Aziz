import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry, Cron, CronExpression } from '@nestjs/schedule';
import { createObjectCsvStringifier } from 'csv-writer';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { PDFParse } from 'pdf-parse';
import { createEvaluationAgent } from '../ai/agents/evaluation.agent';
import { runAgent } from '../ai/runner';
import { CloudinaryService } from '../common/cloudinary.service';

@Injectable()
export class AssignmentsService implements OnModuleInit {
    constructor(
        @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private cloudinaryService: CloudinaryService,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    async getDashboardStats(teacherId: string) {
        const assignments = await this.assignmentModel.find({ teacherId: new Types.ObjectId(teacherId) });
        const assignmentIds = assignments.map(a => a._id);

        const totalAssignments = assignments.length;
        const totalSubmissions = await this.submissionModel.countDocuments({ assignmentId: { $in: assignmentIds } });

        // Only count submissions with completed AI evaluations (remarks is not "Pending")
        const aiEvaluations = await this.submissionModel.countDocuments({
            assignmentId: { $in: assignmentIds },
            remarks: { $ne: "Pending Evaluation" }
        });

        // Calculate average score only from evaluated submissions
        const evaluatedSubmissions = await this.submissionModel.find({
            assignmentId: { $in: assignmentIds },
            remarks: { $ne: "Pending Evaluation" }
        });

        const totalScore = evaluatedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
        const avgScore = aiEvaluations > 0 ? (totalScore / aiEvaluations).toFixed(1) : "0";

        return {
            totalAssignments,
            totalSubmissions,
            aiEvaluations,
            avgScore: avgScore + "%"
        };
    }

    async createAssignment(data: any, teacherId: string): Promise<AssignmentDocument> {
        const assignment = new this.assignmentModel({
            ...data,
            teacherId: new Types.ObjectId(teacherId),
        });
        const saved = await assignment.save();
        this.scheduleDeadlineEvaluation(saved);
        return saved;
    }

    async updateAssignment(id: string, updateData: Partial<Assignment>): Promise<AssignmentDocument> {
        const assignment = await this.assignmentModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).exec();
        if (!assignment) throw new NotFoundException('Assignment not found');

        // Reschedule evaluation if deadline changed
        if (updateData.deadline) {
            this.scheduleDeadlineEvaluation(assignment);
        }

        return assignment;
    }

    async getAssignments(teacherId?: string): Promise<AssignmentDocument[]> {
        if (teacherId) {
            return this.assignmentModel.find({ teacherId: new Types.ObjectId(teacherId) }).exec();
        }
        return this.assignmentModel.find().exec();
    }

    async getStudentSubmissions(studentId: string): Promise<SubmissionDocument[]> {
        return this.submissionModel.find({ userId: new Types.ObjectId(studentId) }).populate('assignmentId', 'title deadline markingMode').exec();
    }

    async getAssignment(id: string): Promise<AssignmentDocument> {
        const assignment = await this.assignmentModel.findById(id).exec();
        if (!assignment) throw new NotFoundException('Assignment not found');
        return assignment;
    }

    async getSubmissions(assignmentId: string): Promise<SubmissionDocument[]> {
        return this.submissionModel.find({ assignmentId: new Types.ObjectId(assignmentId) }).exec();
    }

    async getSubmission(id: string): Promise<SubmissionDocument> {
        const submission = await this.submissionModel.findById(id).populate('assignmentId', 'title instructions').exec();
        if (!submission) throw new NotFoundException('Submission not found');
        return submission;
    }

    private validateFilename(filename: string) {
        // Format: firstName-lastName_rollNumber.pdf
        const regex = /^[a-zA-Z0-9.-]+_[a-zA-Z0-9]+\.pdf$/;
        return regex.test(filename);
    }

    async processSubmissions(
        assignmentId: string,
        files: Array<Express.Multer.File>,
        userId: string, // This is the logged-in user's ID
        metadata?: { rollNumber: string, studentName: string }
    ): Promise<{ success: any[], errors: any[] }> {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        // Check Deadline
        if (new Date() > new Date(assignment.deadline)) {
            throw new BadRequestException('Submission deadline has passed');
        }

        const success: any[] = [];
        const errors: any[] = [];

        // Fetch User if userId is provided (Student Role)
        let studentUser: UserDocument | null = null;
        if (userId) {
            studentUser = await this.userModel.findById(userId);
        }

        for (const file of files) {
            try {
                let studentName: string;
                let rollNumber: string;

                // 1. Identification
                if (studentUser && studentUser.role === 'student') {
                    // authenticated student
                    studentName = `${studentUser.firstName} ${studentUser.lastName}`;
                    rollNumber = studentUser.rollNumber || 'UNKNOWN'; // Should be set at signup
                } else if (metadata && metadata.rollNumber) {
                    // Teacher uploading for student
                    studentName = metadata.studentName;
                    rollNumber = metadata.rollNumber;
                } else {
                    // Batch upload - parse filename
                    if (!this.validateFilename(file.originalname)) {
                        throw new BadRequestException(`Invalid filename: ${file.originalname}. Use firstName-lastName_rollNumber.pdf`);
                    }
                    const filename = file.originalname.replace('.pdf', '');
                    const [namePart, rn] = filename.split('_');
                    studentName = namePart.replace(/-/g, ' ');
                    rollNumber = rn;
                }

                // 2. Replacement Logic: Check if student already submitted
                // If we have a userId, prioritize that for uniqueness
                let query: any = { assignmentId: assignment._id };
                if (userId && studentUser?.role === 'student') {
                    query.userId = new Types.ObjectId(userId);
                } else {
                    query.rollNumber = rollNumber;
                }

                const existingSubmission = await this.submissionModel.findOne(query);

                if (existingSubmission) {
                    // Delete old file from Cloudinary if exists
                    if (existingSubmission.fileUrl) {
                        try {
                            await this.cloudinaryService.deleteFile(existingSubmission.fileUrl);
                            console.log('🗑️ Deleted old Cloudinary file');
                        } catch (e) {
                            console.error('Failed to delete old Cloudinary file:', e);
                        }
                    }
                    // Delete old record
                    await this.submissionModel.deleteOne({ _id: existingSubmission._id });
                    console.log('✅ Deleted old submission record');
                }

                // 3. Upload to Cloudinary
                const cloudinaryResult = await this.cloudinaryService.uploadFile(file);
                const fileUrl = cloudinaryResult.secure_url;

                // 4. Extract Text from PDF
                const parser = new PDFParse(new Uint8Array(file.buffer));
                const pdfData = await parser.getText();
                const content = pdfData.text;

                // 5. AI Evaluation (Only if teacher requests or deadline passed? For now, skip for students to save credits)
                // User Request: "result of all submission should only be generated and shown if the deadline has reached"

                let evaluation = {
                    score: 0,
                    remarks: 'Pending Evaluation',
                    breakdown: []
                };

                // For now, we only run AI immediately if it's a TEACHER uploading (batch upload usually implies immediate need)
                // OR if we want to enable it. 
                // Given the requirement, we will mark it as pending.
                // TODO: specific trigger for evaluation after deadline.

                // If we want to run it ONLY if deadline passed (which is weird for submission flow), we skip.

                // 6. Save Submission
                // 6. Save Submission
                const submission = new this.submissionModel({
                    assignmentId: (assignment as any)._id,
                    userId: userId ? new Types.ObjectId(userId) : undefined,
                    studentName,
                    rollNumber,
                    content,
                    fileUrl,
                    score: evaluation.score,
                    remarks: evaluation.remarks,
                    breakdown: evaluation.breakdown,
                    createdAt: new Date(),
                });

                await submission.save();
                success.push(submission);
            } catch (error) {
                console.error(`Error processing ${file.originalname}:`, error);
                errors.push({
                    filename: file.originalname,
                    message: error.message,
                });
            }
        }

        return { success, errors };
    }

    async getAIInsights(teacherId: string): Promise<{ insight: string }> {
        // Fetch last 5 assignments for this teacher
        const assignments = await this.assignmentModel.find({ teacherId: new Types.ObjectId(teacherId) })
            .sort({ createdAt: -1 })
            .limit(5)
            .exec();

        if (assignments.length === 0) return { insight: "Start by creating an assignment to get AI insights." };

        // Fetch submissions for these assignments
        const assignmentIds = assignments.map(a => a._id);
        const submissions = await this.submissionModel.find({ assignmentId: { $in: assignmentIds } })
            .limit(20)
            .exec();

        if (submissions.length === 0) return { insight: "Waiting for student submissions to generate insights." };

        const context = submissions.map(s => ({
            assignment: assignments.find(a => a._id.toString() === s.assignmentId.toString())?.title,
            score: s.score,
            remarks: s.remarks
        }));

        const agent = createEvaluationAgent(); // Reusing the agent or creating a specific one for insights
        const query = `
            Analyze these recent student evaluations and provide a single, short, 1-2 sentence impactful insight or recommendation for the teacher.
            DO NOT return JSON. Just a plain string.
            
            Submissions:
            ${JSON.stringify(context, null, 2)}
        `;

        try {
            const result = await runAgent(agent, query);
            return { insight: result.finalOutput.trim() };
        } catch (error) {
            console.error('AI Insight Error:', error);
            return { insight: "Unable to generate insights at this time." };
        }
    }

    async evaluateSubmission(submissionId: string, assignmentId: string) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        const submission = await this.submissionModel.findById(submissionId);

        if (!assignment || !submission) {
            throw new NotFoundException('Assignment or Submission not found');
        }

        const agent = createEvaluationAgent();
        const query = `
            ASSIGNMENT INSTRUCTIONS:
            ${assignment.instructions}

            MARKING MODE: ${assignment.markingMode}

            STUDENT SUBMISSION CONTENT:
            ${submission.content}

            Please evaluate this submission based on the instructions and marking mode.
            Return a valid JSON object as specified in your instructions.
        `;

        try {
            const result = await runAgent(agent, query);
            const evaluation = JSON.parse(result.finalOutput);

            submission.score = evaluation.score;
            submission.remarks = evaluation.remarks;
            submission.breakdown = evaluation.breakdown;

            await submission.save();
            return submission;
        } catch (error) {
            console.error(`AI Evaluation Error for submission ${submissionId}:`, error);
            throw new Error(`Failed to evaluate submission: ${error.message}`);
        }
    }

    async onModuleInit() {
        // Schedule evaluation for all future deadlines on startup
        console.log('🚀 AssignmentsService initialized. Scheduling existing deadlines...');
        const futureAssignments = await this.assignmentModel.find();
        futureAssignments.forEach(assignment => {
            this.scheduleDeadlineEvaluation(assignment);
        });
    }

    private scheduleDeadlineEvaluation(assignment: AssignmentDocument) {
        if (!assignment.autoEvaluation) {
            console.log(`ℹ️ Auto-evaluation is DISABLED for "${assignment.title}".`);
            return;
        }

        const deadline = new Date(assignment.deadline);
        const now = new Date();
        const timeoutName = `evaluate-assignment-${assignment._id}`;

        // Remove existing timeout if any (for updates)
        try {
            if (this.schedulerRegistry.getTimeout(timeoutName)) {
                this.schedulerRegistry.deleteTimeout(timeoutName);
            }
        } catch (e) {
            // Timeout doesn't exist, ignore
        }

        const delay = deadline.getTime() - now.getTime();

        if (delay <= 0) {
            // Deadline already passed, process immediately
            console.log(`🕒 Deadline passed for "${assignment.title}". Checking for pending submissions...`);
            this.checkAndEvaluatePending(assignment);
        } else {
            // Safety cap for setTimeout (32-bit signed int max is ~24.8 days)
            const MAX_TIMEOUT = 2147483647;

            if (delay > MAX_TIMEOUT) {
                console.log(`⏳ Deadline for "${assignment.title}" is too far (> 24 days). Scheduling re-check...`);
                const timeout = setTimeout(() => {
                    this.scheduleDeadlineEvaluation(assignment);
                }, MAX_TIMEOUT);
                this.schedulerRegistry.addTimeout(timeoutName, timeout);
            } else {
                // Schedule future evaluation
                console.log(`📅 Scheduled evaluation for "${assignment.title}" at ${deadline.toLocaleString()} (in ${Math.round(delay / 1000 / 60)} mins)`);
                const timeout = setTimeout(() => {
                    console.log(`⏰ Deadline reached for "${assignment.title}". Starting evaluation...`);
                    this.checkAndEvaluatePending(assignment);
                }, delay);

                this.schedulerRegistry.addTimeout(timeoutName, timeout);
            }
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCronSync() {
        console.log('🔄 Running hourly auto-evaluation sync...');
        const now = new Date();

        // 1. Ensure all future auto-evaluations are scheduled
        const futureAssignments = await this.assignmentModel.find({
            autoEvaluation: true,
            deadline: { $gt: now }
        });

        futureAssignments.forEach(assignment => {
            const timeoutName = `evaluate-assignment-${assignment._id}`;
            try {
                this.schedulerRegistry.getTimeout(timeoutName);
            } catch (e) {
                // Not scheduled or lost, re-schedule
                this.scheduleDeadlineEvaluation(assignment);
            }
        });

        // 2. Catch up on anything that might have missed its deadline
        await this.autoEvaluatePastDeadlines();
    }

    private async checkAndEvaluatePending(assignment: AssignmentDocument) {
        const pendingCount = await this.submissionModel.countDocuments({
            assignmentId: assignment._id,
            remarks: "Pending Evaluation"
        });

        if (pendingCount > 0) {
            console.log(`🤖 Auto-evaluating ${pendingCount} pending submissions for "${assignment.title}"...`);
            await this.evaluateAllPendingSubmissions(assignment._id.toString());
        } else {
            console.log(`✅ No pending submissions for "${assignment.title}".`);
        }
    }

    async autoEvaluatePastDeadlines() {
        // This method is now legacy but we'll keep it as a fallback if needed
        console.log('🕒 Checking for assignments past deadline for auto-evaluation...');
        const now = new Date();
        const pastAssignments = await this.assignmentModel.find({
            deadline: { $lt: now }
        });

        for (const assignment of pastAssignments) {
            await this.checkAndEvaluatePending(assignment);
        }
    }

    async evaluateAllPendingSubmissions(assignmentId: string) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        const pendingSubmissions = await this.submissionModel.find({
            assignmentId: new Types.ObjectId(assignmentId),
            remarks: "Pending Evaluation"
        });

        if (pendingSubmissions.length === 0) {
            return { message: 'No pending submissions to evaluate', evaluated: 0 };
        }

        const results: any[] = [];
        for (const submission of pendingSubmissions) {
            try {
                const evaluated = await this.evaluateSubmission(submission._id.toString(), assignmentId);
                results.push(evaluated);
            } catch (error) {
                console.error(`Failed to evaluate submission ${submission._id}:`, error);
            }
        }

        return {
            message: `Evaluated ${results.length} out of ${pendingSubmissions.length} submissions`,
            evaluated: results.length,
            total: pendingSubmissions.length
        };
    }

    async exportSubmissionsToCsv(assignmentId: string): Promise<string> {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        const submissions = await this.submissionModel.find({ assignmentId: new Types.ObjectId(assignmentId) });

        // Collect all unique breakdown keys
        const breakdownKeys = new Set<string>();
        submissions.forEach(s => {
            if (s.breakdown && typeof s.breakdown === 'object') {
                Object.keys(s.breakdown).forEach(k => breakdownKeys.add(k));
            }
        });

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'studentName', title: 'STUDENT NAME' },
                { id: 'rollNumber', title: 'ROLL NUMBER' },
                { id: 'score', title: 'SCORE (%)' },
                ...Array.from(breakdownKeys).map(key => ({
                    id: `breakdown_${key}`,
                    title: key.replace(/([A-Z])/g, ' $1').toUpperCase().trim()
                })),
                { id: 'remarks', title: 'REMARKS' },
                { id: 'createdAt', title: 'SUBMITTED AT' }
            ]
        });

        const records = submissions.map(s => {
            const row: any = {
                studentName: s.studentName,
                rollNumber: s.rollNumber,
                score: s.score || 0,
                remarks: s.remarks,
                createdAt: s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'
            };

            if (s.breakdown && typeof s.breakdown === 'object') {
                Object.entries(s.breakdown).forEach(([key, val]) => {
                    row[`breakdown_${key}`] = val;
                });
            }

            return row;
        });

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    }
}
