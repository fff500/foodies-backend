import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import "dotenv/config";
import usersRouter from "./routes/usersRouter.js";
import areasRouter from "./routes/areasRouter.js";
import ingredientsRouter from "./routes/ingredientsRouter.js";
import testimonialsRouter from "./routes/testimonialsRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import recipesRouter from "./routes/recipesRouter.js";
import swaggerUi from "swagger-ui-express";

const { DB_HOST, PORT = 3000 } = process.env;

const swaggerJson = JSON.parse(
  fs.readFileSync(`${path.resolve()}/swagger.json`)
);

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/areas", areasRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/recipes", recipesRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
