import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const signup = async (req, res) => {
  const user = await usersServices.findUser({ email: req.body.email });

  if (user) throw HttpError(409, "Email is already in use");

  const newUser = await usersServices.saveUser(req.body);

  res.status(200).json({
    user: {
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const user = await usersServices.findUser({ email: req.body.email });

  if (!user) throw HttpError(409, "Email or password is wrong");

  const isPasswordSame = await usersServices.checkUserPassword(
    req.body.password,
    user.password
  );

  if (!isPasswordSame) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = await usersServices.createToken({ id: user.id });
  const updatedUser = await usersServices.updateUser(
    { _id: user.id },
    { token }
  );

  res.status(200).json({
    user: {
      email: updatedUser.email,
      token: updatedUser.token,
    },
  });
};

const current = async (req, res) => {
  const { email, name, avatar } = req.user;

  res.status(200).json({
    user: {
      email,
      name,
      avatar,
    },
  });
};

const getUserInfo = async (req, res) => {
  const userId = req.params.userId;

  const user = await usersServices.findUser({ _id: userId });

  if (!user) throw HttpError(404, "User not found");

  const createdRecipesCount =
    (await Recipes.countDocuments({ creator: userId })) || 0;
  const followersCount = user.followers.length;

  let additionalInfo = {
    createdRecipesCount,
    followersCount,
  };

  if (req.user._id.toString() === userId) {
    // TODO add favorite recipes count
    // const favoriteRecipesCount = user.followers.length;
    const followingCount = user.following.length;

    additionalInfo = {
      ...additionalInfo,
      // favoriteRecipesCount,
      followingCount,
    };
  }

  res.status(200).json({
    email: user.email,
    name: user.name,
    avatar: user.avatar,
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

  res.status(200).json({
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

  res.status(200).json({ followers });
};

const getFollowing = async (req, res) => {
  const { following } = req.user;

  res.status(200).json({ following });
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

  res.status(200).json({ success: true });
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

  res.status(200).json({ success: true });
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
};
