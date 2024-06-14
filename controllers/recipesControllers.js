import HttpError from "../helpers/HttpError.js";
import { getSkip } from "../helpers/getSkip.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import * as recipesServices from "../services/recipesServices.js";
import path from "path";
import fs from "fs/promises";
import resizeThumb from "../helpers/resizeThumb.js";

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

export const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  if (!req.file) {
    throw HttpError(404, "Image file is required");
  }

  const { path: oldPath, filename } = req.file;

  const thumbPath = path.resolve("public", "recipes");

  const newPath = path.join(thumbPath, filename);

  await fs.rename(oldPath, newPath);

  const thumbURL = path.join("recipes", filename);

  resizeThumb(thumbURL, newPath);

  const data = JSON.parse(req.body.json);

  const newRecipe = await recipesServices.createRecipe({
    ...data,
    owner,
    thumb: thumbURL,
  });

  if (!newRecipe) {
    throw HttpError(400);
  }

  res.status(201).json(newRecipe);
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
