// Recipe.js
import { Schema, model } from "mongoose";

const recipeSchema = new Schema(
  {
    title: String,
    category: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    area: String,
    instructions: String,
    description: String,
    thumb: String,
    time: String,
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "ingredient",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Recipes = model("recipe", recipeSchema);
export default Recipes;
