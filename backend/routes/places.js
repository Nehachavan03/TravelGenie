const express = require("express");
const router = express.Router();
const db = require("../db");

// GET places by city id
router.get("/:city_id", (req, res) => {
  const cityId = req.params.city_id;

  const query = `
    SELECT p.place_id, p.name, p.description, p.address, c.category_name
    FROM places p
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.city_id = ?
  `;

  db.query(query, [cityId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;