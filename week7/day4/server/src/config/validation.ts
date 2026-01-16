import * as Joi from 'joi';

export const validationSchema = Joi.object({
    PORT: Joi.number().required(),
    MONGO_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES: Joi.string().required(),
    HYGRAPH_ENDPOINT: Joi.string().required(),
    HYGRAPH_TOKEN: Joi.string().required(),
});
