const express = require("express");
const router = express.Router();
const db = require("../db");

// Toggle Favorite (Add if not exists, Remove if exists)
router.post("/toggle", (req, res) => {
  const { user_id, place_id } = req.body;

  // Check if it already exists
  const checkQuery = "SELECT * FROM favorites WHERE user_id = ? AND place_id = ?";
  
  db.query(checkQuery, [user_id, place_id], (err, results) => {
    if (err) return res.status(500).send("Database error");

    if (results.length > 0) {
      // Exists -> Delete it
      const deleteQuery = "DELETE FROM favorites WHERE user_id = ? AND place_id = ?";
      db.query(deleteQuery, [user_id, place_id], (err) => {
        if (err) return res.status(500).send("Database error");
        res.json({ message: "Removed from favorites", isFavorite: false });
      });
    } else {
      // Doesn't exist -> Add it
      const insertQuery = "INSERT INTO favorites (user_id, place_id) VALUES (?, ?)";
      db.query(insertQuery, [user_id, place_id], (err) => {
        if (err) return res.status(500).send("Database error");
        res.json({ message: "Added to favorites", isFavorite: true });
      });
    }
  });
});

// Get all favorite places for a user
router.get("/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const query = `
    SELECT p.*, c.category_name, ci.name as city_name 
    FROM favorites f
    JOIN places p ON f.place_id = p.place_id
    JOIN categories c ON p.category_id = c.category_id
    JOIN cities ci ON p.city_id = ci.city_id
    WHERE f.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.json(results);
  });
});

module.exports = router;