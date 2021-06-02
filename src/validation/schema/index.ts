import Joi from 'joi';



export const configRequestSchema = Joi.object({
    loop : Joi.string().allow(null, ""),
    destination_url: Joi.string().required(),
    destination_path: Joi.string().allow(null, ""),
    transform: Joi.string().required(),
    log_before_modify: Joi.object(),
    log_after_modify: Joi.object(),
    method: Joi.string(),
    adds: Joi.object({
        header: Joi.object(),
        body: Joi.object(),
        query: Joi.object(),
        param: Joi.object(),

    }),
    modifies: Joi.object({
        header: Joi.object(),
        body: Joi.object(),
        query: Joi.object(),
        param: Joi.object(),

    }),
    deletes: Joi.object({
        header: Joi.array().items(Joi.string()),
        body: Joi.array().items(Joi.string()),
        query: Joi.array().items(Joi.string()),
        param: Joi.array().items(Joi.string()),

    })
})



export const configResponseSchema = Joi.object({
    status_code: Joi.number().required(),
    transform: Joi.string().required(),
    log_before_modify: Joi.object(),
    log_after_modify: Joi.object(),
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



export const routerSchema = Joi.object({
    path: Joi.string().required(),
    type: Joi.string().required(),
    method: Joi.string().required(),
    project_id: Joi.string().required()
})

export const configContainer = Joi.object({
    id: Joi.string().allow(null),
    name: Joi.string().required(),
    containerId: Joi.string().allow(null),
    description: Joi.string().allow(null, ''),
    projectIds: Joi.array().items(Joi.string().required()).required(),
    routers: Joi.array().items(routerSchema.required()).required()
})

export const configureFileSchema = Joi.object({
    fileName: Joi.string().required(),
    alias: Joi.string().required()
})


export const cLogicSchema = Joi.object({
    rule: Joi.object(),
    data: Joi.object(),
    next_success: Joi.string(),
    response: configResponseSchema
})

export const parallelSchema = Joi.object({
    configures: Joi.array().items(configureFileSchema),
    failure_response: configResponseSchema,
    c_logics: Joi.array().items(cLogicSchema)
})

export const baseOption = Joi.object({
    project_max_circular: Joi.number().required(),
    circular_response: configResponseSchema
})