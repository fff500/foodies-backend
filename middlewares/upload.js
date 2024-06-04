import multer from 'multer';
import path from 'path';

import HttpError from '../helpers/HttpError.js';

const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: (_, file, callback) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 1,
};

const fileFilter = (_, file, callback) => {
  const extension = file.originalname.split('.').pop();

  if (extension === 'exe')
    return callback(HttpError(400, '.exe files are not allowed'));

  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
