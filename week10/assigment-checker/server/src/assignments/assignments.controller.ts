import {
    Controller, Post, Get, Body, Param, UseGuards, Request,
    UseInterceptors, UploadedFiles, Res, BadRequestException, Patch, Query
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignmentsService } from './assignments.service';
import type { Response } from 'express';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Get('dashboard-stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async getDashboardStats(@Request() req) {
        return this.assignmentsService.getDashboardStats(req.user.userId);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async getStats(@Request() req) {
        return this.assignmentsService.getDashboardStats(req.user.userId);
    }

    @Get('my-submissions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('student')
    async getMySubmissions(@Request() req) {
        return this.assignmentsService.getStudentSubmissions(req.user.userId);
    }



    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async createAssignment(@Body() data: CreateAssignmentDto, @Request() req) {
        return this.assignmentsService.createAssignment(data, req.user.userId);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async updateAssignment(@Param('id') id: string, @Body() updateData: UpdateAssignmentDto) {
        return this.assignmentsService.updateAssignment(id, updateData);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAssignments(@Request() req) {
        if (req.user.role === 'teacher') {
            return this.assignmentsService.getAssignments(req.user.userId);
        }
        return this.assignmentsService.getAssignments();
    }

    @Get('insights')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async getAIInsights(@Request() req) {
        return this.assignmentsService.getAIInsights(req.user.userId);
    }

    @Get(':id/submissions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async getSubmissions(@Param('id') id: string) {
        return this.assignmentsService.getSubmissions(id);
    }

    @Get('submission/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher', 'student')
    async getSubmission(@Param('id') id: string) {
        return this.assignmentsService.getSubmission(id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getAssignment(@Param('id') id: string) {
        return this.assignmentsService.getAssignment(id);
    }

    @Post(':id/upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FilesInterceptor('files', 50))
    @Roles('teacher', 'student')
    async uploadSubmissions(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Request() req,
        @Body() body: { rollNumber?: string, studentName?: string }
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        // For students, userId is from auth. For teachers, userId is undefined (batch upload)
        const userId = req.user.role === 'student' ? req.user.userId : undefined;

        // For teacher uploading on behalf of student
        const metadata = (req.user.role === 'teacher' && body.rollNumber && body.studentName)
            ? { rollNumber: body.rollNumber, studentName: body.studentName }
            : undefined;

        return this.assignmentsService.processSubmissions(id, files, userId, metadata);
    }


    @Post('batch-upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FilesInterceptor('files', 50))
    @Roles('teacher')
    async batchUpload(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body('assignmentId') assignmentId: string
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        if (!assignmentId) {
            throw new BadRequestException('Assignment ID is required');
        }

        return this.assignmentsService.processSubmissions(assignmentId, files, '', undefined);
    }

    @Post('evaluate/:submissionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async evaluateSubmission(
        @Param('submissionId') submissionId: string,
        @Body() body: { assignmentId: string }
    ) {
        if (!body.assignmentId) {
            throw new BadRequestException('Assignment ID is required');
        }
        const submission = await this.assignmentsService.evaluateSubmission(submissionId, body.assignmentId);
        return {
            success: true,
            submission
        };
    }

    @Post(':id/evaluate-all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async evaluateAllSubmissions(@Param('id') assignmentId: string) {
        return this.assignmentsService.evaluateAllPendingSubmissions(assignmentId);
    }

    @Get(':id/export')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    async exportResults(@Param('id') id: string, @Res() res: Response) {
        const assignment = await this.assignmentsService.getAssignment(id);
        const csv = await this.assignmentsService.exportSubmissionsToCsv(id);

        const safeTitle = assignment.title.replace(/[^a-z0-9]/gi, '_');
        const filename = `${safeTitle}-marksheet.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(csv);
    }

    @Get('pdf-proxy')
    async proxyPdf(@Query('url') url: string, @Res() res: Response) {
        if (!url) {
            return res.status(400).send('URL parameter is required');
        }

        try {
            const https = await import('https');
            const http = await import('http');

            const protocol = url.startsWith('https') ? https : http;

            protocol.get(url, (response) => {
                if (response.statusCode && response.statusCode !== 200) {
                    return res.status(response.statusCode).send('Failed to fetch PDF');
                }

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline');
                response.pipe(res);
            }).on('error', (error) => {
                console.error('PDF Proxy Error:', error);
                res.status(500).send('Error fetching PDF');
            });
        } catch (error) {
            console.error('PDF Proxy Error:', error);
            res.status(500).send('Error fetching PDF');
        }
    }
}
