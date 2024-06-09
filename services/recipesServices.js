import Recipe from "../models/Recipe.js";

const DEFAULT_FIELDS = "-favoritesCount";

export const findRecipes = (search) => {
  const { filter = {}, fields = DEFAULT_FIELDS, options = {} } = search;

  return Recipe.find(filter, fields, options);
};

export const findOne = (filter) => Recipe.findOne(filter, DEFAULT_FIELDS);

export const createRecipe = (data) => Recipe.create(data);

export const deleteRecipe = (filter) =>
  Recipe.findByIdAndDelete(filter, { fields: DEFAULT_FIELDS });

export const addToFavorite = (filter, data) =>
  Recipe.findOneAndUpdate(filter, data, {
    fields: DEFAULT_FIELDS,
  });

export const countDocuments = async (filter) =>
  await Recipe.countDocuments(filter);
