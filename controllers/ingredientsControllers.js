import * as ingredientsServices from "../services/ingredientsServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getIngredients = async (req, res) => {
  const ingredients = await ingredientsServices.findIngredients();
  res.json(ingredients);
};

export default {
  getIngredients: controllerWrapper(getIngredients),
};
