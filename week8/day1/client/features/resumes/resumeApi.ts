import { baseApi } from "@/api/baseApi";
import { Resume } from "@/types/resume";

export const resumesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createResume: builder.mutation<Resume, Partial<Resume>>({
      query: (body) => ({ url: "/resumes", method: "POST", body }),
      invalidatesTags: ["Resumes"],
    }),
    getResumes: builder.query<Resume[], void>({
      query: () => ({ url: "/resumes", method: "GET" }),
      providesTags: ["Resumes"],
    }),
    getResume: builder.query<Resume, string>({
      query: (id) => `/resumes/${id}`,
    }),
    updateResume: builder.mutation<
      Resume,
      { id: string; body: Partial<Resume> }
    >({
      query: ({ id, body }) => ({
        url: `/resumes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Resumes"],
    }),
    deleteResume: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/resumes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Resumes"],
    }),
  }),
});

export const {
  useCreateResumeMutation,
  useGetResumesQuery,
  useGetResumeQuery,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
} = resumesApi;
