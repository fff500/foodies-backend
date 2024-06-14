import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { EMAIL_REGEXP } from "../constants/users.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: EMAIL_REGEXP,
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
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    favorites: {
      type: [String],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
