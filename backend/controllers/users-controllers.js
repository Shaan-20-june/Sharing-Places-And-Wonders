const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user-model");

//#region => get all users controller starts
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later!", 500)
    );
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
//#endregion => get all users controller ends

//#region => signup a user controller starts
const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError(`Invalid inputs passed, please check your data!`, 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again!", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("User already exists, please login instead!", 422)
    );
  }

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, please try later!", 500));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Signing Up failed, please try again!", 500));
  }

  // Creata token
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Signing Up failed, please try again!", 500));
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token });
};
//#endregion => signup a user controller ends

//#region => login user controller starts
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again!", 500));
  }

  // If user with the provided email address is not found
  if (!existingUser) {
    return next(new HttpError("Invalid credentials!", 403));
  }

  // Check for the password validity
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again!",
        500
      )
    );
  }

  // If password is incorrect
  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials!", 403));
  }

  // Create token if everything went correctly
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again!", 500));
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token });
};
//#endregion => login user controller ends

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
