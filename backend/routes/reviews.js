const express = require("express");
const router = express.Router();
const db = require("../db");

// GET reviews by place id
router.get("/:place_id", (req, res) => {
  const placeId = req.params.place_id;

  const query = `
    SELECT u.name AS user_name, r.rating, r.comment, r.review_date
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.place_id = ?
  `;

  db.query(query, [placeId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;