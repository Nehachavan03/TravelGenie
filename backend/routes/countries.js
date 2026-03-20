const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all countries
router.get("/", (req, res) => {
  const query = "SELECT country_code AS code, country_name AS name FROM countries";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching countries:", err);
      // Send back the specific error message to help debug during development/deployment
      res.status(500).json({ 
        message: "Database error fetching countries", 
        error: err.message,
        code: err.code
      });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;