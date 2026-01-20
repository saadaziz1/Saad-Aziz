import React from 'react';
import { useFieldArray } from 'react-hook-form';

export default function SkillsInput({ control, register }: { control: any; register: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
      {fields.map((f, i) => (
        <div key={f.id} className="flex gap-2 items-center mb-3">
          <input
            {...register(`skills.${i}`)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Skill ${i + 1}`}
          />
          <button
            onClick={() => remove(i)}
            type="button"
            className="p-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => append('')}
        type="button"
        className="w-full p-3 mt-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
      >
        + Add skill
      </button>
    </div>
  );
}
