import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
    },
    name: {
      type: String,
    },
    followers: {
      type: [Schema.Types.ObjectId], // assumes an array of users id
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId], // assumes an array of users id
      default: [],
    },
    favorites: {
      type: [String],
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
