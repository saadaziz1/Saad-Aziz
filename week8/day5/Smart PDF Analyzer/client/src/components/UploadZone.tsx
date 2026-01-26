'use client';

import { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useUploadPdfMutation, useChatMutation } from '../store/api';

export default function UploadZone({ onUploadSuccess }: { onUploadSuccess: (id: string, filename: string, summary: string) => void }) {
    const [uploadPdf, { isLoading: isUploading }] = useUploadPdfMutation();
    const [chat, { isLoading: isGeneratingSummary }] = useChatMutation();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            setStatus('Uploading PDF...');
            const result = await uploadPdf(formData).unwrap();

            setStatus('Analyzing document and generating summary...');
            const summaryResult = await chat({
                pdfId: result.id,
                query: 'Please provide a comprehensive summary of this document.'
            }).unwrap();

            onUploadSuccess(result.id, result.filename, summaryResult.answer);
        } catch (error) {
            console.error('Upload failed', error);
            setStatus('');
        }
    };

    const isLoading = isUploading || isGeneratingSummary;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 5,
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px dashed rgba(96, 165, 250, 0.4)',
                backgroundColor: 'rgba(96, 165, 250, 0.05)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: 'rgba(96, 165, 250, 0.8)',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(96, 165, 250, 0.2)'
                }
            }}
        >
            <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="pdf-upload">
                <Box sx={{ mb: 2 }}>
                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                    {file ? file.name : 'Click to select PDF or drag and drop'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Agentic PDF Intelligence Platform
                </Typography>
            </label>
            {file && (
                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={handleUpload}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {isLoading ? (status || 'Processing...') : 'Engage Agents'}
                </Button>
            )}
        </Paper>
    );
}
