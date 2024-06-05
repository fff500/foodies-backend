import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import isBodyEmpty from "../middlewares/isBodyEmpty.js";
import validateBody from "../decorators/validateBody.js";
import { signupSchema } from "../schemas/usersSchemas.js";

const usersRouter = express.Router();

usersRouter.post(
  "/signup",
  isBodyEmpty,
  validateBody(signupSchema),
  usersControllers.signup,
);

export default usersRouter;
