const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all countries
router.get("/", (req, res) => {
  const query = "SELECT * FROM countries";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;