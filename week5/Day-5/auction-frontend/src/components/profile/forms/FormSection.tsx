"use client";
import { memo } from "react";
import { Edit, Save, X } from "lucide-react";

interface FormSectionProps {
  title: string;
  sectionKey: string;
  editingSection: string | null;
  onEdit: (key: string) => void;
  onSave: (key: string) => void;
  onCancel: (key: string) => void;
  children: React.ReactNode;
}

export const FormSection = memo(function FormSection({
  title,
  sectionKey,
  editingSection,
  onEdit,
  onSave,
  onCancel,
  children,
}: FormSectionProps) {
  const editing = editingSection === sectionKey;

  return (
    <div className="bg-[#F1F2FF] rounded-sm shadow-sm border-none mb-6">
      <div className="bg-[#2E3D83] text-white p-3 rounded-t-lg flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="flex items-center gap-2">
          {!editing ? (
            <button type="button" onClick={() => onEdit(sectionKey)}>
              <Edit className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button type="button" onClick={() => onCancel(sectionKey)}>
                <X className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => onSave(sectionKey)}>
                <Save className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
});
