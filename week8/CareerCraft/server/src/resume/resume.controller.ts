import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateResumeDto) {
    const userId = (req as any).user._id;
    return this.resumeService.create(userId, dto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req as any).user._id;
    return this.resumeService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user._id;
    const resume = await this.resumeService.findOne(userId, id);
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return resume;
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    const userId = (req as any).user._id;
    const updated = await this.resumeService.update(userId, id, dto);
    if (!updated) {
      throw new NotFoundException('Resume not found or could not be updated');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user._id;
    const removed = await this.resumeService.remove(userId, id);
    if (!removed) {
      throw new NotFoundException('Resume not found or could not be deleted');
    }
    return { message: 'Resume deleted successfully' };
  }

  @Get(':id/pdf')
async downloadPdf(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
  try {
    const userId = (req as any).user._id;
    if (!userId) throw new NotFoundException('User not found in request');

    const pdfBuffer = await this.resumeService.generatePdf(userId, id);
    if (!pdfBuffer) throw new NotFoundException('Resume PDF could not be generated');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=resume_${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (err) {
    console.error('❌ PDF generation failed:', err);
    // Instead of masking:
    res.status(500).json({ message: err.message, stack: err.stack });
  }
}

}
