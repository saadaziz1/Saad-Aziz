"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import {
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useGetResumeQuery,
} from "@/features/resumes/resumeApi";

import SkillsInput from "@/components/resume/SkillsInput";
import EducationInput from "@/components/resume/EducationInput";
import ExperienceInput from "@/components/resume/ExperienceInputs";
import ProjectsInput from "@/components/resume/ProjectsInput";
import CertificationsInput from "@/components/resume/CertificationsInput";
import LanguagesInput from "@/components/resume/LanguagesInput";
import DownloadButtons from "@/components/resume/DownloadButtons";
import ResumePreview from "@/components/resume/ResumePreview";
import { FaChevronDown, FaChevronUp, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

/* ---------------------- Schemas ---------------------- */
const educationSchema = z.object({
  school: z.string().min(1, "School is required").max(100, "Max 100 chars"),
  degree: z.string().max(100, "Max 100 chars").optional(),
  startYear: z.string().max(20, "Max 20 chars").optional(),
  endYear: z.string().max(20, "Max 20 chars").optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().max(1000, "Max 1000 chars").optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(100, "Max 100 chars"),
  role: z.string().min(1, "Role is required").max(100, "Max 100 chars"),
  startDate: z.string().max(20, "Max 20 chars").optional(),
  endDate: z.string().max(20, "Max 20 chars").optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().max(1000, "Max 1000 chars").optional(),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Max 100 chars"),
  url: z
    .string()
    .max(200, "Max 200 chars")
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, "Invalid URL"),
  description: z.string().max(500, "Max 500 chars").optional(),
});

const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(50, "Max 50 chars"),
  title: z.string().max(100, "Max 100 chars").optional(),
  email: z
    .string()
    .max(100, "Max 100 chars")
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(20, "Max 20 chars").optional(),
  summary: z.string().max(2000, "Max 2000 chars").optional(),
  skills: z.array(z.string().max(50, "Max 50 chars")).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(z.string().max(100, "Max 100 chars")).optional(),
  languages: z.array(z.string().max(50, "Max 50 chars")).optional(),
});

export type FormValues = z.infer<typeof resumeSchema>;

// Collapsible Section Component
const FormSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-800">{title}</span>
        {isOpen ? <FaChevronUp className="text-emerald-500" /> : <FaChevronDown className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 animate-fade-in-up">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ResumeBuilder() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId") || undefined;

  const { register, control, handleSubmit, reset, watch, formState } =
    useForm<FormValues>({
      resolver: zodResolver(resumeSchema),
      defaultValues: {
        skills: [],
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        languages: [],
      },
      mode: "onBlur"
    });

  const { errors, isDirty } = formState;
  const [savedId, setSavedId] = React.useState<string | undefined>(resumeId);

  const [createResume, { isLoading: creating }] = useCreateResumeMutation();
  const [updateResume, { isLoading: updating }] = useUpdateResumeMutation();

  const { data: fetchedResume, isLoading: fetching } = useGetResumeQuery(
    resumeId ?? "",
    { skip: !resumeId }
  );

  useEffect(() => {
    if (fetchedResume) {
      reset({
        ...fetchedResume,
        skills: fetchedResume.skills || [],
        education: fetchedResume.education || [],
        experience: fetchedResume.experience || [],
        projects: fetchedResume.projects || [],
        certifications: fetchedResume.certifications || [],
        languages: fetchedResume.languages || [],
      });
    }
  }, [fetchedResume, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (savedId) {
        await updateResume({ id: savedId, body: data }).unwrap();
        // Since update doesn't return the full object always, we can reset with the submitted data to clear isDirty
        reset(data);
      } else {
        const res = await createResume(data).unwrap();
        setSavedId(res._id);
        // Reset with the data + id effectively, usually just resetting with 'data' clears dirty
        reset(data);
      }
      toast.success("Resume saved successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save resume");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Resume Builder</h1>
            <p className="text-gray-500 mt-1">Craft your professional story.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={creating || updating || fetching}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md shadow-emerald-200 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FaSave />
              {resumeId ? (updating ? "Updating..." : "Update Resume") : (creating ? "Saving..." : "Save Resume")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: EDITOR FORM */}
          <div className="xl:col-span-5 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Global Validation Msg */}
              {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2 animate-fade-in-up">
                  <span className="font-bold">Error:</span> Please fix the issues in the form fields.
                </div>
              )}

              {/* Personal Info Section */}
              <FormSection title="Personal Information" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input {...register("fullName")} maxLength={50} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="e.g. John Doe" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Title</label>
                    <input {...register("title")} maxLength={100} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Senior Frontend Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input {...register("email")} maxLength={100} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="e.g. john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input {...register("phone")} maxLength={20} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="e.g. +1 555 000 0000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Summary</label>
                    <textarea {...register("summary")} maxLength={2000} rows={4} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-y" placeholder="Briefly describe your background..." />
                    {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
                  </div>
                </div>
              </FormSection>

              <FormSection title="Core Skills">
                <SkillsInput control={control} register={register} errors={errors} />
              </FormSection>

              <FormSection title="Work Experience">
                <ExperienceInput control={control} register={register} errors={errors} watch={watch} />
              </FormSection>

              <FormSection title="Education">
                <EducationInput control={control} register={register} errors={errors} watch={watch} />
              </FormSection>

              <FormSection title="Projects">
                <ProjectsInput control={control} register={register} errors={errors} />
              </FormSection>


              <FormSection title="Certifications">
                <CertificationsInput control={control} register={register} errors={errors} />
              </FormSection>

              <FormSection title="Languages">
                <LanguagesInput control={control} register={register} errors={errors} />
              </FormSection>

            </form>

            <div className="pt-6 border-t border-gray-200">
              <DownloadButtons resumeId={savedId} watch={watch} disableDownload={!savedId || isDirty} />
            </div>
          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <div className="xl:col-span-7 mt-8 xl:mt-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-gray-100 rounded-2xl border border-gray-200 shadow-inner flex items-center justify-center min-h-[500px] xl:min-h-[calc(100vh-140px)] overflow-hidden">
                <ResumePreview data={watch()} />
              </div>
            </div>
          </div>

        </div>

        {/* Hidden PDF Generation Container */}
        <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
          <div id="resume-pdf-content" style={{ color: '#000000', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
            <ResumePreview data={watch()} enableScaling={false} />
          </div>
        </div>

      </div>
    </div>
  );
}

