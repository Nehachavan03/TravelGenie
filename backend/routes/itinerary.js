const express = require("express");
const router = express.Router();
const db = require("../db");


// Create itinerary
// POST /itinerary/create
router.post("/create", (req, res) => {

  const { user_id, start_date, end_date, budget, city_id } = req.body;

  const query = `
    INSERT INTO itineraries (user_id, start_date, end_date, budget, city_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, start_date, end_date, budget, city_id], (err, result) => {

    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json({
        message: "Itinerary created",
        itinerary_id: result.insertId
      });
    }

  });

});


// Add place to itinerary
// POST /itinerary/add-place
router.post("/add-place", (req, res) => {

  const { itinerary_id, day_no, place_id } = req.body;

  const query = `
    INSERT INTO itinerary_details (itinerary_id, day_no, place_id)
    VALUES (?, ?, ?)
  `;

  db.query(query, [itinerary_id, day_no, place_id], (err, result) => {

    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json({
        message: "Place added to itinerary"
      });
    }

  });

});


// Get itinerary details
// GET /itinerary/details/:itinerary_id
router.get("/details/:itinerary_id", (req, res) => {
  const itineraryId = req.params.itinerary_id;

  const headerQuery = `
    SELECT i.itinerary_id AS id, c.name AS city_name, i.start_date, i.end_date, i.budget
    FROM itineraries i
    JOIN cities c ON i.city_id = c.city_id
    WHERE i.itinerary_id = ?
  `;

  db.query(headerQuery, [itineraryId], (err, headerResults) => {
    if (err) return res.status(500).send("Database error");
    if (headerResults.length === 0) return res.status(404).send("Not found");

    const trip = headerResults[0];

    const itemsQuery = `
      SELECT id.day_no AS day_number,
             p.name AS place_name,
             p.description AS place_description,
             c.category_name
      FROM itinerary_details id
      JOIN places p ON id.place_id = p.place_id
      JOIN categories c ON p.category_id = c.category_id
      WHERE id.itinerary_id = ?
      ORDER BY id.day_no
    `;

    db.query(itemsQuery, [itineraryId], (err, itemsResults) => {
      if (err) return res.status(500).send("Database error");
      // Add fake time slots
      const items = itemsResults.map((item, index) => ({
        ...item,
        time_slot: `${10 + (index % 4)}:00 AM`
      }));
      trip.items = items;
      res.json(trip);
    });
  });
});


// Get itineraries of a user
// GET /itinerary/:user_id
router.get("/:user_id", (req, res) => {

  const userId = req.params.user_id;

  const query = `
    SELECT i.itinerary_id, i.start_date, i.end_date, i.budget,
        c.name AS city
    FROM itineraries i
    JOIN cities c ON i.city_id = c.city_id
    WHERE i.user_id = ?
        `;

  db.query(query, [userId], (err, results) => {

    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }

  });

});

module.exports = router;