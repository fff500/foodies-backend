import { isValidObjectId } from "mongoose";

import HttpError from "../helpers/HttpError.js";

const isIdValid = (req, _, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return next(HttpError(404, "Not valid id"));

  next();
};

export default isIdValid;
