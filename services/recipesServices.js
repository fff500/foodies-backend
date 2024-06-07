import Recipe from "../models/Recipe.js";

const defaultFields = "-favoritesCount -favoriteByUsers";

export const getFilteredRecipes = (search) => {
  const { filter, fields, options } = search;

  return findRecipes(filter, fields, options);
};

export const findOne = (filter) => Recipe.findOne(filter, defaultFields);

export const createRecipe = (data) => Recipe.create(data);

export const deleteRecipe = (filter) =>
  Recipe.findByIdAndDelete(filter, { fields: defaultFields });

export const findRecipes = (
  filter = {},
  fields = defaultFields,
  options = {}
) => Recipe.find(filter, fields, options);

export const addToFavorite = (filter, data) =>
  Recipe.findOneAndUpdate(filter, data, {
    fields: defaultFields,
  });

export const countDocuments = async (filter) =>
  await Recipe.countDocuments(filter);
