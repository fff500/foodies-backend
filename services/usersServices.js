import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";

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
