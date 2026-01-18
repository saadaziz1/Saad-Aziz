import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
}).required();

export const signupSchema = yup.object({
    name: yup
        .string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
}).required();
