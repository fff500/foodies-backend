import { Schema, model } from "mongoose";

const ingredientsSchema = new Schema(
  {
    name: {
      type: String,
    },
    desc: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  { versionKey: false },
);

const Ingredients = model("ingredient", ingredientsSchema);

export default Ingredients;
