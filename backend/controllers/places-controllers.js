const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place-model");
const User = require("../models/user-model");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Search operation failed, please try in a bit!", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    return next(
      new HttpError("Fetching places failed, please try in a bit!", 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  // Validation of data from request starts
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorMessage = "Missing parameters : ";

    errors.errors.forEach((error) => {
      errorMessage += `${error.param}(${error.msg}), `;
    });

    return next(
      new HttpError(
        `Invalid inputs passed, please check your data! ${errorMessage}`,
        422
      )
    );
  }
  // Validation of data from request ends

  const { title, description, creator, address, image } = req.body;

  // Fetching coordinates from geocode API starts
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  // Fetching coordinates from geocode API starts

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Empire_State_Building_LED_live_election_results_Obama_Romney_Spire_Close-up_%288162616388%29.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again!", 500));
  }

  if (!user) {
    return next(new HttpError("We could not find the user!", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Could not save place data, please try again!", 500)
    );
  }

  res.status(201).json({ place: newPlace.toObject() });
};

const updatePlace = async (req, res, next) => {
  // Validation of data from request starts
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorMessage = "Missing parameters : ";

    errors.errors.forEach((error) => {
      errorMessage += `${error.param}(${error.msg}), `;
    });

    return next(
      new HttpError(
        `Invalid inputs passed, please check your data! ${errorMessage}`,
        422
      )
    );
  }
  // Validation of data from request ends

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let placeToUpdate;
  try {
    placeToUpdate = await Place.findById(placeId);
    if (!placeToUpdate) {
      return next(
        new HttpError("Could not find place, please validate inputs!", 500)
      );
    }
    placeToUpdate.title = title;
    placeToUpdate.description = description;
    await placeToUpdate.save();
  } catch (err) {
    return next(new HttpError("Could not update data, please try again!", 500));
  }

  res.status(200).json({ place: placeToUpdate.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let placeToDelete;
  try {
    placeToDelete = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place!", 500)
    );
  }

  if (!placeToDelete) {
    return next(new HttpError("Could not find Place!", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.findByIdAndDelete(placeId, { session: sess });
    placeToDelete.creator.places.pull(placeToDelete);
    await placeToDelete.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place!", 500)
    );
  }

  res.status(200).send({ message: "Deleted place!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
