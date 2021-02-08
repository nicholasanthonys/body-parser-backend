import Joi from 'joi';

export const deletesSchema = Joi.object({
    header: Joi.array().items(Joi.string()),
    body: Joi.array().items(Joi.string()),
    query: Joi.array().items(Joi.string()),
})

export const addOrModifySchema = Joi.object({
    header: Joi.object(),
    body: Joi.object(),
    query: Joi.object()
})

export const base = Joi.object().keys({
    adds: addOrModifySchema,
    modifies: addOrModifySchema,
    deletes: deletesSchema

})

export const baseRequestResponse = base.keys({
    transform: Joi.string().required(),
    log_before_modify: Joi.string().allow(null, ''),
    log_after_modify: Joi.string().allow(null, ''),
})

export const requestSchema = baseRequestResponse.keys({
    destination_url: Joi.string().required(),
    destination_path: Joi.string(),
    method: Joi.string()
})


export const finalResponseSchema = Joi.object({
    configure_based: Joi.string().allow(null, ''),
    response: baseRequestResponse
})


export const configSchema = Joi.object({
    description: Joi.string().allow(null, ''),
    config: Joi.object({
        request: requestSchema,
        response: baseRequestResponse,
    })

})


export const routerSchema = Joi.object({
    path : Joi.string().required(),
    type : Joi.string().required(),
    method : Joi.string().required(),
    project_id : Joi.string().required()
})

export const configContainer = Joi.object({
    id : Joi.string(),
    name : Joi.string().required(),
    description : Joi.string().allow(null,''),
    projectIds : Joi.array().items(Joi.string().required()).required(),
    routers : Joi.array().items(routerSchema.required()).required()
})