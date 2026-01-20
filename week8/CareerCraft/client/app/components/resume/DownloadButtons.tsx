'use client';
import React from 'react';
import { FaDownload } from 'react-icons/fa';

export default function DownloadButtons({ resumeId, watch }: { resumeId?: string; watch: any }) {
  const data = watch();

  const downloadPdf = async () => {
    if (!resumeId) return alert("Save resume first!");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}resumes/${resumeId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data.fullName || "resume").replace(/\s+/g, "")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Failed to download PDF");
    }
  };

 const downloadDocx = async () => {
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
      border: { bottom: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 } },
      children: [new TextRun({ text: title, bold: true, size: 28 })],
    });

  // --- Summary ---
  if (data.summary) {
    children.push(sectionHeader("Summary"));
    children.push(new Paragraph({ text: data.summary, spacing: { after: 100 } }));
  }

  // --- Skills ---
  if (data.skills?.length) {
    children.push(sectionHeader("Skills"));
    data.skills.forEach((skill: string) => 
      children.push(new Paragraph({ text: `• ${skill}` }))
    );
  }

  // --- Education ---
  if (data.education?.length) {
    children.push(sectionHeader("Education"));
    data.education.forEach((edu: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: edu.degree || "", bold: true }),
          new TextRun({ text: ` — ${edu.school || ""}` }),
          new TextRun({ text: ` (${edu.startYear || ""} - ${edu.endYear || ""})`, italics: true }),
        ]
      }));
      if (edu.description) children.push(new Paragraph({ text: edu.description, bullet: { level: 0 } }));
    });
  }

  // --- Experience ---
  if (data.experience?.length) {
    children.push(sectionHeader("Experience"));
    data.experience.forEach((exp: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: exp.role || "", bold: true }),
          new TextRun({ text: ` — ${exp.company || ""}` }),
          new TextRun({ text: ` (${exp.startDate || ""} - ${exp.endDate || "Present"})`, italics: true }),
        ]
      }));
      if (exp.description) children.push(new Paragraph({ text: exp.description, bullet: { level: 0 } }));
    });
  }

  // --- Projects ---
  if (data.projects?.length) {
    children.push(sectionHeader("Projects"));
    data.projects.forEach((p: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: p.name || "", bold: true }),
          p.url ? new TextRun({ text: ` (${p.url})`, color: "0563C1", underline: {} }) : null
        ].filter(Boolean)
      }));
      if (p.description) children.push(new Paragraph({ text: p.description, bullet: { level: 0 } }));
    });
  }

  // --- Certifications ---
  if (data.certifications?.length) {
    children.push(sectionHeader("Certifications"));
    data.certifications.forEach((c: any) => 
      children.push(new Paragraph({ text: `• ${c}` }))
    );
  }

  // --- Languages ---
  if (data.languages?.length) {
    children.push(sectionHeader("Languages"));
    data.languages.forEach((l: any) => 
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
    <>
      <button onClick={downloadPdf} type="button" className="inline-flex items-center gap-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50">
        <FaDownload /> Download PDF
      </button>
      <button onClick={downloadDocx} type="button" className="inline-flex items-center gap-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50">
        <FaDownload /> Download DOCX
      </button>
    </>
  );
}
