const express = require("express");
const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

// Import controllers
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

//#region =>  Middleware for authenticating routes starts
router.use(checkAuth);
//#endregion =>  Middleware for authenticating routes ends

// The below routes should be accessible if user is logged in

//#region => Upload a new place route starts
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty().withMessage("Title can't be empty!"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Minimum length for description should be 5!"),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
//#endregion => Upload a new place route ends

//#region =>  Update a place route starts
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
//#endregion =>  Update a place route ends

//#region =>  Delete a place route starts
router.delete("/:pid", placesControllers.deletePlace);
//#endregion =>  Delete a place route ends

module.exports = router;
