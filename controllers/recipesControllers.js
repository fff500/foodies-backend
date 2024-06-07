import HttpError from "../helpers/HttpError.js";
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

  const skip = (page - 1) * limit;
  const options = { skip, limit };

  const recipes = await recipesServices.getFilteredRecipes({
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
  const recipes = await recipesServices
    .getFilteredRecipes({})
    .sort({ favoritesCount: "desc" });

  res.json(recipes);
};

const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  const newRecipe = await recipesServices.createRecipe({ ...req.body, owner });

  if (!newRecipe) {
    throw HttpError(400);
  }

  newRecipe.favoriteByUsers = undefined;
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

  const recipes = await recipesServices.findRecipes({ owner });

  if (!recipes.length) {
    throw HttpError(404);
  }

  res.json(recipes);
};

const addFavorite = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: _id },
  } = req;

  const isRecipeAdded = await recipesServices.findOne({
    _id,
    favoriteByUsers: userId,
  });

  if (isRecipeAdded) {
    throw HttpError(404, "Recipe has been already added");
  }

  const updatedRecipe = await recipesServices.addToFavorite(
    { _id },
    { $push: { favoriteByUsers: userId }, $inc: { favoritesCount: 1 } }
  );

  if (!updatedRecipe) {
    throw HttpError(404);
  }

  res.json(updatedRecipe);
};

const deleteFavorite = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: _id },
  } = req;

  const isRecipeAdded = await recipesServices.findOne({
    _id,
    favoriteByUsers: userId,
  });

  if (!isRecipeAdded) {
    throw HttpError(404, "Recipe hasn't been added yet");
  }

  const updatedRecipe = await recipesServices.addToFavorite(
    { _id },
    { $pull: { favoriteByUsers: userId }, $inc: { favoritesCount: -1 } }
  );

  res.json(updatedRecipe);
};

const getFavorites = async (req, res) => {
  const { _id: favoriteByUsers } = req.user;

  const favoriteRecipes = await recipesServices.findRecipes({
    favoriteByUsers,
  });

  res.json(favoriteRecipes);
};

const getFavoritesCount = async (req, res) => {
  const { _id: favoriteByUsers } = req.user;
  const total = await recipesServices.countDocuments({
    favoriteByUsers,
  });

  res.json({ total });
};

export default {
  getFilterdRecipes: controllerWrapper(getFilterdRecipes),
  findRecipe: controllerWrapper(findRecipe),
  getPopular: controllerWrapper(getPopular),
  createRecipe: controllerWrapper(createRecipe),
  deleteRecipe: controllerWrapper(deleteRecipe),
  getOwnRecipes: controllerWrapper(getOwnRecipes),
  addFavorite: controllerWrapper(addFavorite),
  deleteFavorite: controllerWrapper(deleteFavorite),
  getFavorites: controllerWrapper(getFavorites),
  getFavoritesCount: controllerWrapper(getFavoritesCount),
};
