import Categories from "../models/Categories.js";

export const findCategories = (params = {}) => {
  const { filter = {}, fields = "", settings = {} } = params;
  return Categories.find(filter, fields, settings);
};

export const countCategories = (filter) => Categories.countDocuments(filter);
