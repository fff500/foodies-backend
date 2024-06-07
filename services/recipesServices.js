import Recipe from "../models/Recipe.js";

const defaultFields = "-favoritesCount";

export const findRecipes = (search) => {
  const { filter = {}, fields = defaultFields, options = {} } = search;

  return Recipe.find(filter, fields, options);
};

export const findOne = (filter) => Recipe.findOne(filter, defaultFields);

export const createRecipe = (data) => Recipe.create(data);

export const deleteRecipe = (filter) =>
  Recipe.findByIdAndDelete(filter, { fields: defaultFields });

export const addToFavorite = (filter, data) =>
  Recipe.findOneAndUpdate(filter, data, {
    fields: defaultFields,
  });
export const countDocuments = async (filter) =>
  await Recipe.countDocuments(filter);
