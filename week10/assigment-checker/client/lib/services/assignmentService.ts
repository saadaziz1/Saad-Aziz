import { api } from '../../utils/api';

export const assignmentService = {
    create: async (data: any) => {
        const response = await api.post('/assignments', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/assignments');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/assignments/${id}`);
        return response.data;
    },
    getSubmissions: async (id: string) => {
        const response = await api.get(`/assignments/${id}/submissions`);
        return response.data;
    },
    uploadSubmissions: async (id: string, files: File[], metadata?: { rollNumber?: string; studentName?: string }) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        if (metadata?.rollNumber) formData.append('rollNumber', metadata.rollNumber);
        if (metadata?.studentName) formData.append('studentName', metadata.studentName);

        const response = await api.post(`/assignments/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    exportResults: async (id: string) => {
        try {
            const response = await api.get(`/assignments/${id}/export`, {
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = 'marksheet.csv';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    },
    getInsights: async () => {
        const response = await api.get('/assignments/insights');
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.patch(`/assignments/${id}`, data);
        return response.data;
    },
    getDashboardStats: async () => {
        const response = await api.get('/assignments/stats');
        return response.data;
    },
    getMySubmissions: async () => {
        const response = await api.get('/assignments/my-submissions');
        return response.data;
    },
    evaluateAll: async (id: string) => {
        const response = await api.post(`/assignments/${id}/evaluate-all`);
        return response.data;
    },
    evaluateSingle: async (submissionId: string, assignmentId: string) => {
        const response = await api.post(`/assignments/evaluate/${submissionId}`, { assignmentId });
        return response.data;
    },
    getSubmission: async (id: string) => {
        const response = await api.get(`/assignments/submission/${id}`);
        return response.data;
    },
};
