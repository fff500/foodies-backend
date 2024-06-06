import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import jimp from "jimp";
import path from "path";

import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (data) => {
  const avatar = gravatar.url(data.email);

  const hashPassword = await bcrypt.hash(data.password, 10);

  return User.create({ ...data, avatar, password: hashPassword });
};

export const updateUser = (filter, data) =>
  User.findOneAndUpdate(filter, data, { new: true });

export const checkUserPassword = async (password, hashPassword) =>
  await bcrypt.compare(password, hashPassword);

export const createToken = async (data) => {
  return jwt.sign(data, process.env.JWT_SECRET);
};

export async function updateAvatar(originalPath, originalName) {
  const newPath = path.resolve("public/avatars", originalName);

  await jimp
    .read(originalPath)
    .then((image) => {
      return image.resize(250, 250).write(newPath);
    })
    .catch((err) => {
      console.error("Error resizing avatar:", err.message);
      throw new Error("Error resizing avatar");
    });

  return newPath;
}
