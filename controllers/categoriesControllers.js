import * as categoriesService from "../services/categoriesServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getCategories = async (req, res) => {
  const categories = await categoriesService.findCategories();
  console.log(categories);
  res.status(201).json(categories);
};

export default {
  getCategories: controllerWrapper(getCategories),
};
