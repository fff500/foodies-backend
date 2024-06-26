import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";

import User from "../models/User.js";

export const findUsersByIds = function (ids) {
  return User.find({
    _id: { $in: ids },
  });
};

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (data) => {
  const avatar = gravatar.url(data.email, {
    s: "100",
    protocol: "https",
    format: "qr",
  });

  const hashPassword = await bcrypt.hash(data.password, 10);

  return User.create({ ...data, avatar, password: hashPassword });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateAvatar = async (originalPath, originalName) => {
  const relativePath = "public/avatars";
  const absolutePath = path.resolve(relativePath, originalName);

  await jimp
    .read(originalPath)
    .then((image) => {
      return image.resize(250, 250).write(absolutePath);
    })
    .catch((err) => {
      console.error("Error resizing avatar:", err.message);
      throw new Error("Error resizing avatar");
    });

  const newPath = path.join("avatars", originalName);
  return newPath;
};
