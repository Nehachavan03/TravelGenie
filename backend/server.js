const express = require("express");
const cors = require("cors");
const db = require("./db");

const countriesRoute = require("./routes/countries");
const citiesRoute = require("./routes/cities");
const placesRoute = require("./routes/places");
const reviewsRoute = require("./routes/reviews");
const itineraryRoute = require("./routes/itinerary");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/countries", countriesRoute);
app.use("/cities", citiesRoute);
app.use("/places",placesRoute)
app.use("/reviews", reviewsRoute);
app.use("/itinerary", itineraryRoute);

app.get("/", (req, res) => {
  res.send("Travel Planner API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});