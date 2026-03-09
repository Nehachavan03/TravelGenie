const express = require('express');
const router = express.Router();
const db = require('../db');

// Create itinerary
router.post('/create', (req, res) => {
  const { user_id, start_date, end_date, budget, city_id } = req.body;
  
  // Logic to determine actual numeric city_id
  const isNumeric = !isNaN(parseFloat(city_id)) && isFinite(city_id);

  const insertItinerary = (finalCityId) => {
    const query = 'INSERT INTO itineraries (user_id, start_date, end_date, budget, city_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user_id, start_date, end_date, budget, finalCityId], (err, result) => {
      if (err) {
        console.error('Insert Error:', err);
        return res.status(500).send('Database error');
      }
      res.json({ message: 'Itinerary created', itinerary_id: result.insertId });
    });
  };

  if (isNumeric) {
    insertItinerary(city_id);
  } else {
    db.query('SELECT city_id FROM cities WHERE name LIKE ? LIMIT 1', ['%' + city_id + '%'], (err, results) => {
      if (err) return res.status(500).send('Database error');
      insertItinerary(results.length > 0 ? results[0].city_id : 1);
    });
  }
});

// Add place to itinerary
router.post('/add-place', (req, res) => {
  const { itinerary_id, day_no, place_id } = req.body;
  db.query('INSERT INTO itinerary_details (itinerary_id, day_no, place_id) VALUES (?, ?, ?)', [itinerary_id, day_no, place_id], (err, result) => {
    if (err) return res.status(500).send('Database error');
    res.json({ message: 'Place added to itinerary' });
  });
});

// Get itinerary details
router.get('/details/:itinerary_id', (req, res) => {
  const itineraryId = req.params.itinerary_id;
  const headerQuery = 'SELECT i.itinerary_id AS id, c.name AS city_name, c.city_id, i.start_date, i.end_date, i.budget FROM itineraries i JOIN cities c ON i.city_id = c.city_id WHERE i.itinerary_id = ?';
  db.query(headerQuery, [itineraryId], (err, headerResults) => {
    if (err) return res.status(500).send('Database error');
    if (headerResults.length === 0) return res.status(404).send('Not found');
    const trip = headerResults[0];
    const itemsQuery = 'SELECT id.day_no AS day_number, p.name AS place_name, p.description AS place_description, c.category_name FROM itinerary_details id JOIN places p ON id.place_id = p.place_id JOIN categories c ON p.category_id = c.category_id WHERE id.itinerary_id = ? ORDER BY id.day_no';
    db.query(itemsQuery, [itineraryId], (err, itemsResults) => {
      if (err) return res.status(500).send('Database error');
      trip.items = itemsResults.map((item, index) => ({ ...item, time_slot: (10 + (index % 4)) + ':00 AM' }));
      res.json(trip);
    });
  });
});

// Get itineraries of a user
router.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  db.query('SELECT i.itinerary_id, i.start_date, i.end_date, i.budget, c.name AS city FROM itineraries i JOIN cities c ON i.city_id = c.city_id WHERE i.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

// Delete itinerary
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM itineraries WHERE itinerary_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send('Database error');
    res.json({ message: 'Itinerary deleted' });
  });
});

module.exports = router;
