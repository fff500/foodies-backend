import * as categoriesService from "../services/categoriesServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import { getSkip } from "../helpers/getSkip.js";

const getCategories = async (req, res) => {
  const filter = {};
  const fields = "";
  const { page = 1, limit = 11 } = req.query;
  const skip = getSkip(page, limit);
  const settings = { skip, limit };
  const categories = await categoriesService.findCategories({
    filter,
    fields,
    settings,
  });
  const total = await categoriesService.countCategories(filter);
  res.json({ total, categories });
};

export default {
  getCategories: controllerWrapper(getCategories),
};
