import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface UseFileUploadReturn {
    isUploading: boolean;
    error: string | null;
    uploadFile: (file: File) => Promise<boolean>;
    resetError: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("topic", "General Research");

        try {
            const res = await fetch(`${API_URL}/documents/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed. Ensure the server is running.");
            }
            return true;
        } catch (err: any) {
            setError(err.message || "Failed to upload document");
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const resetError = () => setError(null);

    return { isUploading, error, uploadFile, resetError };
};
