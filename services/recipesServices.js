import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";

const DEFAULT_FIELDS = "-favoritesCount";

export const findRecipes = (search) => {
  const { filter = {}, fields = DEFAULT_FIELDS, options = {} } = search;

  return Recipe.find(filter, fields, options).populate("owner");
};

export const findOne = async ({ _id }) => {
  const recipeObjectId = new mongoose.Types.ObjectId(_id);
  const result = await Recipe.aggregate([
    { $match: { _id: recipeObjectId } },
    {
      $lookup: {
        from: "ingredients",
        localField: "ingredients.id",
        foreignField: "_id",
        as: "ingredientDetails",
      },
    },
    {
      $addFields: {
        ingredients: {
          $map: {
            input: "$ingredients",
            as: "ingredient",
            in: {
              $mergeObjects: [
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$ingredientDetails",
                        cond: { $eq: ["$$this._id", "$$ingredient.id"] },
                      },
                    },
                    0,
                  ],
                },
                { measure: "$$ingredient.measure" },
              ],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        owner: { avatar: 1, name: 1, _id: 1 },
        recipeData: "$$ROOT",
      },
    },
    { $replaceRoot: { newRoot: { $mergeObjects: ["$recipeData", "$$ROOT"] } } },
    { $project: { recipeData: 0, ingredientDetails: 0 } },
  ]);

  return result[0];
};

export const createRecipe = (data) => Recipe.create(data);

export const deleteRecipe = (filter) =>
  Recipe.findByIdAndDelete(filter, { fields: DEFAULT_FIELDS });

export const addToFavorite = (filter, data) =>
  Recipe.findOneAndUpdate(filter, data, {
    fields: DEFAULT_FIELDS,
  });

export const countDocuments = async (filter) =>
  await Recipe.countDocuments(filter);
