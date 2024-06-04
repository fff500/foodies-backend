import * as areasServices from '../services/areasServices.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const getAreas = async (req, res) => {
  const areas = await areasServices.findAreas();
  res.status(201).json({
    areas
  });
};

export default {
  getAreas: controllerWrapper(getAreas),
};
