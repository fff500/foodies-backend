import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import isBodyEmpty from "../middlewares/isBodyEmpty.js";
import validateBody from "../decorators/validateBody.js";
import { signupSchema } from "../schemas/usersSchemas.js";
import { loginSchema } from "../schemas/usersSchemas.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/upload.js";

const usersRouter = express.Router();
usersRouter.get("/following", isAuthenticated, usersControllers.getFollowing);
usersRouter.get("/followers", isAuthenticated, usersControllers.getFollowers);
usersRouter.get("/current", isAuthenticated, usersControllers.current);
usersRouter.get("/", isAuthenticated, usersControllers.getUserInfo);

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

usersRouter.patch(
  "/avatars",
  upload.single("avatar"),
  isAuthenticated,
  usersControllers.updateAvatar
);

usersRouter.post("/logout", isAuthenticated, usersControllers.logout);

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

export default usersRouter;
