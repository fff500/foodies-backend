import bcrypt from "bcryptjs";

const validatePassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export default validatePassword;
