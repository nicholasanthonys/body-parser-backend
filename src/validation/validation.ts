import {Request} from 'express';
import Joi,{ValidationResult} from 'joi';

// const Joi = require("@hapi/joi");
export const registerValidation = (data:Request) :ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};


export const loginValidation = (data:Request) : ValidationResult => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
      });  
      return schema.validate(data);
}


