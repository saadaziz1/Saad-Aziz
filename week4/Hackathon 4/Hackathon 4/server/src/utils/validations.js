const { body } = require('express-validator');

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateVideo = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('releaseYear').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid release year is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number')
];

const validateCard = [
  body('cardNumber').isLength({ min: 16, max: 16 }).withMessage('Card number must be 16 digits'),
  body('expiryDate').matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('Expiry date must be in MM/YY format'),
  body('cvv').isLength({ min: 3, max: 4 }).withMessage('CVV must be 3 or 4 digits'),
  body('cardHolderName').notEmpty().withMessage('Card holder name is required')
];

module.exports = { validateRegister, validateLogin, validateVideo, validateCard };