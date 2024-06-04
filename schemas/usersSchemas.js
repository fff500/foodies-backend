import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

export const signupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
