"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormField from "@/components/molecules/FormField";
import MarkingModeCard from "@/components/molecules/MarkingModeCard";
import Button from "@/components/atoms/Button";

const assignmentSchema = z.object({
    title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
    wordCount: z.coerce.number().min(100, "Minimum 100 words required").nonnegative("Word count cannot be negative"),
    deadline: z.string().min(1, "Deadline is required").refine((date) => {
        const selectedDate = new Date(date);
        const now = new Date();
        return selectedDate > now;
    }, { message: "Evaluation date/time cannot be less than current" }),
    instructions: z.string().min(1, "Instructions are required").min(20, "Please provide more detailed instructions").max(2000, "Instructions cannot exceed 2000 characters"),
    markingMode: z.enum(["strict", "loose"]),
    focusAreas: z.array(z.string()).min(1, "Select at least one focus area"),
    autoEvaluation: z.boolean().default(true),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

const FOCUS_OPTIONS = ["Introduction", "Body Structure", "Conclusion", "Grammar", "Citations", "Creativity"];

import { useAssignments } from "@/hooks/useAssignments";

export default function CreateAssignment() {
    const { createAssignment, isCreating } = useAssignments();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AssignmentFormValues>({
        resolver: zodResolver(assignmentSchema) as any,
        defaultValues: {
            title: "",
            wordCount: 0,
            deadline: "",
            instructions: "",
            markingMode: "strict",
            focusAreas: [],
            autoEvaluation: true,
        },
    });

    const currentMode = watch("markingMode");
    const selectedFocusAreas = watch("focusAreas");

    const onSubmit: SubmitHandler<AssignmentFormValues> = (data) => {
        const { wordCount, ...rest } = data;
        const payload = {
            ...rest,
            targetWordCount: wordCount,
        };
        createAssignment(payload);
    };

    const toggleFocusArea = (tag: string) => {
        const current = selectedFocusAreas;
        if (current.includes(tag)) {
            setValue("focusAreas", current.filter((t) => t !== tag), { shouldValidate: true });
        } else {
            setValue("focusAreas", [...current, tag], { shouldValidate: true });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-1 text-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Create New Assignment</h1>
                <p className="text-foreground/60 font-medium">Define instructions and evaluation parameters for the AI.</p>
            </header>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Info Section */}
                <div className="glass p-6 md:p-8 rounded-4xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Assignment Title"
                            id="title"
                            placeholder="e.g., Mental Health Essay"
                            registration={register("title")}
                            error={errors.title?.message}
                        />
                        <FormField
                            label="Target Word Count"
                            id="wordCount"
                            type="number"
                            placeholder="e.g., 500"
                            registration={register("wordCount")}
                            error={errors.wordCount?.message}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Submission Deadline"
                            id="deadline"
                            type="datetime-local"
                            registration={register("deadline")}
                            error={errors.deadline?.message}
                        />
                        <div className="hidden md:block"></div>
                    </div>
                    <FormField
                        label="Instructions & Prompt"
                        id="instructions"
                        type="textarea"
                        placeholder="Enter detailed instructions for the students and the AI..."
                        registration={register("instructions")}
                        error={errors.instructions?.message}
                    />
                </div>

                {/* Evaluation Strategy Section */}
                <div className="glass p-6 md:p-8 rounded-4xl space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Evaluation Strategy</h2>
                        <p className="text-sm text-foreground/60 font-medium tracking-tight">Choose how the AI should grade the submissions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MarkingModeCard
                            mode="strict"
                            isActive={currentMode === "strict"}
                            onClick={() => setValue("markingMode", "strict")}
                            title="Strict Marking"
                            description="AI penalizes off-topic, too short, or irrelevant answers. Best for formal examinations."
                            icon="⚖️"
                        />
                        <MarkingModeCard
                            mode="loose"
                            isActive={currentMode === "loose"}
                            onClick={() => setValue("markingMode", "loose")}
                            title="Loose Marking"
                            description="More flexible evaluation. Rewards effort and creativity even if not perfect. Best for creative tasks."
                            icon="🎨"
                        />
                    </div>
                    {errors.markingMode && <p className="text-xs text-danger font-bold uppercase">{errors.markingMode.message}</p>}

                    <div className="pt-8 border-t border-white/5">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-center pt-1">
                                <input
                                    type="checkbox"
                                    {...register("autoEvaluation")}
                                    className="peer h-6 w-6 rounded-lg bg-white/5 border border-white/10 text-primary focus:ring-primary/20 transition-all checked:bg-primary"
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">Enable AI Auto-Evaluation</span>
                                <p className="text-sm text-foreground/60 font-medium leading-relaxed max-w-lg">
                                    If enabled, the AI will automatically evaluate all pending submissions the moment the deadline is reached. If disabled, you will need to trigger evaluation manually.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* AI Rubric Settings */}
                <div className="glass p-6 md:p-8 rounded-4xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h2 className="text-xl font-bold text-white">Focus Areas</h2>
                        </div>
                        {errors.focusAreas && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                                {errors.focusAreas.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {FOCUS_OPTIONS.map((tag) => (
                            <label key={tag} className="group relative">
                                <input
                                    type="checkbox"
                                    className="peer hidden"
                                    checked={selectedFocusAreas.includes(tag)}
                                    onChange={() => toggleFocusArea(tag)}
                                />
                                <span className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-foreground/60 peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border-primary/30 cursor-pointer transition-all block group-hover:bg-white/10">
                                    {tag}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button size="xl" className="w-full sm:w-auto" type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Assignment"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
