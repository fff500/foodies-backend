import Recipe from "../models/Recipe.js";

export const getFilteredRecipes = (search) => {
  const { filter = {}, fields = "", options = {} } = search;

  return Recipe.find(filter, fields, options);
};

export const findById = (id) => Recipe.findById(id);

export const createRecipe = (data) => Recipe.create(data);

export const deleteRecipe = (filter) => Recipe.findByIdAndDelete(filter);

export const findRecipes = (filter) => Recipe.find(filter);

export const addToFavorite = (filter) => Recipe.findOneAndUpdate(filter);
