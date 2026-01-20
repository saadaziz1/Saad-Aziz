import React from 'react';
import { useFieldArray } from 'react-hook-form';

export default function ExperienceInput({ control, register }: { control: any; register: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
      {fields.map((f, i) => (
        <div key={f.id} className="border p-4 mb-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Company</label>
              <input {...register(`experience.${i}.company`)} placeholder="Company" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <input {...register(`experience.${i}.role`)} placeholder="Role" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input {...register(`experience.${i}.startDate`)} placeholder="Start Date" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input {...register(`experience.${i}.endDate`)} placeholder="End Date" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="mt-3">
            <label className="text-sm text-gray-600">Description</label>
            <textarea {...register(`experience.${i}.description`)} placeholder="Description" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]" />
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => remove(i)} type="button" className="p-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50">Remove</button>
          </div>
        </div>
      ))}
      <button
        onClick={() => append({ company: '', role: '', startDate: '', endDate: '', description: '' })}
        type="button"
        className="w-full p-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
      >
        + Add Experience
      </button>
    </div>
  );
}
