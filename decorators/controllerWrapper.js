const controllerWrapper = (cntrllr) => async (req, res, next) => {
  try {
    await cntrllr(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default controllerWrapper;
