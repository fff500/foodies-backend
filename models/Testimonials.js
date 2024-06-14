import { Schema, model } from "mongoose";

const testimonialsSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Testimonial is required"],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { versionKey: false }
);

const Testimonial = model("testimonial", testimonialsSchema);

export default Testimonial;