const { v4: uuidV4 } = require("uuid");
const { validationResult, Result } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Statue",
    description: "One of the most beautiful sky scrapers in the world!",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire Central Building",
    description: "One of the most beautiful sky scrapers in the world!",
    address: "20 W 34th St., Jenkins, NY 85236, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  res.json({ places });
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

  const { title, description, creator, address } = req.body;

  // Fetching coordinates from geocode API starts
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  // Fetching coordinates from geocode API starts

  const createdPlace = {
    id: uuidV4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  // Validation of data from request starts
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorMessage = "Missing parameters : ";

    errors.errors.forEach((error) => {
      errorMessage += `${error.param}(${error.msg}), `;
    });

    throw new HttpError(
      `Invalid inputs passed, please check your data! ${errorMessage}`,
      422
    );
  }
  // Validation of data from request ends

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place with the given ID.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).send({ message: "Deleted place!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
