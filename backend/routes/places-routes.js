const express = require("express");
const { check } = require("express-validator");

// Import controllers
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty().withMessage("Title can't be empty!"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Minimum length for description should be 5!"),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty().withMessage("Title can't be empty!"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Minimum length for description should be 5!"),
  ],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
