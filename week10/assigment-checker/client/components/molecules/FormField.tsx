import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    placeholder?: string;
    rows?: number;
    error?: string;
    registration?: UseFormRegisterReturn;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    type = "text",
    placeholder,
    rows = 5,
    error,
    registration
}) => {
    const inputClass = `w-full bg-white/5 border ${error ? "border-danger/50" : "border-white/5"} rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 ${error ? "focus:ring-danger/30" : "focus:ring-primary/50"} transition-all`;

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-end gap-2 px-1">
                <label htmlFor={id} className={`text-sm font-bold truncate max-w-[60%] ${error ? "text-danger" : "text-foreground/60"}`}>
                    {label}
                </label>
                {error && (
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2 text-right wrap-break-word max-w-full">
                        {error}
                    </span>
                )}
            </div>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${inputClass} resize-none`}
                    {...registration}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={inputClass}
                    {...registration}
                />
            )}
        </div>
    );
};

export default FormField;
