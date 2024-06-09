import * as usersServices from "../services/usersServices.js";
import * as recipesServices from "../services/recipesServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import { getSkip } from "../helpers/getSkip.js";
import validatePassword from "../helpers/validatePassword.js";
import { createToken } from "../helpers/jwt.js";
import Recipe from "../models/Recipe.js";

const signup = async (req, res) => {
  const user = await usersServices.findUser({ email: req.body.email });

  if (user) throw HttpError(409, "Email is already in use");

  const newUser = await usersServices.saveUser(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const user = await usersServices.findUser({ email: req.body.email });

  if (!user) throw HttpError(409, "Email or password is wrong");

  const isPasswordSame = await validatePassword(
    req.body.password,
    user.password
  );

  if (!isPasswordSame) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = createToken({ id: user.id });
  const updatedUser = await usersServices.updateUser(
    { _id: user.id },
    { token }
  );

  res.json({
    user: {
      email: updatedUser.email,
      token: updatedUser.token,
    },
  });
};

const current = async (req, res) => {
  const { email, name, avatar, favorites, favoritesCount } = req.user;

  res.json({
    user: {
      email,
      name,
      avatar,
      favorites,
      favoritesCount,
    },
  });
};

const getUserInfo = async (req, res) => {
  const { email: userEmail } = req.params;

  const user = await usersServices.findUser({ email: userEmail });

  if (!user) throw HttpError(404, "User not found");

  const { followers, following, favorites, email, name, avatar } = user;

  const createdRecipesCount = await recipesServices.countDocuments({
    owner: user._id,
  });
  const followersCount = followers.length;

  const additionalInfo = {
    createdRecipesCount,
    followersCount,
  };

  if (req.user.email === userEmail) {
    additionalInfo.favoritesCount = favorites.length;
    additionalInfo.followingCount = following.length;
  }

  res.json({
    email,
    name,
    avatar,
    ...additionalInfo,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const oldPath = req.file.path;
  const avatarName = req.file.originalname;

  const newPath = await usersServices.updateAvatar(oldPath, avatarName);
  const updatedUser = await usersServices.updateUser(
    { _id: _id },
    { avatar: newPath }
  );

  res.json({
    avatar: updatedUser.avatar,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await usersServices.updateUser({ _id: _id }, { token: "" });

  res.status(204).json("No Content");
};

const getFollowers = async (req, res) => {
  const { followers } = req.user;

  res.json({ followers });
};

const getFollowing = async (req, res) => {
  const { following } = req.user;

  res.json({ following });
};

const followUser = async (req, res) => {
  const userToFollowId = req.params.userId;

  await usersServices.updateUser(
    { _id: req.user.id },
    { $push: { following: userToFollowId } }
  );

  await usersServices.updateUser(
    { _id: userToFollowId },
    { $push: { followers: req.user._id } }
  );

  res.json({ success: true });
};

const unfollowUser = async (req, res) => {
  const userToUnfollowId = req.params.userId;

  await usersServices.updateUser(
    { _id: req.user.id },
    { $pull: { following: userToUnfollowId } }
  );

  await usersServices.updateUser(
    { _id: userToUnfollowId },
    { $pull: { followers: req.user._id } }
  );

  res.json({ success: true });
};

const addFavorite = async (req, res) => {
  const {
    user: { _id },
    params: { id },
  } = req;

  const isFavorite = await usersServices.findUser({
    _id,
    favorites: id,
  });

  if (isFavorite) {
    throw HttpError(404, "Recipe has been already added");
  }

  const updatedUser = await usersServices.updateUser(
    { _id },
    { $push: { favorites: id } }
  );

  await recipesServices.addToFavorite(
    { _id: id },
    { $inc: { favoritesCount: 1 } }
  );

  if (!updatedUser) {
    throw HttpError(404);
  }

  res.json(updatedUser);
};

const deleteFavorite = async (req, res) => {
  const {
    user: { _id },
    params: { id },
  } = req;

  const isFavoriteAdded = await usersServices.findUser({
    _id,
    favorites: id,
  });

  if (!isFavoriteAdded) {
    throw HttpError(404, "Recipe hasn't been added yet");
  }

  const updatedUsers = await usersServices.updateUser(
    { _id },
    { $pull: { favorites: id } }
  );

  await recipesServices.addToFavorite(
    { _id: id },
    { $inc: { favoritesCount: -1 } }
  );

  res.json(updatedUsers);
};

const getFavorites = async (req, res) => {
  const { favorites } = req.user;
  const { page = 1, limit = 20 } = req.query;

  const filter = { _id: { $in: favorites } };
  const skip = getSkip(page, limit);
  const options = { skip, limit };

  const favoriteRecipes = await recipesServices.findRecipes({
    filter,
    options,
  });

  res.json(favoriteRecipes);
};

export default {
  signup: controllerWrapper(signup),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  getUserInfo: controllerWrapper(getUserInfo),
  updateAvatar: controllerWrapper(updateAvatar),
  logout: controllerWrapper(logout),
  unfollowUser: controllerWrapper(unfollowUser),
  getFollowers: controllerWrapper(getFollowers),
  followUser: controllerWrapper(followUser),
  getFollowing: controllerWrapper(getFollowing),
  addFavorite: controllerWrapper(addFavorite),
  deleteFavorite: controllerWrapper(deleteFavorite),
  getFavorites: controllerWrapper(getFavorites),
};
