import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

const recipesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    area: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    description: {
      type: String,
    },
    thumb: {
      type: String,
    },
    time: {
      type: String,
    },
    ingredients: {
      type: [
        {
          id: {
            type: String,
            ref: "ingredient",
          },
          measure: {
            type: String,
          },
        },
      ],
      required: true,
    },
    favoriteByUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
  },
  { versionKey: false }
);

recipesSchema.post("save", handleSaveError);

recipesSchema.pre("findOneAndUpdate", setUpdateSettings);

recipesSchema.post("findOneAndUpdate", handleSaveError);

const Recipe = model("recipe", recipesSchema);

export default Recipe;
