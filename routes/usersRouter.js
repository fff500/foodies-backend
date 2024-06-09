import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import validateBody from "../decorators/validateBody.js";
import { signupSchema } from "../schemas/usersSchemas.js";
import { loginSchema } from "../schemas/usersSchemas.js";
import isBodyEmpty from "../middlewares/isBodyEmpty.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/upload.js";
import isIdValid from "../middlewares/isIdValid.js";

const usersRouter = express.Router();

usersRouter.get("/current", isAuthenticated, usersControllers.current);
usersRouter.get("/:email", isAuthenticated, usersControllers.getUserInfo);

usersRouter.post(
  "/signup",
  isBodyEmpty,
  validateBody(signupSchema),
  usersControllers.signup
);

usersRouter.post(
  "/login",
  isBodyEmpty,
  validateBody(loginSchema),
  usersControllers.login
);

usersRouter.post("/logout", isAuthenticated, usersControllers.logout);

usersRouter.patch(
  "/avatars",
  upload.single("avatar"),
  isAuthenticated,
  usersControllers.updateAvatar
);

usersRouter.get("/following", isAuthenticated, usersControllers.getFollowing);
usersRouter.get("/followers", isAuthenticated, usersControllers.getFollowers);

usersRouter.patch(
  "/follow/:userId",
  isAuthenticated,
  usersControllers.followUser
);

usersRouter.patch(
  "/unfollow/:userId",
  isAuthenticated,
  usersControllers.unfollowUser
);

usersRouter.get("/favorites", isAuthenticated, usersControllers.getFavorites);

usersRouter.post(
  "/favorites/:id",
  isAuthenticated,
  isIdValid,
  usersControllers.addFavorite
);

usersRouter.delete(
  "/favorites/:id",
  isAuthenticated,
  isIdValid,
  usersControllers.deleteFavorite
);

export default usersRouter;
