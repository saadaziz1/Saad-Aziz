'use client';
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DownloadButtons({ resumeId, watch, disableDownload }: { resumeId?: string; watch: any; disableDownload?: boolean }) {
  const data = watch();

  const downloadPdf = async () => {
    // Client-side PDF generation
    if (typeof window === 'undefined') return;

    if (disableDownload) {
      toast.error("Please save your changes before downloading.");
      return;
    }

    const element = document.getElementById('resume-pdf-content');
    if (!element) {
      toast.error("Constructing PDF... please wait a moment and try again.");
      return;
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: `${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollY: 0,
          onclone: (clonedDoc: Document) => {
            // Fix for Tailwind CSS v4 / html2canvas color parsing issues (lab/oklch)
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              * { 
                --tw-ring-color: rgba(0,0,0,0) !important;
                --tw-ring-offset-color: rgba(0,0,0,0) !important;
                --tw-shadow-color: rgba(0,0,0,0) !important;
                --tw-outline-color: rgba(0,0,0,0) !important;
                /* Reset any color functions that html2canvas might choke on */
                accent-color: auto !important;
                caret-color: auto !important;
                outline-color: currentColor !important;
                box-shadow: none !important;
                text-shadow: none !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: '.avoid-break-inside' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const downloadDocx = async () => {
    if (disableDownload) {
      toast.error("Please save your changes before downloading.");
      return;
    }
    const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = await import("docx");
    const children: any[] = [];

    // --- Header ---
    if (data.fullName) children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.fullName, bold: true, size: 48 })]
      })
    );

    if (data.title) children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.title, italics: true, size: 28 })]
      })
    );

    if (data.email || data.phone) children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: data.email || "", size: 24 }),
          new TextRun({ text: data.email && data.phone ? " | " : "", size: 24 }),
          new TextRun({ text: data.phone || "", size: 24 }),
        ]
      })
    );

    children.push(new Paragraph({ text: "" })); // spacing

    // --- Helper for section headers ---
    const sectionHeader = (title: string) =>
      new Paragraph({
        spacing: { before: 300, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        children: [new TextRun({ text: title, bold: true, size: 28 })],
      });

    // --- Summary ---
    if (data.summary && data.summary.trim().length > 0) {
      children.push(sectionHeader("Summary"));
      children.push(new Paragraph({ text: data.summary, spacing: { after: 100 } }));
    }

    // --- Skills ---
    const validSkills = data.skills?.filter((s: string) => s && s.trim().length > 0) || [];
    if (validSkills.length > 0) {
      children.push(sectionHeader("Skills"));
      validSkills.forEach((skill: string) =>
        children.push(new Paragraph({ text: `• ${skill}` }))
      );
    }

    // --- Education ---
    const validEducation = data.education?.filter((edu: any) => edu.degree?.trim() || edu.school?.trim()) || [];
    if (validEducation.length > 0) {
      children.push(sectionHeader("Education"));
      validEducation.forEach((edu: any) => {
        const endDateDisplay = edu.isCurrent ? "Present" : (edu.endYear || "");
        children.push(new Paragraph({
          children: [
            new TextRun({ text: edu.degree || "", bold: true }),
            new TextRun({ text: ` — ${edu.school || ""}` }),
            new TextRun({ text: ` (${edu.startYear || ""} - ${endDateDisplay})`, italics: true }),
          ]
        }));
        if (edu.description) children.push(new Paragraph({ text: edu.description, bullet: { level: 0 } }));
      });
    }

    // --- Experience ---
    const validExperience = data.experience?.filter((exp: any) => exp.company?.trim() || exp.role?.trim()) || [];
    if (validExperience.length > 0) {
      children.push(sectionHeader("Experience"));
      validExperience.forEach((exp: any) => {
        const endDateDisplay = exp.isCurrent ? "Present" : (exp.endDate || "");
        children.push(new Paragraph({
          children: [
            new TextRun({ text: exp.role || "", bold: true }),
            new TextRun({ text: ` — ${exp.company || ""}` }),
            new TextRun({ text: ` (${exp.startDate || ""} - ${endDateDisplay})`, italics: true }),
          ]
        }));
        if (exp.description) children.push(new Paragraph({ text: exp.description, bullet: { level: 0 } }));
      });
    }

    // --- Projects ---
    const validProjects = data.projects?.filter((p: any) => p.name?.trim()) || [];
    if (validProjects.length > 0) {
      children.push(sectionHeader("Projects"));
      validProjects.forEach((p: any) => {
        const projectChilds: any[] = [
          new TextRun({ text: p.name || "", bold: true })
        ];
        if (p.url) {
          projectChilds.push(new TextRun({ text: ` (${p.url})`, color: "0563C1", underline: {} }));
        }

        children.push(new Paragraph({
          children: projectChilds
        }));
        if (p.description) children.push(new Paragraph({ text: p.description, bullet: { level: 0 } }));
      });
    }

    // --- Certifications ---
    const validCertifications = data.certifications?.filter((c: string) => c && c.trim().length > 0) || [];
    if (validCertifications.length > 0) {
      children.push(sectionHeader("Certifications"));
      validCertifications.forEach((c: any) =>
        children.push(new Paragraph({ text: `• ${c}` }))
      );
    }

    // --- Languages ---
    const validLanguages = data.languages?.filter((l: string) => l && l.trim().length > 0) || [];
    if (validLanguages.length > 0) {
      children.push(sectionHeader("Languages"));
      validLanguages.forEach((l: any) =>
        children.push(new Paragraph({ text: `• ${l}` }))
      );
    }

    // --- Build and download ---
    const doc = new Document({ sections: [{ properties: {}, children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.fullName || "resume").replace(/\s+/g, "_")}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex gap-4">
      <button
        onClick={downloadPdf}
        type="button"
        disabled={disableDownload}
        title={disableDownload ? "Please save changes first" : "Download PDF"}
        className={`inline-flex items-center gap-2 p-3 rounded-lg border border-gray-300 transition-colors
            ${disableDownload ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50 text-gray-700"}
        `}
      >
        <FaDownload /> Download PDF
      </button>
      <button
        onClick={downloadDocx}
        type="button"
        disabled={disableDownload}
        title={disableDownload ? "Please save changes first" : "Download DOCX"}
        className={`inline-flex items-center gap-2 p-3 rounded-lg border border-gray-300 transition-colors
            ${disableDownload ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50 text-gray-700"}
        `}
      >
        <FaDownload /> Download DOCX
      </button>
    </div>
  );
}
