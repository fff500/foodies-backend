import express from "express";
import ctrlRecipes from "../controllers/recipesControllers.js";
import isIdValid from "../middlewares/isIdValid.js";
import isBodyEmpty from "../middlewares/isBodyEmpty.js";
import validateBody from "../decorators/validateBody.js";
import { recipesSchema } from "../schemas/recipesSchema.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const recipesRouter = express.Router();

recipesRouter.get("/", ctrlRecipes.getFilterdRecipes);

recipesRouter.get("/popular", ctrlRecipes.getPopular);

recipesRouter.get("/own-recipes", isAuthenticated, ctrlRecipes.getOwnRecipes);

recipesRouter.get("/favorites", isAuthenticated, ctrlRecipes.getFavorites);

recipesRouter.get(
  "/favorites/total",
  isAuthenticated,
  ctrlRecipes.getFavoritesCount
);

recipesRouter.get("/:id", isIdValid, ctrlRecipes.findRecipe);

recipesRouter.post(
  "/",
  isAuthenticated,
  isBodyEmpty,
  validateBody(recipesSchema),
  ctrlRecipes.createRecipe
);

recipesRouter.delete(
  "/:id",
  isAuthenticated,
  isIdValid,
  ctrlRecipes.deleteRecipe
);

recipesRouter.post(
  "/favorites/:id",
  isAuthenticated,
  isIdValid,
  ctrlRecipes.addFavorite
);

recipesRouter.delete(
  "/favorites/:id",
  isAuthenticated,
  isIdValid,
  ctrlRecipes.deleteFavorite
);

export default recipesRouter;
