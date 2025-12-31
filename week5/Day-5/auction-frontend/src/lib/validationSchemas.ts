import * as yup from 'yup';

export const loginSchema = yup.object({
  identifier: yup
    .string()
    .required('Email is required')
    .min(3, 'Must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  countryCode: yup
    .string()
    .required('Country code is required'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d{7,15}$/, 'Please enter a valid mobile number'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

export const sellCarSchema = yup.object({
  partyType: yup.string().oneOf(['dealer', 'private']).default('dealer'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  countryCode: yup.string().required('Country code is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{7,15}$/, 'Please enter a valid phone number'),
  vin: yup
    .string()
    .required('VIN is required')
    .length(17, 'VIN must be exactly 17 characters'),
  year: yup.string().required('Year is required'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  mileage: yup
    .number()
    .typeError('Mileage must be a number')
    .required('Mileage is required')
    .min(0, 'Mileage cannot be negative'),
  engineSize: yup.string().required('Engine size is required'),
  paint: yup.string().required('Paint condition is required'),
  gccSpecs: yup.string().required('GCC Specs information is required'),
  accidentHistory: yup.string().required('Accident history is required'),
  serviceHistory: yup.string().required('Service history is required'),
  modified: yup.string().required('Modification status is required'),
  notes: yup.string().optional(),
  maxBid: yup
    .string()
    .required('Starting price is required')
    .test('valid-price', 'Invalid price format', (val) => {
      if (!val) return false;
      const num = Number(val.replace(/[^0-9.-]+/g, ''));
      return !isNaN(num) && num > 0;
    }),
  photos: yup
    .mixed()
    .test('fileCount', 'You can upload up to 6 photos', (value: any) => {
      if (!value) return true;
      const files = Array.isArray(value) ? value : Array.from(value as FileList);
      return files.length <= 6;
    })
    .nullable(),
});

export const bidSchema = yup.object({
  amount: yup
    .number()
    .required('Bid amount is required')
    .positive('Bid amount must be positive')
    .min(1, 'Minimum bid is $1'),
});