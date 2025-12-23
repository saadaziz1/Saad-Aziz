import { body } from "express-validator";

export const planActivationValidator = [
  body("planId")
    .isIn(["basic", "standard", "premium"])
    .withMessage("Plan must be basic, standard, or premium"),
  body("period")
    .isIn(["month", "year"])
    .withMessage("Period must be month or year"),
  body("cardDetails.cardNumber")
    .isLength({ min: 13, max: 19 })
    .isNumeric()
    .withMessage("Invalid card number"),
  body("cardDetails.expiryDate")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage("Invalid expiry date format (MM/YY)"),
  body("cardDetails.cvv")
    .isLength({ min: 3, max: 4 })
    .isNumeric()
    .withMessage("Invalid CVV"),
  body("cardDetails.cardholderName")
    .isLength({ min: 2 })
    .withMessage("Cardholder name is required")
];

export const freeTrialValidator = [
  body("cardDetails.cardNumber")
    .isLength({ min: 13, max: 19 })
    .isNumeric()
    .withMessage("Invalid card number"),
  body("cardDetails.expiryDate")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage("Invalid expiry date format (MM/YY)"),
  body("cardDetails.cvv")
    .isLength({ min: 3, max: 4 })
    .isNumeric()
    .withMessage("Invalid CVV"),
  body("cardDetails.cardholderName")
    .isLength({ min: 2 })
    .withMessage("Cardholder name is required")
];
