import React, { useEffect, useRef, useState } from "react";
import { Resume, FormValues } from "../../types/resume";
import {
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Languages,
} from "lucide-react";

// Constants
const A4_HEIGHT_PX = 1123;
const GAP_PX = 40;
interface ResumePreviewProps {
  data: Resume | FormValues;
  enableScaling?: boolean;
}

export default function ResumePreview({ data, enableScaling = true }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [paginatedPages, setPaginatedPages] = useState<React.ReactNode[][]>([]);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Constants
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const PAGE_PADDING_PX = 40; // 40px top/bottom/left/right
  const CONTENT_MAX_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING_PX * 2);

  // 1. Generate Atomic Blocks from Data
  const getResumeBlocks = (): { id: string; content: React.ReactNode }[] => {
    const blocks: { id: string; content: React.ReactNode }[] = [];

    // --- Header ---
    blocks.push({
      id: "header",
      content: (
        <header className="mb-6 text-center break-words">
          <h1 className="text-4xl font-extrabold break-words tracking-tight" style={{ color: '#111827' }}>{data.fullName}</h1>
          {data.title && <div className="text-xl font-medium break-words mt-1" style={{ color: '#047857' }}>{data.title}</div>}
          <div className="mt-3 flex flex-wrap justify-center gap-6 text-sm font-medium" style={{ color: '#4b5563' }}>
            {data.email && <span className="flex items-center gap-2 break-all"><Mail size={16} style={{ color: '#10b981' }} className="shrink-0" /> {data.email}</span>}
            {data.phone && <span className="flex items-center gap-2 break-all"><Phone size={16} style={{ color: '#10b981' }} className="shrink-0" /> {data.phone}</span>}
          </div>
        </header>
      ),
    });

    // --- Section Helper ---
    const SectionTitle = ({ title }: { title: string }) => (
      <h3 className="flex items-center gap-2 text-xl font-bold pb-1 mb-2" style={{ color: '#1f2937', borderBottom: '2px solid #d1d5db' }}>
        {title}
      </h3>
    );

    // --- Summary ---
    if (data.summary && data.summary.trim()) {
      blocks.push({
        id: "summary",
        content: (
          <section className="mb-6 break-words whitespace-pre-wrap">
            <SectionTitle title="Summary" />
            <p className="leading-7" style={{ color: '#374151' }}>{data.summary}</p>
          </section>
        ),
      });
    }

    // --- Skills ---
    const validSkills = data.skills?.filter((s) => s && s.trim().length > 0) ?? [];
    if (validSkills.length > 0) {
      blocks.push({
        id: "skills",
        content: (
          <section className="mb-6">
            <SectionTitle title="Skills" />
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {validSkills.map((item, i) => (
                <li key={i} className="flex items-start gap-2 break-words" style={{ color: '#374151' }}>
                  <span className="w-2 h-2 mt-2 rounded-full shrink-0" style={{ backgroundColor: '#10b981' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ),
      });
    }

    // --- Experience ---
    const validExperience = data.experience?.filter((e) => e.company?.trim() || e.role?.trim()) ?? [];
    if (validExperience.length > 0) {
      // Header for Experience
      blocks.push({ id: "exp-header", content: <div className="mb-2"><SectionTitle title="Experience" /></div> });
      // Items
      validExperience.forEach((exp: any, i) => {
        blocks.push({
          id: `exp-${i}`,
          content: (
            <div className="mb-4 break-words">
              <div className="flex justify-between items-baseline flex-wrap">
                <div className="font-bold text-lg" style={{ color: '#111827' }}>{exp.role}</div>
                <div className="font-semibold" style={{ color: '#059669' }}>{exp.company}</div>
              </div>
              <div className="italic text-sm mb-2" style={{ color: '#6b7280' }}>{exp.startDate} – {exp.isCurrent ? "Present" : (exp.endDate || "")}</div>
              {exp.description && <div className="whitespace-pre-wrap leading-6 text-sm" style={{ color: '#374151' }}>{exp.description}</div>}
            </div>
          ),
        });
      });
    }

    // --- Education ---
    const validEducation = data.education?.filter((e) => e.school?.trim() || e.degree?.trim()) ?? [];
    if (validEducation.length > 0) {
      blocks.push({ id: "edu-header", content: <div className="mb-2"><SectionTitle title="Education" /></div> });
      validEducation.forEach((edu: any, i) => {
        blocks.push({
          id: `edu-${i}`,
          content: (
            <div className="mb-4 break-words">
              <div className="flex justify-between items-baseline flex-wrap">
                <div className="font-bold text-lg" style={{ color: '#111827' }}>{edu.degree}</div>
                <div className="font-semibold" style={{ color: '#059669' }}>{edu.school}</div>
              </div>
              <div className="italic text-sm mb-2" style={{ color: '#6b7280' }}>{edu.startYear} – {edu.isCurrent ? "Present" : (edu.endYear || "")}</div>
              {edu.description && <div className="whitespace-pre-wrap leading-6 text-sm" style={{ color: '#374151' }}>{edu.description}</div>}
            </div>
          ),
        });
      });
    }

    // --- Projects ---
    const validProjects = data.projects?.filter((p) => p.name?.trim()) ?? [];
    if (validProjects.length > 0) {
      blocks.push({ id: "proj-header", content: <div className="mb-2"><SectionTitle title="Projects" /></div> });
      validProjects.forEach((proj: any, i) => {
        blocks.push({
          id: `proj-${i}`,
          content: (
            <div className="mb-4 break-words">
              <div className="font-bold text-lg" style={{ color: '#111827' }}>
                {proj.name}
                {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ color: '#059669' }} className="ml-2 underline text-sm max-w-full inline-block truncate align-bottom">[Link]</a>}
              </div>
              {proj.description && <div className="whitespace-pre-wrap leading-6 text-sm" style={{ color: '#374151' }}>{proj.description}</div>}
            </div>
          ),
        });
      });
    }

    // --- Certifications ---
    const validCertifications = data.certifications?.filter((c) => c && c.trim().length > 0) ?? [];
    if (validCertifications.length > 0) {
      blocks.push({
        id: "certs",
        content: (
          <section className="mb-6">
            <SectionTitle title="Certifications" />
            <ul className="space-y-1">
              {validCertifications.map((item, i) => (
                <li key={i} className="ml-4 list-disc break-words whitespace-pre-wrap" style={{ color: '#374151' }}>{item}</li>
              ))}
            </ul>
          </section>
        ),
      });
    }

    // --- Languages ---
    const validLanguages = data.languages?.filter((l) => l && l.trim().length > 0) ?? [];
    if (validLanguages.length > 0) {
      blocks.push({
        id: "langs",
        content: (
          <section className="mb-6">
            <SectionTitle title="Languages" />
            <ul className="space-y-1">
              {validLanguages.map((item, i) => (
                <li key={i} className="ml-4 list-disc break-words whitespace-pre-wrap" style={{ color: '#374151' }}>{item}</li>
              ))}
            </ul>
          </section>
        ),
      });
    }

    return blocks;
  };

  const blocks = getResumeBlocks();

  // 2. Measure Blocks and Distribute to Pages
  useEffect(() => {
    if (!enableScaling || !measurementRef.current) return;

    // Small timeout to allow render
    const timer = setTimeout(() => {
      if (!measurementRef.current) return;

      const children = Array.from(measurementRef.current.children) as HTMLElement[];
      const tempPages: React.ReactNode[][] = [];
      let currentPage: React.ReactNode[] = [];
      let currentHeight = 0;

      children.forEach((child, index) => {
        const height = child.offsetHeight;
        const blockContent = blocks[index].content;

        // Simple logic: if fits, add. If not, new page.
        if (currentHeight + height > CONTENT_MAX_HEIGHT) {
          // If the block itself is massive (larger than a page), we have to add it anyway or it will vanish.
          // But for standard resume items, this works well to push to next page.
          if (currentPage.length > 0) {
            tempPages.push(currentPage);
            currentPage = [];
            currentHeight = 0;
          }
        }

        currentPage.push(blockContent);
        currentHeight += height;
      });

      if (currentPage.length > 0) {
        tempPages.push(currentPage);
      }

      setPaginatedPages(tempPages);
      setIsMeasuring(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [data, enableScaling]); // blocks depends on data, implicitly


  // 3. Resizer for container scaling
  useEffect(() => {
    if (!enableScaling) {
      setScale(1);
      return;
    }
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth === 0) return;

      const contentWidth = A4_WIDTH_PX;
      const padding = 32;
      const availableWidth = Math.max(containerWidth - padding, 300);
      let newScale = availableWidth / contentWidth;
      if (newScale > 1.2) newScale = 1.2;

      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [enableScaling]);


  // PDF Mode: Render Continuous
  if (!enableScaling) {
    return (
      <div className="leading-relaxed p-[40px]" style={{ width: '794px', minHeight: '1123px', backgroundColor: '#ffffff', color: '#111827' }}>
        {blocks.map((b) => <React.Fragment key={b.id}>{b.content}</React.Fragment>)}
      </div>
    );
  }

  // Preview Mode: Scaled & Paginated
  const GAP_PX = 40;
  const totalHeight = paginatedPages.length * A4_HEIGHT_PX + (paginatedPages.length - 1) * GAP_PX;

  return (
    <div
      ref={containerRef}
      className="relative w-full flex bg-gray-200  justify-center rounded-xl overflow-hidden py-8 border border-[#e5e7eb]"

    >
      {/* Hidden Measurement Container */}
      <div
        ref={measurementRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: `${A4_WIDTH_PX}px`,
          padding: `${PAGE_PADDING_PX}px`, // Match page padding to get accurate width-constrained heights
          pointerEvents: 'none'
        }}
      >
        {blocks.map((b) => (
          <div key={b.id}>{b.content}</div>
        ))}
      </div>

      <div
        style={{
          height: isMeasuring ? '1000px' : (totalHeight * scale),
          width: '100%',
          position: 'relative',
        }}
        className="flex justify-center transition-all duration-300"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: `${A4_WIDTH_PX}px`,
            position: 'absolute',
            top: 0
          }}
        >
          {isMeasuring ? (
            // Loading / Generating Layout state
            <div className="w-full h-[1123px] bg-white shadow-2xl flex items-center justify-center text-gray-400">
              Calculating Layout...
            </div>
          ) : (
            paginatedPages.map((pageContent, pageIndex) => (
              <div
                key={pageIndex}
                className="bg-white shadow-2xl text-[#111827] leading-relaxed relative mb-[40px] last:mb-0"
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                  padding: `${PAGE_PADDING_PX}px`,
                  overflow: 'hidden' // Ensure strict page limits
                }}
              >
                {pageContent.map((node, i) => <React.Fragment key={i}>{node}</React.Fragment>)}

                {/* Page Number */}
                <div className="absolute bottom-4 right-8 text-xs text-gray-400 font-mono">
                  Page {pageIndex + 1} of {paginatedPages.length}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
