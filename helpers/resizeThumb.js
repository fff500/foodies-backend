import Jimp from "jimp";

const resizeThumb = (filePath, newPath) => {
  Jimp.read(`public/${filePath}`)
    .then((image) => {
      image.resize(250, 250).quality(60).write(newPath);
    })
    .catch((err) => {
      throw err;
    });
};

export default resizeThumb;
