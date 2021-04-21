import Joi, { ValidationResult } from 'joi';
import { configResponseSchema, configRequestSchema } from 'src/validation/schema/index';
export const storeConfigurevalidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        description: Joi.string(),
        config: Joi.object({
            request: configRequestSchema.required(),
            response: configResponseSchema.required(),

        }).required()

    })
    return schema.validate(data)
}


export const updateConfigurevalidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        description: Joi.string(),
        config: Joi.object({
            id: Joi.string().required(),
            request: configRequestSchema.required(),
            response: configResponseSchema.required(),

        }).required()

    })
    return schema.validate(data)
}

