import * as yup from 'yup';

export const personalSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required.'),
  email: yup.string().email('Invalid email format.').required('Email is required.'),
  username: yup.string().required('Username is required.'),
  countryCode: yup.string().required('Country code is required.'),
  mobileNumber: yup.string()
    .matches(/^\d{7,15}$/, 'Mobile number must be 7-15 digits.')
    .required('Mobile number is required.'),
  nationality: yup.string().nullable(),
  idType: yup.string().nullable(),
  idNumber: yup.string().nullable(),
  profileImage: yup.string().nullable(),
});

export const passwordSchema = yup.object().shape({
  password: yup.string()
    .required('Password is required.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/[A-Z]/, 'Password must have at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must have at least one lowercase letter.')
    .matches(/\d/, 'Password must have at least one digit.'),
});

export const addressSchema = yup.object().shape({
  country: yup.string().required('Country is required.'),
  city: yup.string().required('City is required.'),
  address1: yup.string().required('Address 1 is required.'),
  address2: yup.string().nullable(),
  landline: yup.string().nullable(),
  poBox: yup.string().nullable(),
});

export const trafficSchema = yup.object().shape({
  trafficType: yup.string().required('Traffic type is required.'),
  trafficFileNumber: yup.string().required('Traffic file number is required.'),
  plateNumber: yup.string().nullable(),
  issueCity: yup.string().nullable(),
  driverLicenseNumber: yup.string().nullable(),
  plateCode: yup.string().nullable(),
  plateState: yup.string().nullable(),
});
