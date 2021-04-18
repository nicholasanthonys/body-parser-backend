import Joi, { ValidationResult } from 'joi';
import { addOrModifySchemaRequest, deletesRequestSchema, addOrModifySchemaResponse, deletesResponseSchema } from 'src/validation/schema/index';
export const storeConfigurevalidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        description: Joi.string(),
        config: Joi.object({
            request: Joi.object({
                destination_url: Joi.string().required(),
                destination_path: Joi.string().allow('', null),
                method: Joi.string(),
                transform: Joi.string().required(),
                log_before_modify: Joi.string().allow(null, ''),
                log_after_modify: Joi.string().allow(null, ''),
                adds: addOrModifySchemaRequest,
                modifies: addOrModifySchemaRequest,
                deletes: deletesRequestSchema

            }).required(),
            response: Joi.object({
                status_code: Joi.number().required(),
                transform: Joi.string().required(),
                log_before_modify: Joi.string().allow(null, ''),
                log_after_modify: Joi.string().allow(null, ''),
                adds: addOrModifySchemaResponse,
                modifies: addOrModifySchemaResponse,
                deletes: deletesResponseSchema

            }).required(),

        })

    })
    return schema.validate(data)
}


export const updateConfigurevalidation = (data: Request): ValidationResult => {
    const schema = Joi.object({
        project_id: Joi.string().required(),
        description: Joi.string(),
        config: Joi.object({
            id: Joi.string().required(),
            request: Joi.object({
                destination_url: Joi.string().required(),
                destination_path: Joi.string().allow('', null),
                method: Joi.string(),
                transform: Joi.string().required(),
                log_before_modify: Joi.string().allow(null, ''),
                log_after_modify: Joi.string().allow(null, ''),
                adds: addOrModifySchemaRequest,
                modifies: addOrModifySchemaRequest,
                deletes: deletesRequestSchema

            }).required(),
            response: Joi.object({
                status_code: Joi.number().required(),
                transform: Joi.string().required(),
                log_before_modify: Joi.string().allow(null, ''),
                log_after_modify: Joi.string().allow(null, ''),
                adds: addOrModifySchemaResponse,
                modifies: addOrModifySchemaResponse,
                deletes: deletesResponseSchema

            }).required(),

        })

    })
    return schema.validate(data)
}

