import { Request } from 'express';
import Joi, { ValidationResult } from 'joi';
import { baseOption, configContainer, configSchema, finalResponseSchema } from './schema';

export const registerValidation = (data: Request): ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};


export const loginValidation = (data: Request): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
}

export const storeConfigurevalidation = (data: Request): ValidationResult => {
  const schema = configSchema.keys({
    project_id: Joi.string().required(),
    description: Joi.string(),
  })
  return schema.validate(data)
}

export const storeProjectValidation = (data: Request): ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    base: baseOption
  })
  return schema.validate(data)
}

export const updateProjectValidation = (data: Request): ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    base : baseOption

  })
  return schema.validate(data)
}

export const storeOrUpdateConfigContainer = (data: Request): ValidationResult => {
  return configContainer.validate(data)
}