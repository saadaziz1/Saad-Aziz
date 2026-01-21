import * as z from 'zod';

export interface Education {
  school?: string;
  degree?: string;
  startYear?: string;
  endYear?: string;
  description?: string;
}

export interface Experience {
  company?: string;
  role?: string; // changed from position
  startDate?: string;
  endDate?: string;
  description?: string; // changed from responsibilities[]
}

export interface Project {
  name?: string;
  url?: string; // changed from link
  description?: string; // changed from summary
}

export interface Resume {
  _id: string;
  owner: string;
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications?: string[];
  languages?: string[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}


/* ---------------------- Schemas ---------------------- */
export const educationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  url: z.string().optional(),
  description: z.string().optional(),
});

export const resumeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
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
