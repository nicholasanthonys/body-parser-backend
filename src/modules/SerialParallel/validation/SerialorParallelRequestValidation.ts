import Joi, { ValidationResult } from 'joi';

export const storeOrUpdateParallelValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        configures: Joi.array().items({
            file_name: Joi.string().required(),
            alias: Joi.string().required(),
        }).required(),
        c_logics: Joi.array().items({
            rule: Joi.object().allow(null),
            data: Joi.object().allow(null),
            next_success: Joi.string().allow(null),
            response: responseSchema.allow(null)
        }).required(),
        next_failure: responseSchema.required().required(),

    })
    return schema.validate(data)
}

export const storeOrUpdateSerialValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        configures: Joi.array().items({
            file_name: Joi.string().required(),
            alias: Joi.string().required(),
            c_logics: Joi.array().items({
                rule: Joi.object().allow(null),
                data: Joi.object().allow(null),
                next_success: Joi.string().allow(null),
                response: responseSchema.allow(null)
            }).required(),
            next_failure: responseSchema.required().required(),
        }).required(),
    })
    return schema.validate(data)
}

export const responseSchema = Joi.object({
    status_code: Joi.number().required(),
    transform: Joi.string().required(),
    adds: Joi.object({
        header: Joi.object().required(),
        body: Joi.object().required(),
    }).required(),
    modifies: Joi.object({
        header: Joi.object().required(),
        body: Joi.object().required(),
    }).required(),
    deletes: Joi.object({
        header: Joi.array().items(Joi.string()).required(),
        body: Joi.array().items(Joi.string()).required(),
    }).required()

})
