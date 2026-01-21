import React from "react";
import { useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ExperienceInput({
  control,
  register,
  errors,
  watch,
}: {
  control: any;
  register: any;
  errors: any;
  watch: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <div className="space-y-4">
      {fields.map((f, i) => (
        <div key={f.id} className="group relative p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors">
          <button
            onClick={() => remove(i)}
            type="button"
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Remove entry"
          >
            <FaTrash size={14} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Company</label>
              <input
                {...register(`experience.${i}.company`)}
                maxLength={100}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-all outline-none 
                  ${errors?.experience?.[i]?.company ? "border-red-500" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"}
                `}
                placeholder="Company Name"
              />
              {errors?.experience?.[i]?.company && <p className="text-red-500 text-xs mt-1">{errors.experience[i].company.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Role</label>
              <input
                {...register(`experience.${i}.role`)}
                maxLength={100}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-all outline-none 
                  ${errors?.experience?.[i]?.role ? "border-red-500" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"}
                `}
                placeholder="Job Title"
              />
            </div>

            <div className="col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Start Date</label>
              <input
                {...register(`experience.${i}.startDate`)}
                type="date"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            <div className="col-span-1">
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">End Date</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(`experience.${i}.isCurrent`)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wide">Present</span>
                </label>
              </div>
              <input
                {...register(`experience.${i}.endDate`)}
                type="date"
                disabled={watch(`experience.${i}.isCurrent`)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
              <textarea
                {...register(`experience.${i}.description`)}
                maxLength={1000}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-y"
                placeholder="Key responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() =>
          append({
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        type="button"
        className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
      >
        <FaPlus size={12} /> Add Experience
      </button>
    </div>
  );
}

