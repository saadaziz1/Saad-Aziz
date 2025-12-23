import { body } from "express-validator";

export const uploadVideoValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("genre").notEmpty().withMessage("Genre is required"),
  body("releaseYear")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Enter a valid release year"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be in seconds"),
  body("video")
    .custom((value, { req }) => {
      if (!req.files || !req.files.video || req.files.video.length === 0) {
        throw new Error("Video file is required");
      }
      return true;
    }),
  body("thumbnail")
    .custom((value, { req }) => {
      if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
        throw new Error("Thumbnail file is required");
      }
      return true;
    })
];

export const updateVideoValidator = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().notEmpty().withMessage("Description cannot be empty"),
  body("genre").optional().notEmpty().withMessage("Genre cannot be empty"),
  body("releaseYear")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Enter a valid release year"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be in seconds")
];
