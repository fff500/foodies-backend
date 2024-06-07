import Joi from "joi";

export const recipesSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  area: Joi.string().required(),
  instructions: Joi.string(),
  description: Joi.string(),
  thumb: Joi.string(),
  time: Joi.string(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      measure: Joi.string(),
    })
  ),
  owner: Joi.string().required(),
});
