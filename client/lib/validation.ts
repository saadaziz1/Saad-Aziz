import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required').max(255, 'Email must be at most 255 characters'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required').max(100, 'Password must be at most 100 characters'),
});


