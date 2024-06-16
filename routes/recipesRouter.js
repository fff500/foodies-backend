import express from "express";
import recipesControllers from "../controllers/recipesControllers.js";
import isIdValid from "../middlewares/isIdValid.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/upload.js";

const recipesRouter = express.Router();

recipesRouter.get("/", recipesControllers.getFilteredRecipes);

recipesRouter.get("/popular", recipesControllers.getPopular);

recipesRouter.get(
  "/own-recipes",
  isAuthenticated,
  recipesControllers.getOwnRecipes
);

recipesRouter.get("/:id", isIdValid, recipesControllers.findRecipe);

recipesRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  recipesControllers.createRecipe
);

recipesRouter.delete(
  "/:id",
  isAuthenticated,
  isIdValid,
  recipesControllers.deleteRecipe
);

export default recipesRouter;
