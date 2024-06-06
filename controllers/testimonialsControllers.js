import * as testimonialsServices from "../services/testimonialsServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getTestimonials = async (req, res) => {
  const testimonials = await testimonialsServices.findTestimonials();
  res.status(200).json(testimonials);
};

export default {
  getTestimonials: controllerWrapper(getTestimonials),
};
