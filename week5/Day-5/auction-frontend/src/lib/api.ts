import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            try {
                const storage = localStorage.getItem('auth-storage');
                if (storage) {
                    const { state } = JSON.parse(storage);
                    const token = state?.token;
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.error('Error retrieving auth token:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-storage');
                window.dispatchEvent(new Event('authChanged'));
            }
        }
        return Promise.reject(error);
    }
);
