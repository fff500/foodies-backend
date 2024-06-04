import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';

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
