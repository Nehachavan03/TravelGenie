const express = require("express");
const router = express.Router();
const db = require("../db");

// GET cities by country code
router.get("/:country_code", (req, res) => {
  const countryCode = req.params.country_code;

  const query = "SELECT city_id, name, pincode FROM cities WHERE country_code = ?";

  db.query(query, [countryCode], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;