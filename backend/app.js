const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import routers
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

// Import Models
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

// WonderfulPlaces is the DataBase Name
const url =
  "mongodb+srv://santanu_dutta:mern_project_1@cluster0.1khtpes.mongodb.net/WonderfulPlaces?retryWrites=true&w=majority";

const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(url, connectConfig)
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is listening on PORT 5000.");
    });
  })
  .catch((err) => {
    console.log("Error :" + err.message);
  });