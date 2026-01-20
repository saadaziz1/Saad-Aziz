"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import {
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useGetResumeQuery,
} from "../features/resumes/resumeApi";

import SkillsInput from "../components/resume/SkillsInput";
import EducationInput from "../components/resume/EducationInput";
import ExperienceInput from "../components/resume/ExperienceInputs";
import ProjectsInput from "../components/resume/ProjectsInput";
import CertificationsInput from "../components/resume/CertificationsInput";
import LanguagesInput from "../components/resume/LanguagesInput";
import DownloadButtons from "../components/resume/DownloadButtons";
import ResumePreview from "../components/resume/ResumePreview";

/* ---------------------- Schemas ---------------------- */
const educationSchema = z.object({
  school: z.string().min(1, "School is required"),
  degree: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  url: z.string().optional(),
  description: z.string().optional(),
});

const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof resumeSchema>;

export default function ResumeBuilder() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId") || undefined;

  const { register, control, handleSubmit, reset, watch, formState } =
    useForm<FormValues>({
      resolver: zodResolver(resumeSchema),
      defaultValues: {
        skills: [""],
        education: [
          {
            school: "",
            degree: "",
            startYear: "",
            endYear: "",
            description: "",
          },
        ],
        experience: [
          {
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
        projects: [{ name: "", url: "", description: "" }],
        certifications: [""],
        languages: [""],
      },
    });

  const { errors } = formState;
  const [savedId, setSavedId] = React.useState<string | undefined>(resumeId);
  const [showPreview, setShowPreview] = React.useState(false);

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
        skills: fetchedResume.skills?.length ? fetchedResume.skills : [""],
        education: fetchedResume.education?.length
          ? fetchedResume.education
          : [
              {
                school: "",
                degree: "",
                startYear: "",
                endYear: "",
                description: "",
              },
            ],
        experience: fetchedResume.experience?.length
          ? fetchedResume.experience
          : [
              {
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
        projects: fetchedResume.projects?.length
          ? fetchedResume.projects
          : [{ name: "", url: "", description: "" }],
        certifications: fetchedResume.certifications?.length
          ? fetchedResume.certifications
          : [""],
        languages: fetchedResume.languages?.length
          ? fetchedResume.languages
          : [""],
      });
    }
  }, [fetchedResume, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (savedId) await updateResume({ id: savedId, body: data }).unwrap();
      else {
        const res = await createResume(data).unwrap();
        setSavedId(res._id);
      }
      alert("Resume saved successfully!");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to save resume");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-100 space-y-6 overflow-auto"
      >
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-indigo-600">
            CareerCraft — Resume Builder
          </h1>
          <p className="text-gray-500 mt-1">
            Create and export professional resumes quickly.
          </p>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("fullName")}
            placeholder="Full name"
            className="w-full p-3 rounded-lg border border-gray-300"
          />
          <input
            {...register("title")}
            placeholder="Title e.g. Frontend Developer"
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300"
          />
          <input
            {...register("phone")}
            placeholder="Phone"
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        <textarea
          {...register("summary")}
          placeholder="Professional summary"
          className="w-full p-3 rounded-lg border border-gray-300 min-h-[80px]"
        />

        <SkillsInput control={control} register={register} />
        <EducationInput control={control} register={register} />
        <ExperienceInput control={control} register={register} />
        <ProjectsInput control={control} register={register} />
        <div className="grid grid-cols-2 gap-4">
          <CertificationsInput control={control} register={register} />
          <LanguagesInput control={control} register={register} />
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <button
            type="submit"
            disabled={creating || updating || fetching}
            className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {resumeId
              ? updating
                ? "Updating..."
                : "Update"
              : creating
              ? "Saving..."
              : "Save"}
          </button>
          <DownloadButtons resumeId={savedId} watch={watch} />
        </div>
        <div className="flex flex-col items-center gap-3 mt-4 w-full">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full p-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
          >
            {showPreview ? "Hide Live Preview" : "Show Live Preview"}
          </button>
        </div>
        {showPreview && (
          <div className="mt-6 w-full">
            <ResumePreview data={watch()} />
          </div>
        )}
      </form>
    </div>
  );
}
