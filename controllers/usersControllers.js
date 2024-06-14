import * as usersServices from "../services/usersServices.js";
import * as recipesServices from "../services/recipesServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import { getSkip } from "../helpers/getSkip.js";
import validatePassword from "../helpers/validatePassword.js";
import { createToken } from "../helpers/jwt.js";

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
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    },
  });
};

const current = async (req, res) => {
  const { followers, following, favorites, email, name, avatar, _id } =
    req.user;

  const createdRecipesCount = await recipesServices.countDocuments({
    owner: _id,
  });

  res.json({
    email,
    name,
    avatar,
    followers,
    following,
    favorites,
    createdRecipesCount,
    _id,
  });
};

const getUserInfo = async (req, res) => {
  const { id } = req.params;

  const user = await usersServices.findUser({ _id: id });

  if (!user) throw HttpError(404, "User not found");

  const { followers, email, name, avatar } = user;

  const createdRecipesCount = await recipesServices.countDocuments({
    owner: user._id,
  });

  res.json({
    email,
    name,
    avatar,
    followers,
    createdRecipesCount,
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
  const { userId } = req.params;

  const user = await usersServices.findUser({ _id: userId });
  const followers = await usersServices.findUsersByIds(user.followers);

  const followersData = [];

  for (const follower of followers) {
    const { email, name, avatar, _id, followers: followerIds } = follower;

    const createdRecipesCount = await recipesServices.countDocuments({
      owner: _id,
    });

    followersData.push({
      email,
      name,
      avatar,
      _id,
      createdRecipesCount,
      followersCount: followerIds.length,
    });
  }

  res.json({ followersData });
};

const getFollowersCurrent = async (req, res) => {
  const followers = await usersServices.findUsersByIds(req.user.followers);

  const followersData = [];

  for (const follower of followers) {
    const { email, name, avatar, _id, followers: followerFollowers } = follower;

    const createdRecipesCount = await recipesServices.countDocuments({
      owner: _id,
    });

    followersData.push({
      email,
      name,
      avatar,
      _id,
      createdRecipesCount,
      followersCount: followerFollowers.length,
    });
  }

  res.json({ followersData });
};

const getFollowing = async (req, res) => {
  const { following } = req.user;

  const followingData = await Promise.all(
    following.map(async (id) => {
      let user = await usersServices.findUser({ _id: id });
      if (!user) throw HttpError(404, "User not found");

      const { followers, email, name, avatar, _id } = user;

      const createdRecipesCount = await recipesServices.countDocuments({
        owner: user._id,
      });
      const followersCount = followers.length;

      const additionalInfo = {
        createdRecipesCount,
        followersCount,
      };

      return {
        email,
        name,
        avatar,
        _id,
        ...additionalInfo,
      };
    })
  );

  res.json({ followingData });
};

const followUser = async (req, res) => {
  const userToFollowId = req.params.userId;

  await usersServices.updateUser(
    { _id: req.user._id },
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
    { _id: req.user._id },
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

  const recipes = await recipesServices.findRecipes({
    filter,
    options,
  });

  const totalCount = await recipesServices.countDocuments(filter);

  res.json({
    totalCount,
    page,
    recipes,
  });
};

export default {
  signup: controllerWrapper(signup),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  getUserInfo: controllerWrapper(getUserInfo),
  updateAvatar: controllerWrapper(updateAvatar),
  logout: controllerWrapper(logout),
  unfollowUser: controllerWrapper(unfollowUser),
  getFollowersCurrent: controllerWrapper(getFollowersCurrent),
  getFollowers: controllerWrapper(getFollowers),
  followUser: controllerWrapper(followUser),
  getFollowing: controllerWrapper(getFollowing),
  addFavorite: controllerWrapper(addFavorite),
  deleteFavorite: controllerWrapper(deleteFavorite),
  getFavorites: controllerWrapper(getFavorites),
};
