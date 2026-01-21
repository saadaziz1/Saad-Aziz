import React from "react";
import { useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ProjectsInput({
  control,
  register,
  errors,
}: {
  control: any;
  register: any;
  errors: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="space-y-4">
      {fields.map((f, i) => (
        <div key={f.id} className="group relative p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors">
          <button
            onClick={() => remove(i)}
            type="button"
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Remove project"
          >
            <FaTrash size={14} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Project Name</label>
              <input
                {...register(`projects.${i}.name`)}
                maxLength={100}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-all outline-none 
                  ${errors?.projects?.[i]?.name ? "border-red-500" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"}
                `}
                placeholder="Project Name"
              />
              {errors?.projects?.[i]?.name && <p className="text-red-500 text-xs mt-1">{errors.projects[i].name.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Project URL (Optional)</label>
              <input
                {...register(`projects.${i}.url`)}
                maxLength={200}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-all outline-none 
                  ${errors?.projects?.[i]?.url ? "border-red-500" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"}
                `}
                placeholder="https://..."
              />
              {errors?.projects?.[i]?.url && <p className="text-red-500 text-xs mt-1">{errors.projects[i].url.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
              <textarea
                {...register(`projects.${i}.description`)}
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-y"
                placeholder="What did you build and how?"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => append({ name: "", url: "", description: "" })}
        type="button"
        className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
      >
        <FaPlus size={12} /> Add Project
      </button>
    </div>
  );
}

