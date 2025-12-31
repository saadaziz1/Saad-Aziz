import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { memo } from "react";
import { ProfileFormData } from "./ProfileForm";

interface FormInputProps {
  label: string;
  value: string;
  field: keyof ProfileFormData;
  section: string;
  editingSection: string | null;
  passwordVisible: boolean;
  onChange: (field: keyof ProfileFormData, value: string) => void;
  togglePassword: () => void;
  error?: string;
}

export const FormInput = memo(function FormInput({
  label,
  value,
  field,
  section,
  editingSection,
  passwordVisible,
  onChange,
  togglePassword,
  error,
}: FormInputProps) {
  const editable = editingSection === section;
  const displayValue =
    field === "password" && !editable ? "********" : value;

  return (
    <div className="flex flex-col gap-1 text-left">
      <div className="flex items-center">
        <label className="w-36 text-lg font-semibold text-[#2E3D83]">
          {label}
        </label>
        {editable ? (
          field === "password" ? (
            <div className="flex items-center gap-2">
              <Input
                type={passwordVisible ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full max-w-sm text-left"
              />
              <button type="button" onClick={togglePassword}>
                {passwordVisible ? <EyeOff /> : <Eye />}
              </button>
            </div>
          ) : (
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full max-w-sm text-left"
            />
          )
        ) : (
          <p className="text-lg text-[#939393] text-left">{displayValue || " "}</p>
        )}
      </div>
      {error && (
        <span className="text-sm text-red-500 ml-36">{error}</span>
      )}
    </div>
  );
});
