require('dotenv').config();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

const itineraryId = 6; // Paris trip from subagent logs

const headerQuery = 'SELECT i.itinerary_id AS id, c.name AS city_name, c.city_id, i.start_date, i.end_date, i.budget FROM itineraries i JOIN cities c ON i.city_id = c.city_id WHERE i.itinerary_id = ?';
db.query(headerQuery, [itineraryId], (err, headerResults) => {
  if (err) {
    console.error('Header Query Error:', err);
    db.end();
    return;
  }
  console.log('Header Results:', headerResults);

  const itemsQuery = 'SELECT id.detail_id AS id, id.day_no AS day_number, id.time_slot, p.name AS place_name, p.description AS place_description, c.category_name FROM itinerary_details id JOIN places p ON id.place_id = p.place_id JOIN categories c ON p.category_id = c.category_id WHERE id.itinerary_id = ? ORDER BY id.day_no';
  db.query(itemsQuery, [itineraryId], (err, itemsResults) => {
    if (err) {
      console.error('Items Query Error:', err);
    } else {
      console.log('Items Results:', itemsResults);
    }
    db.end();
  });
});
