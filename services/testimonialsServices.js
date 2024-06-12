import Testimonial from "../models/Testimonials.js";

export const findTestimonials = () =>
    Testimonial.find().populate("owner", "name");
