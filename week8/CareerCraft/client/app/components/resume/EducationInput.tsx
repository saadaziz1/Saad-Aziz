import React from 'react';
import { useFieldArray } from 'react-hook-form';

export default function EducationInput({ control, register }: { control: any; register: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
      {fields.map((f, i) => (
        <div key={f.id} className="border p-4 mb-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">School</label>
              <input {...register(`education.${i}.school`)} placeholder="School" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Degree</label>
              <input {...register(`education.${i}.degree`)} placeholder="Degree" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input {...register(`education.${i}.startYear`)} placeholder="Start Year" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input {...register(`education.${i}.endYear`)} placeholder="End Year" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="mt-3">
            <label className="text-sm text-gray-600">Description</label>
            <textarea {...register(`education.${i}.description`)} placeholder="Description" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]" />
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => remove(i)} type="button" className="p-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50">Remove</button>
          </div>
        </div>
      ))}
      <button
        onClick={() => append({ school: '', degree: '', startYear: '', endYear: '', description: '' })}
        type="button"
        className="w-full p-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
      >
        + Add Education
      </button>
    </div>
  );
}
