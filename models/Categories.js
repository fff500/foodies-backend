import { Schema, model } from "mongoose";

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Сategory name is required"],
    },
  },
  { versionKey: false }
);

const Categories = model("category", categoriesSchema);

export default Categories;
