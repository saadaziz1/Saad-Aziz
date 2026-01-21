"use client";

import { useGetResumesQuery, useDeleteResumeMutation } from "@/features/resumes/resumeApi";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Resume } from "@/types/resume";
import toast from "react-hot-toast";


export default function ResumeList() {
  const { data: resumes, isLoading } = useGetResumesQuery();
  const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();
  const router = useRouter();

  if (isLoading) return <p className="text-gray-500">Loading resumes...</p>;

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id).unwrap();
        toast.success("Resume deleted successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete resume");
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Resumes</h2>
        <button
          onClick={() => router.push("/resumebuilder")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition"
        >
          <FaPlus /> New Resume
        </button>
      </div>

      {/* Resume List */}
      {resumes?.length ? (
        <ul className="grid gap-4">
          {resumes.map((resume: Resume) => (
            <li
              key={resume._id}
              className="p-4 bg-white rounded-lg shadow flex justify-between items-center hover:shadow-md transition"
            >
              {/* Resume Title */}
              <span className="font-medium text-gray-800">
                {resume.title || "Untitled Resume"}
              </span>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/resumebuilder?resumeId=${resume._id}`)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-emerald-600 transition"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(resume._id)}
                  disabled={isDeleting}
                  className="p-2 rounded-lg hover:bg-gray-100 text-red-500 transition disabled:opacity-50"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No resumes yet. Start by creating one!</p>
      )}
    </div>
  );
}
