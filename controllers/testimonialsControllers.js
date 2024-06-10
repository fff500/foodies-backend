import * as testimonialsServices from "../services/testimonialsServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getTestimonials = async (req, res) => {
  const testimonials = await testimonialsServices.findTestimonials();
  res.json(testimonials);
};

export default {
  getTestimonials: controllerWrapper(getTestimonials),
};
