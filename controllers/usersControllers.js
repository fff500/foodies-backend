import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const signup = async (req, res) => {
  const user = await usersServices.findUser({ email: req.body.email });

  if (user) throw HttpError(409, "Email is already in use");

  const newUser = await usersServices.saveUser(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

export default {
  signup: controllerWrapper(signup),
};
