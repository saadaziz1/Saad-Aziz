import { Resume } from "../types/resume";
import {
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Languages,
} from "lucide-react";

export default function ResumePreview({ data }: { data: Resume }) {
  const sectionHeader = (title: string) => (
    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-2">
      {title}
    </h3>
  );

  const renderBullets = (items: string[]) =>
    items.map((item, i) => (
      <li key={i} className="ml-4 list-disc text-gray-700">{item}</li>
    ));

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-200">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{data.fullName}</h1>
        {data.title && <div className="text-lg text-indigo-600 font-medium">{data.title}</div>}
        <div className="mt-2 flex justify-center gap-4 text-sm text-gray-600">
          {data.email && <span className="flex items-center gap-1"><Mail size={14} /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><Phone size={14} /> {data.phone}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          {sectionHeader("Summary")}
          <p className="text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section className="mb-4">
          {sectionHeader("Skills")}
          <ul>{renderBullets(data.skills)}</ul>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-4">
          {sectionHeader("Experience")}
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-2">
              <div className="font-bold">{exp.role} — {exp.company}</div>
              <div className="italic text-gray-500 text-sm">{exp.startDate} – {exp.endDate || "Present"}</div>
              {exp.description && <ul>{renderBullets([exp.description])}</ul>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <section className="mb-4">
          {sectionHeader("Education")}
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="font-bold">{edu.degree} — {edu.school}</div>
              <div className="italic text-gray-500 text-sm">{edu.startYear} – {edu.endYear}</div>
              {edu.description && <ul>{renderBullets([edu.description])}</ul>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-4">
          {sectionHeader("Projects")}
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <div className="font-bold">
                {proj.name} {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline text-sm">[Link]</a>}
              </div>
              {proj.description && <ul>{renderBullets([proj.description])}</ul>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <section className="mb-4">
          {sectionHeader("Certifications")}
          <ul>{renderBullets(data.certifications)}</ul>
        </section>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <section className="mb-4">
          {sectionHeader("Languages")}
          <ul>{renderBullets(data.languages)}</ul>
        </section>
      )}
    </div>
  );
}
