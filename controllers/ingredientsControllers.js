import * as ingredientsServices from "../services/ingredientsServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getIngredients = async (req, res) => {
  const ingredients = await ingredientsServices.findIngredients();
  res.status(201).json(ingredients);
};

export default {
  getIngredients: controllerWrapper(getIngredients),
};
