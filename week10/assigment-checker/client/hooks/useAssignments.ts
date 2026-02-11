"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../lib/services/assignmentService';
import { useRouter } from 'next/navigation';

export const useAssignments = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const assignmentsQuery = useQuery({
        queryKey: ['assignments'],
        queryFn: assignmentService.getAll,
    });

    const createAssignmentMutation = useMutation({
        mutationFn: (data: any) => assignmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            router.push('/teacher');
        },
    });

    const uploadSubmissionsMutation = useMutation({
        mutationFn: ({ id, files, metadata }: { id: string; files: File[]; metadata?: { rollNumber?: string; studentName?: string } }) =>
            assignmentService.uploadSubmissions(id, files, metadata),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['submissions', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['my-submissions'] });
        },
    });

    const updateAssignmentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            assignmentService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
        },
    });

    const evaluateAllMutation = useMutation({
        mutationFn: (id: string) => assignmentService.evaluateAll(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['submissions', id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    const evaluateSingleMutation = useMutation({
        mutationFn: ({ submissionId, assignmentId }: { submissionId: string; assignmentId: string }) =>
            assignmentService.evaluateSingle(submissionId, assignmentId),
        onSuccess: (data: any, variables) => {
            queryClient.invalidateQueries({ queryKey: ['submissions', variables.assignmentId] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    return {
        assignments: assignmentsQuery.data || [],
        isLoading: assignmentsQuery.isLoading,
        error: assignmentsQuery.error,
        createAssignment: createAssignmentMutation.mutate,
        isCreating: createAssignmentMutation.isPending,
        uploadSubmissions: uploadSubmissionsMutation.mutate,
        isUploading: uploadSubmissionsMutation.isPending,
        updateAssignment: updateAssignmentMutation.mutate,
        isUpdatingStatus: updateAssignmentMutation.isPending,
        evaluateAllSubmissions: evaluateAllMutation.mutate,
        isEvaluating: evaluateAllMutation.isPending,
        evaluateSingleSubmission: evaluateSingleMutation.mutate,
        isEvaluatingSingle: evaluateSingleMutation.isPending,
    };
};

export const useAssignmentDetails = (id: string) => {
    const submissionsQuery = useQuery({
        queryKey: ['submissions', id],
        queryFn: () => assignmentService.getSubmissions(id),
        enabled: !!id,
    });

    const detailsQuery = useQuery({
        queryKey: ['assignment', id],
        queryFn: () => assignmentService.getById(id),
        enabled: !!id,
    });

    return {
        assignment: detailsQuery.data,
        submissions: submissionsQuery.data || [],
        isLoading: detailsQuery.isLoading || submissionsQuery.isLoading,
        exportResults: () => assignmentService.exportResults(id),
    };
};
export const useAIInsights = () => {
    return useQuery({
        queryKey: ['ai-insights'],
        queryFn: assignmentService.getInsights,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: false, // Disable auto-fetch
    });
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: assignmentService.getDashboardStats,
    });
};

export const useStudentSubmissions = () => {
    return useQuery({
        queryKey: ['my-submissions'],
        queryFn: assignmentService.getMySubmissions,
    });
};

export const useSubmission = (id: string) => {
    const queryClient = useQueryClient();

    const submissionQuery = useQuery({
        queryKey: ['submission', id],
        queryFn: () => assignmentService.getSubmission(id),
        enabled: !!id,
    });

    const evaluateSingleMutation = useMutation({
        mutationFn: (assignmentId: string) =>
            assignmentService.evaluateSingle(id, assignmentId),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['submission', id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    return {
        submission: submissionQuery.data,
        isLoading: submissionQuery.isLoading,
        error: submissionQuery.error,
        evaluateSubmission: evaluateSingleMutation.mutate,
        isEvaluating: evaluateSingleMutation.isPending,
    };
};
