import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const profileSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().default(''),
  address: yup.string().default(''),
});

export const checkoutSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  phone: yup.string().required('Phone number is required').min(10, 'Phone number must be at least 10 characters').max(15, 'Phone number must be at most 15 characters'),
  usePoints: yup.number().min(0, 'Points must be 0 or greater').default(0),
  paymentMethod: yup.string().oneOf(['card', 'points']).default('card'),

  // Card Details - Conditional
  // Card Details - Handled by Stripe Elements
  cardNumber: yup.string().notRequired(),
  expiryDate: yup.string().notRequired(),
  cvv: yup.string().notRequired(),
  cardHolderName: yup.string().notRequired(),
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;