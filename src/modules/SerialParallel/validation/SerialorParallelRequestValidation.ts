import Joi, { ValidationResult } from 'joi';
import { storeCLogicSchema } from 'src/validation/schema';

export const storeOrUpdateParallelValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        configures: Joi.array().items({
            configure_id: Joi.string().required(),
            alias: Joi.string().required(),
            loop: Joi.string().allow(null)
        }).required(),
        c_logics: Joi.array().items(storeCLogicSchema).required(),
        failure_response: responseSchema.required().required(),

    })
    return schema.validate(data)
}

export const storeOrUpdateSerialValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        configures: Joi.array().items({
            configure_id: Joi.string().required(),
            alias: Joi.string().required(),
            failure_response: responseSchema.required().required(),
        }).required(),
    })
    return schema.validate(data)
}

export const storeSingleConfigSerialValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        configure_id: Joi.string().required(),
        alias: Joi.string().required(),
        failure_response: responseSchema.required().required(),
    })
    return schema.validate(data)
}

export const updateSingleConfigSerialValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        id: Joi.string().required(),
        configure_id: Joi.string().required(),
        alias: Joi.string().required(),
        failure_response: responseSchema.required().required(),
    })
    return schema.validate(data)
}

export const storeSingleCLogicSerialValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        rule: Joi.object().allow(null),
        data: Joi.object().allow(null),
        next_success: Joi.string().allow(null, ""),
        response: responseSchema.allow(null),
        next_failure: Joi.string().allow(null, ""),
        failure_response: responseSchema.allow(null)
    })
    return schema.validate(data)
}

export const updateSingleCLogicSerialValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        id: Joi.string().required(),
        rule: Joi.object().allow(null),
        data: Joi.object().allow(null),
        next_success: Joi.string().allow(null, ""),
        response: responseSchema.allow(null),
        next_failure: Joi.string().allow(null, ""),
        failure_response: responseSchema.allow(null)
    })
    return schema.validate(data)
}

export const storeSingleConfigParallelValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        configure_id: Joi.string().required(),
        alias: Joi.string().required(),
    })
    return schema.validate(data)
}

export const updateSingleConfigParallelValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        id: Joi.string().required(),
        configure_id: Joi.string().required(),
        alias: Joi.string().required(),
        loop: Joi.string().allow(null)
    })
    return schema.validate(data)
}

export const storeSingleCLogicParallelValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        rule: Joi.object().allow(null),
        data: Joi.object().allow(null),
        next_success: Joi.string().allow(null, ""),
        response: responseSchema.allow(null),
        next_failure: Joi.string().allow(null, ""),
        failure_response: responseSchema.allow(null)
    })
    return schema.validate(data)
}

export const updateSingleCLogicParallelValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        id: Joi.string().required(),
        rule: Joi.object().allow(null),
        data: Joi.object().allow(null),
        next_success: Joi.string().allow(null, ""),
        response: responseSchema.allow(null),
        next_failure: Joi.string().allow(null, ""),
        failure_response: responseSchema.allow(null)
    })
    return schema.validate(data)
}

export const responseSchema = Joi.object({
    status_code: Joi.number().required(),
    transform: Joi.string().required(),
    adds: Joi.object({
        header: Joi.object(),
        body: Joi.object(),
    }).required(),
    modifies: Joi.object({
        header: Joi.object(),
        body: Joi.object(),
    }).required(),
    deletes: Joi.object({
        header: Joi.array().items(Joi.string()),
        body: Joi.array().items(Joi.string()),
    }).required()

})

export const storeResponseValidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        status_code: Joi.number().required(),
        transform: Joi.string().required(),
        adds: Joi.object({
            header: Joi.object(),
            body: Joi.object(),
        }).required(),
        modifies: Joi.object({
            header: Joi.object(),
            body: Joi.object(),
        }).required(),
        deletes: Joi.object({
            header: Joi.array().items(Joi.string()),
            body: Joi.array().items(Joi.string()),
        }).required()
    })

    return schema.validate(data)
}