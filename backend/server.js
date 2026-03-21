const express = require("express");
const cors = require("cors");
const db = require("./db");

const countriesRoute = require("./routes/countries");
const citiesRoute = require("./routes/cities");
const placesRoute = require("./routes/places");
const reviewsRoute = require("./routes/reviews");
const itineraryRoute = require("./routes/itinerary");
const authRoutes = require("./routes/auth");
const chatbotRoute = require("./routes/chatbot");
const favoritesRoute = require("./routes/favorites");


const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/countries", countriesRoute);
app.use("/cities", citiesRoute);
app.use("/places",placesRoute)
app.use("/reviews", reviewsRoute);
app.use("/itinerary", itineraryRoute);
app.use("/auth", authRoutes);
app.use("/chatbot", chatbotRoute);
app.use("/favorites", favoritesRoute);
app.use("/ai", require("./routes/ai_planner"));

app.get("/", (req, res) => {
  res.send("Travel Planner API Running");
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});