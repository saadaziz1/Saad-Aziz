"use client";

import Loader from "@/components/atoms/Loader";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAssignmentDetails, useAssignments } from "@/hooks/useAssignments";
import { toast } from "react-hot-toast";

import ResultsHeader from "@/components/organisms/ResultsHeader";
import ResultsTable from "@/components/organisms/ResultsTable";
import AssignmentGrid from "@/components/organisms/AssignmentGrid";
import SubmitOnBehalfModal from "@/components/organisms/SubmitOnBehalfModal";
import ExtendDeadlineModal from "@/components/organisms/ExtendDeadlineModal";


function ResultsContent() {
    const searchParams = useSearchParams();
    const assignmentId = searchParams.get("id");
    const { assignment, submissions, isLoading, exportResults } = useAssignmentDetails(assignmentId || "");
    const {
        uploadSubmissions,
        isUploading,
        updateAssignment,
        isUpdatingStatus,
        assignments,
        isLoading: loadingAssignments,
        evaluateAllSubmissions,
        isEvaluating
    } = useAssignments();

    const [filter, setFilter] = useState("");
    const [isSubmittingOnBehalf, setIsSubmittingOnBehalf] = useState(false);
    const [isExtendingDeadline, setIsExtendingDeadline] = useState(false);

    const onBehalfSubmit = (data: any) => {
        if (!assignmentId) return;
        const file = data.file[0];
        uploadSubmissions(
            { id: assignmentId, files: [file], metadata: { rollNumber: data.roll } },
            {
                onSuccess: () => {
                    toast.success("Submission graded successfully!");
                    setIsSubmittingOnBehalf(false);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to upload submission");
                }
            }
        );
    };

    const handleExtendDeadline = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as any;
        const newDate = form.deadline.value;
        const autoEvaluation = form.autoEvaluation.checked;
        if (!newDate || !assignmentId) return;

        updateAssignment({ id: assignmentId, data: { deadline: new Date(newDate), autoEvaluation } }, {
            onSuccess: () => {
                toast.success("Deadline extended successfully!");
                setIsExtendingDeadline(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to extend deadline");
            }
        });
    };

    const filteredResults = (submissions || []).filter((r: any) =>
        r.studentName?.toLowerCase().includes(filter.toLowerCase()) ||
        r.rollNumber?.includes(filter)
    );

    if (!assignmentId) {
        return (
            <AssignmentGrid
                assignments={assignments}
                searchParams={searchParams}
                loading={loadingAssignments}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto py-20 text-center">
                <Loader text="Fetching evaluation data..." />
            </div>
        );
    }

    const handleExport = async () => {
        try {
            await exportResults();
            toast.success("CSV export started!");
        } catch (error: any) {
            toast.error(error.message || "Failed to export CSV");
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            <ResultsHeader
                assignmentTitle={assignment?.title}
                instructions={assignment?.instructions}
                onSubmitOnBehalf={() => setIsSubmittingOnBehalf(true)}
                onExtendDeadline={() => setIsExtendingDeadline(true)}
                onExport={handleExport}
                onEvaluateAll={() => {
                    if (!assignmentId) return;
                    evaluateAllSubmissions(assignmentId, {
                        onSuccess: (data: any) => {
                            toast.success(data.message || "Evaluation started!");
                        },
                        onError: (error: any) => {
                            toast.error(error.message || "Failed to start evaluation");
                        }
                    });
                }}
                isEvaluating={isEvaluating}
                autoEvaluation={assignment?.autoEvaluation}
            />

            <ResultsTable
                submissions={filteredResults}
                filter={filter}
                setFilter={setFilter}
            />

            <SubmitOnBehalfModal
                isOpen={isSubmittingOnBehalf}
                onClose={() => setIsSubmittingOnBehalf(false)}
                onSubmit={onBehalfSubmit}
                isUploading={isUploading}
            />

            <ExtendDeadlineModal
                isOpen={isExtendingDeadline}
                onClose={() => setIsExtendingDeadline(false)}
                onSubmit={handleExtendDeadline}
                isUpdating={isUpdatingStatus}
                currentDeadline={assignment?.deadline}
                autoEvaluation={assignment?.autoEvaluation}
            />
        </div>
    );
}

export default function ResultsSheet() {
    return (
        <Suspense fallback={
            <div className="max-w-screen-2xl mx-auto py-20 text-center">
                <Loader text="Loading page..." />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
