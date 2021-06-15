import Joi, { ValidationResult } from 'joi';
import { configResponseSchema, configRequestSchema, storeCLogicSchema, updateCLogicSchema } from 'src/validation/schema/index';
export const storeConfigurevalidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        config: Joi.object({
            description: Joi.string().allow(null,""),
            request: configRequestSchema.required(),
            response: configResponseSchema.required(),

        }).required()

    })
    return schema.validate(data)
}


export const updateConfigurevalidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string(),
        config: Joi.object({
            id: Joi.string().required(),
            description: Joi.string().allow(null,""),
            request: configRequestSchema.required(),
            response: configResponseSchema.required(),

        }).required()

    })
    return schema.validate(data)
}

export const storeRequestCLogiValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        c_logic : storeCLogicSchema.required()
    })
    return schema.validate(data)
}

export const updateRequestCLogiValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        c_logic : updateCLogicSchema.required()
    })
    return schema.validate(data)
}

export const deleteRequestCLogiValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        id: Joi.string().required()
    })
    return schema.validate(data)
}


