const { v4: uuidV4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user-model");

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

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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

  const newUser = new User({
    name,
    email,
    image: "//cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Signing Up failed, please try again!", 422));
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again!", 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Invalid credentials!", 401));
  }

  res.json({ message: "Logged In!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
