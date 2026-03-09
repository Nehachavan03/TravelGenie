
USE travel_planner;

-- ======================================
-- 1. Get all countries
-- ======================================
SELECT * 
FROM countries;


-- ======================================
-- 2. Get cities in India
-- ======================================
SELECT city_id, name, pincode
FROM cities
WHERE country_code = 'IN';


-- ======================================
-- 3. Get all cities with country name
-- ======================================
SELECT c.city_id,
       c.name AS city,
       co.country_name
FROM cities c
JOIN countries co
ON c.country_code = co.country_code;


-- ======================================
-- 4. Get places in a specific city
-- ======================================
SELECT p.place_id,
       p.name,
       p.description,
       p.address,
       cat.category_name
FROM places p
JOIN categories cat
ON p.category_id = cat.category_id
WHERE p.city_id = 1;


-- ======================================
-- 5. Get full place details
-- ======================================
SELECT p.place_id,
       p.name,
       p.description,
       p.address,
       c.name AS city,
       cat.category_name
FROM places p
JOIN cities c 
ON p.city_id = c.city_id
JOIN categories cat 
ON p.category_id = cat.category_id
WHERE p.place_id = 1;


-- ======================================
-- 6. Get reviews of a place
-- (LEFT JOIN prevents missing users issue)
-- ======================================
SELECT u.name AS user_name,
       r.rating,
       r.comment,
       r.review_date
FROM reviews r
LEFT JOIN users u
ON r.user_id = u.user_id
WHERE r.place_id = 1;


-- ======================================
-- 7. Insert new itinerary
-- ======================================
INSERT INTO itineraries (user_id, start_date, end_date, budget, city_id)
VALUES (1, '2025-12-01', '2025-12-05', 10000, 3);


-- ======================================
-- 8. Add place to itinerary
-- ======================================
INSERT INTO itinerary_details (itinerary_id, day_no, place_id)
VALUES (1, 1, 5);


-- ======================================
-- 9. Get itineraries of a user
-- ======================================
SELECT itinerary_id,
       start_date,
       end_date,
       budget,
       city_id
FROM itineraries
WHERE user_id = 1;


-- ======================================
-- 10. Get full itinerary plan
-- ======================================
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


-- ======================================
-- 11. Top rated places
-- ======================================
SELECT p.place_id,
       p.name,
       AVG(r.rating) AS average_rating
FROM places p
JOIN reviews r
ON p.place_id = r.place_id
GROUP BY p.place_id, p.name
ORDER BY average_rating DESC
LIMIT 5;


-- ======================================
-- 12. Count places per city
-- ======================================
SELECT c.name AS city,
       COUNT(p.place_id) AS total_places
FROM cities c
LEFT JOIN places p
ON c.city_id = p.city_id
GROUP BY c.city_id, c.name;


-- ======================================
-- 13. Update user names
-- ======================================
UPDATE users
SET name = 'Lakshita Ingale'
WHERE user_id = 2;

UPDATE users
SET name = 'Anika Prasad'
WHERE user_id = 3;

UPDATE users
SET name = 'Parth Samale'
WHERE user_id = 4;


-- ======================================
-- 14. Update user emails
-- ======================================
UPDATE users
SET email = 'lakshita@example.com'
WHERE user_id = 2;

UPDATE users
SET email = 'anika@example.com'
WHERE user_id = 3;

UPDATE users
SET email = 'parth@example.com'
WHERE user_id = 4;


-- ======================================
-- 15. Show all users
-- ======================================
SELECT * FROM users;


-- ======================================
-- 16. Find places by city and category
-- (Useful for chatbot)
-- ======================================
SELECT p.name,
       p.description,
       p.address,
       cat.category_name
FROM places p
JOIN categories cat
ON p.category_id = cat.category_id
JOIN cities c
ON p.city_id = c.city_id
WHERE c.name = 'Paris'
AND cat.category_name = 'Museum';


-- ======================================
-- 17. Get places for a city (chatbot use)
-- ======================================
SELECT p.name,
       p.description,
       p.address
FROM places p
JOIN cities c
ON p.city_id = c.city_id
WHERE c.name = 'Tokyo'
LIMIT 5;


USE travel_planner;

UPDATE users
SET password = '$2a$10$7bE7VYh5kE3gG0Xg0pX9W.6Q3n5E5V1h2k0Zp4G5v8cF1YzQ7uK6e';

SELECT user_id, name, email, password FROM users;

UPDATE users
SET password = '$2a$10$Rz0E2C7f3l2A1Z9q3n9lqOZ8w3oT6H1bS4QdF7X9T2wKp7g1m1WcK'
WHERE email = 'neha@email.com';

UPDATE users
SET password = '$2a$10$Rz0E2C7f3l2A1Z9q3n9lqOZ8w3oT6H1bS4QdF7X9T2wKp7g1m1WcK'
WHERE email = 'rahul@email.com';

USE travel_planner;

/*
DELETE FROM users
WHERE email IN (
'neha@email.com',
'rahul@email.com',
'priya@email.com',
'john@email.com',
'emily@email.com',
'amit@email.com',
'sara@email.com',
'david@email.com'
);
*/