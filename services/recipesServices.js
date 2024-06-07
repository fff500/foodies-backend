import Recipe from "../models/Recipe.js";

export const findRecipes = (search) => {
  const { filter = {}, fields = "", options = {} } = search;

  return Recipe.find(filter, fields, options);
};

export const findOne = (filter) => Recipe.findOne(filter);

export const createRecipe = (data) => Recipe.create(data);

export const deleteRecipe = (filter) => Recipe.findByIdAndDelete(filter);

export const countDocuments = async (filter) =>
  await Recipe.countDocuments(filter);
