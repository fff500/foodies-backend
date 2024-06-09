import HttpError from "../helpers/HttpError.js";
import { getSkip } from "../helpers/getSkip.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import * as recipesServices from "../services/recipesServices.js";

const getFilterdRecipes = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category = "",
    area = "",
    ingredient = "",
  } = req.query;

  const filter = {
    ...(category ? { category } : {}),
    ...(area ? { area } : {}),
    ...(ingredient ? { ingredients: { $elemMatch: { id: ingredient } } } : {}),
  };

  const skip = getSkip(page, limit);
  const options = { skip, limit };

  const recipes = await recipesServices.findRecipes({
    filter,
    options,
  });

  res.json(recipes);
};

const findRecipe = async (req, res) => {
  const { id: _id } = req.params;

  const recipe = await recipesServices.findOne({ _id });

  if (!recipe) {
    throw HttpError(404);
  }

  res.json(recipe);
};

const getPopular = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = getSkip(page, limit);
  const options = { skip, limit, sort: { favoritesCount: "desc" } };

  const recipes = await recipesServices.findRecipes({ options });

  res.json(recipes);
};

const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  const newRecipe = await recipesServices.createRecipe({ ...req.body, owner });

  if (!newRecipe) {
    throw HttpError(400);
  }

  newRecipe.favoritesCount = undefined;

  res.status(201).json(newRecipe);
};

const deleteRecipe = async (req, res) => {
  const {
    user: { _id: owner },
    params: { id: _id },
  } = req;

  const deletedRecipe = await recipesServices.deleteRecipe({ owner, _id });

  if (!deletedRecipe) {
    throw HttpError(404);
  }

  res.status(204).json({});
};

const getOwnRecipes = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;

  const filter = { owner };
  const skip = getSkip(page, limit);
  const options = { skip, limit };

  const recipes = await recipesServices.findRecipes({ filter, options });

  if (!recipes.length) {
    throw HttpError(404);
  }

  res.json(recipes);
};

export default {
  getFilterdRecipes: controllerWrapper(getFilterdRecipes),
  findRecipe: controllerWrapper(findRecipe),
  getPopular: controllerWrapper(getPopular),
  createRecipe: controllerWrapper(createRecipe),
  deleteRecipe: controllerWrapper(deleteRecipe),
  getOwnRecipes: controllerWrapper(getOwnRecipes),
};
