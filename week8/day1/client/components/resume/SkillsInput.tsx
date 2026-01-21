import React from "react";
import { useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function SkillsInput({
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
    name: "skills",
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((f, i) => (
          <div key={f.id} className="relative group">
            <input
              {...register(`skills.${i}`)}
              maxLength={50}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg transition-all outline-none 
                ${errors?.skills?.[i] ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"}
              `}
              placeholder={`Skill ${i + 1}`}
            />
            <button
              onClick={() => remove(i)}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove skill"
            >
              <FaTrash size={14} />
            </button>
            {errors?.skills?.[i] && (
              <p className="text-red-500 text-xs mt-1 absolute -bottom-4 left-1">
                {errors.skills[i]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => append("")}
        type="button"
        className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-2 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
      >
        <FaPlus size={12} /> Add Skill
      </button>
    </div>
  );
}

