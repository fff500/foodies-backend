import * as categoriesService from "../services/categoriesServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getCategories = async (req, res) => {
  const categories = await categoriesService.findCategories();
  res.json(categories);
};

export default {
  getCategories: controllerWrapper(getCategories),
};
