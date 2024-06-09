import Joi from "joi";

import { EMAIL_REGEXP } from "../constants/users.js";

export const signupSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
  password: Joi.string().min(6).required(),
});
