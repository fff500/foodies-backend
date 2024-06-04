import { Schema, model } from 'mongoose';

const  areasSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Area is required'],
    },
  },
  { versionKey: false }
);

const Area = model('area', areasSchema);

export default Area;
