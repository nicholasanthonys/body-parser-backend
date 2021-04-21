import Joi, { ValidationResult } from 'joi';
import { configResponseSchema } from 'src/validation/schema/index'
export const storeProjectValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        base: Joi.object({
            project_max_circular: Joi.number().required(),
            circular_response: configResponseSchema.required()
        }).required()
    })
    return schema.validate(data)
}

export const updateProjectValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        base: Joi.object({
            project_max_circular: Joi.number().required(),
            circular_response: configResponseSchema.required()
        }).required()

    })
    return schema.validate(data)
}