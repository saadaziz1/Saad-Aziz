/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

// ✅ Import puppeteer-core and chromium
import * as puppeteer from 'puppeteer-core';
import * as chromium from '@sparticuz/chromium';

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>) {}

  async create(ownerId: string, dto: CreateResumeDto) {
    const created = new this.resumeModel({ ...dto, owner: new Types.ObjectId(ownerId) });
    return created.save();
  }

  async findAllByUser(ownerId: string) {
    return this.resumeModel
      .find({ owner: new Types.ObjectId(ownerId) })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async findOne(ownerId: string, resumeId: string) {
    if (!isValidObjectId(resumeId)) throw new BadRequestException('Invalid resume ID');
    const r = await this.resumeModel.findOne({
      _id: resumeId,
      owner: new Types.ObjectId(ownerId),
    }).lean();
    if (!r) throw new NotFoundException('Resume not found');
    return r;
  }

  async update(ownerId: string, resumeId: string, dto: UpdateResumeDto) {
    if (!isValidObjectId(resumeId)) throw new BadRequestException('Invalid resume ID');
    const r = await this.resumeModel.findOneAndUpdate(
      { _id: resumeId, owner: new Types.ObjectId(ownerId) },
      dto,
      { new: true, lean: true },
    );
    if (!r) throw new NotFoundException('Resume not found');
    return r;
  }

  async remove(ownerId: string, resumeId: string) {
    if (!isValidObjectId(resumeId)) throw new BadRequestException('Invalid resume ID');
    const r = await this.resumeModel.findOneAndDelete({
      _id: resumeId,
      owner: new Types.ObjectId(ownerId),
    });
    if (!r) throw new NotFoundException('Resume not found');
    return { deleted: true };
  }

  async generatePdf(ownerId: string, resumeId: string) {
    try {
      console.log("📌 generatePdf called with:", { ownerId, resumeId });

      const resume = await this.findOne(ownerId, resumeId);
      if (!resume) throw new Error("Resume not found");
      console.log("✅ Resume found:", resume.fullName);

      // ✅ Puppeteer launch with chromium config
      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath:
          process.env.NODE_ENV === 'production'
            ? await chromium.executablePath()
            : undefined, // local Chrome in dev
        headless: chromium.headless,
      });

      console.log("✅ Puppeteer browser launched");

      const page = await browser.newPage();
      const html = this.renderResumeHtml(resume);

      await page.setContent(html, { waitUntil: 'load', timeout: 0 });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();
      return pdfBuffer;
    } catch (err) {
      console.error('❌ PDF generation error:', err);
      throw err;
    }
  }

  private renderResumeHtml(resume: Resume) {
    const renderBullets = (items: string[]) =>
      items.map(item => `<li class="ml-4 list-disc text-gray-700">${item}</li>`).join('') || '';

    const education = resume.education?.map(e => `
      <div class="mb-2">
        <div class="font-bold">${e.degree || ''} — ${e.school || ''}</div>
        <div class="italic text-gray-500 text-sm">${e.startYear || ''} – ${e.endYear || 'Present'}</div>
        ${e.description ? `<ul>${renderBullets([e.description])}</ul>` : ''}
      </div>
    `).join('') || '';

    const experience = resume.experience?.map(exp => `
      <div class="mb-2">
        <div class="font-bold">${exp.role || ''} — ${exp.company || ''}</div>
        <div class="italic text-gray-500 text-sm">${exp.startDate || ''} – ${exp.endDate || 'Present'}</div>
        ${exp.description ? `<ul>${renderBullets([exp.description])}</ul>` : ''}
      </div>
    `).join('') || '';

    const projects = resume.projects?.map(p => `
      <div class="mb-2">
        <div class="font-bold">
          ${p.name || ''} ${p.url ? `<a href="${p.url}" target="_blank" class="text-indigo-600 underline text-sm">[Link]</a>` : ''}
        </div>
        ${p.description ? `<ul>${renderBullets([p.description])}</ul>` : ''}
      </div>
    `).join('') || '';

    const skills = resume.skills?.length ? `<ul>${renderBullets(resume.skills)}</ul>` : '';
    const certifications = resume.certifications?.length ? `<ul>${renderBullets(resume.certifications)}</ul>` : '';
    const languages = resume.languages?.length ? `<ul>${renderBullets(resume.languages)}</ul>` : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${resume.fullName} - CV</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 1in;
              line-height: 1.5;
              font-size: 11pt;
            }
            .text-gray-500 { color: #6b7280; }
            .text-gray-700 { color: #374151; }
            .text-indigo-600 { color: #4f46e5; }
            .font-bold { font-weight: bold; }
            .italic { font-style: italic; }
            .text-sm { font-size: 0.875rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .list-disc { list-style-type: disc; }
            .ml-4 { margin-left: 1rem; }
            .underline { text-decoration: underline; }
            h3 { font-size: 1.25rem; font-weight: bold; color: #374151; border-bottom: 2px solid #d1d5db; padding-bottom: 0.25rem; margin-bottom: 0.5rem; }
          </style>
        </head>
        <body>
          <header class="mb-6 text-center">
            <h1 class="font-bold text-3xl">${resume.fullName}</h1>
            ${resume.title ? `<div class="text-indigo-600 text-lg font-medium">${resume.title}</div>` : ''}
            <div class="mt-2 flex justify-center gap-4 text-sm text-gray-600">
              ${resume.email ? `<span>${resume.email}</span>` : ''}
              ${resume.email && resume.phone ? `<span>|</span>` : ''}
              ${resume.phone ? `<span>${resume.phone}</span>` : ''}
            </div>
          </header>

          ${resume.summary ? `<section class="mb-4"><h3>Summary</h3><p class="text-gray-700">${resume.summary}</p></section>` : ''}

          ${skills ? `<section class="mb-4"><h3>Skills</h3>${skills}</section>` : ''}

          ${experience ? `<section class="mb-4"><h3>Experience</h3>${experience}</section>` : ''}

          ${education ? `<section class="mb-4"><h3>Education</h3>${education}</section>` : ''}

          ${projects ? `<section class="mb-4"><h3>Projects</h3>${projects}</section>` : ''}

          ${certifications ? `<section class="mb-4"><h3>Certifications</h3>${certifications}</section>` : ''}

          ${languages ? `<section class="mb-4"><h3>Languages</h3>${languages}</section>` : ''}
        </body>
      </html>
    `;
  }
}
