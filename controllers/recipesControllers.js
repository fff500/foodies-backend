import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/controllerWrapper.js";
import * as recipesServices from "../services/recipesServices.js";
import Recipe from "../models/Recipe.js";

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
    ...(ingredient ? { ingredients: { id: ingredient } } : {}),
  };

  const skip = (page - 1) * limit;
  const options = { skip, limit };

  const recipes = await recipesServices.getFilteredRecipes({
    filter,
    options,
  });

  res.json(recipes);
};

const findRecipeById = async (req, res) => {
  const { id } = req.params;

  const recipe = await recipesServices.findById(id);

  if (!recipe) {
    throw HttpError(404);
  }

  res.json(recipe);
};

const getPopular = async (req, res) => {
  const filter = { favoriteByUsers: { $exists: true } };

  // Recipe.aggregate([
  //   { $addFields: { favoriteByUsersCount: { $size: "favoriteByUsers" } } },
  // ]);

  const recipes = await recipesServices.getFilteredRecipes({ filter });

  const sortedRecipes = recipes.sort(
    (a, b) => b.favoriteByUsers.length - a.favoriteByUsers.length
  );

  res.json(sortedRecipes);
};

const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  const newRecipe = await recipesServices.createRecipe({ ...req.body, owner });

  if (!newRecipe) {
    throw HttpError(400);
  }

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

  res.json(deletedRecipe);
};

const getOwnRecipes = async (req, res) => {
  const { id: owner } = req.user;

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

  await recipesServices.addToFavorite(
    { _id },
    { $push: { favoriteByUsers: userId } }
  );

  res.json({
    success: true,
    message: "Recipe has been added to favorite",
  });
};

const deleteFavorite = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: _id },
  } = req;

  await recipesServices.addToFavorite(
    { _id },
    { $pull: { favoriteByUsers: userId } }
  );

  res.json({
    success: true,
    message: "Recipe has been deleted from favorite",
  });
};

const getFavorites = async (req, res) => {
  const { _id: owner } = req.user;

  const favoriteRecipes = await recipesServices.findRecipes({
    favoriteByUsers: { $elemMatch: owner },
  });

  res.json(favoriteRecipes);
};

export default {
  getFilterdRecipes: ctrlWrapper(getFilterdRecipes),
  findRecipeById: ctrlWrapper(findRecipeById),
  getPopular: ctrlWrapper(getPopular),
  createRecipe: ctrlWrapper(createRecipe),
  deleteRecipe: ctrlWrapper(deleteRecipe),
  getOwnRecipes: ctrlWrapper(getOwnRecipes),
  addFavorite: ctrlWrapper(addFavorite),
  deleteFavorite: ctrlWrapper(deleteFavorite),
  getFavorites: ctrlWrapper(getFavorites),
};
