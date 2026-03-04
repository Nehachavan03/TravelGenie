USE travel_planner;

-- Get all countries
SELECT * FROM countries;

-- Get cities in a country
SELECT city_id, name, pincode
FROM cities
WHERE country_code = 'IN';

-- Get all cities with country name
SELECT c.city_id, c.name AS city, co.country_name
FROM cities c
JOIN countries co
ON c.country_code = co.country_code;

-- Get places in a city
SELECT p.place_id, p.name, p.description, p.address, cat.category_name
FROM places p
JOIN categories cat
ON p.category_id = cat.category_id
WHERE p.city_id = 1;

-- Get full place details
SELECT p.place_id, p.name, p.description, p.address,
c.name AS city,
cat.category_name
FROM places p
JOIN cities c ON p.city_id = c.city_id
JOIN categories cat ON p.category_id = cat.category_id
WHERE p.place_id = 1;

-- Get reviews of a place
SELECT u.name AS user_name,
r.rating,
r.comment,
r.review_date
FROM reviews r
JOIN users u
ON r.user_id = u.user_id
WHERE r.place_id = 1;

-- Insert new itinerary
INSERT INTO itineraries (user_id,start_date,end_date,budget,city_id)
VALUES (1,'2025-12-01','2025-12-05',10000,3);

-- Add place to itinerary
INSERT INTO itinerary_details (itinerary_id,day_no,place_id)
VALUES (1,1,5);

-- Get itineraries of a user
SELECT itinerary_id, start_date, end_date, budget, city_id
FROM itineraries
WHERE user_id = 1;

-- Get full itinerary plan
SELECT i.itinerary_id,
id.day_no,
p.name AS place,
p.address
FROM itineraries i
JOIN itinerary_details id
ON i.itinerary_id = id.itinerary_id
JOIN places p
ON id.place_id = p.place_id
WHERE i.itinerary_id = 1
ORDER BY id.day_no;

-- Get top rated places
SELECT p.name,
AVG(r.rating) AS average_rating
FROM places p
JOIN reviews r
ON p.place_id = r.place_id
GROUP BY p.place_id
ORDER BY average_rating DESC;

-- Count places per city
SELECT c.name AS city,
COUNT(p.place_id) AS total_places
FROM cities c
LEFT JOIN places p
ON c.city_id = p.city_id
GROUP BY c.city_id;