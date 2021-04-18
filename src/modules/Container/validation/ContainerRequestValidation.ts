import Joi, { ValidationResult } from 'joi';
export const storeContainerValidation = (data: Request): ValidationResult => {
    const schema =Joi.object({
        id: Joi.string().allow(null),
        name: Joi.string().required(),
        containerId: Joi.string().allow(null),
        description: Joi.string().allow(null, ''),
        projectIds: Joi.array().items(Joi.string().required()).required(),
        routers: Joi.array().items(routerSchema.required()).required()
    })
    return schema.validate(data)
}

const routerSchema = Joi.object({
    path: Joi.string().required(),
    type: Joi.string().required(),
    method: Joi.string().required(),
    project_id: Joi.string().required()
})

export const updateContainerValidation = (data: Request): ValidationResult => {
    const schema =Joi.object({
        id: Joi.string().allow(null),
        name: Joi.string().required(),
        containerId: Joi.string().allow(null),
        description: Joi.string().allow(null, ''),
        projectIds: Joi.array().items(Joi.string().required()).required(),
        routers: Joi.array().items(routerSchema.required()).required()
    })
    return schema.validate(data)
}
