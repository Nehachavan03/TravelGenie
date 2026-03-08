const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {

  const { message } = req.body;

  if (!message) {
    return res.json({
      reply: "Please ask something like '3 day trip in Paris'"
    });
  }

  const msg = message.toLowerCase();

  // detect number of days
  let days = 1;

  const dayMatch = msg.match(/\d+/);
  if (dayMatch) {
    days = parseInt(dayMatch[0]);
  }

  // detect city
  const cityQuery = "SELECT city_id, name FROM cities";

  db.query(cityQuery, (err, cities) => {

    if (err) return res.status(500).json({ reply: "Database error" });

    let city = null;

    for (let c of cities) {
      if (msg.includes(c.name.toLowerCase())) {
        city = c;
        break;
      }
    }

    if (!city) {
      return res.json({
        reply: "Please mention a city like Paris, Mumbai, Tokyo etc."
      });
    }

    // fetch places
    const placeQuery = `
      SELECT name, description, address
      FROM places
      WHERE city_id = ?
      LIMIT ?
    `;

    db.query(placeQuery, [city.city_id, days * 3], (err, places) => {

      if (err) return res.status(500).json({ reply: "Database error" });

      if (places.length === 0) {
        return res.json({
          reply: "No places found for that city."
        });
      }

      // create itinerary
      let itinerary = [];
      let index = 0;

      for (let d = 1; d <= days; d++) {

        let dayPlan = [];

        for (let i = 0; i < 3 && index < places.length; i++) {
          dayPlan.push(places[index]);
          index++;
        }

        itinerary.push({
          day: d,
          places: dayPlan
        });

      }

      res.json({
        reply: `Here is a ${days}-day travel plan for ${city.name}`,
        itinerary
      });

    });

  });

});

module.exports = router;