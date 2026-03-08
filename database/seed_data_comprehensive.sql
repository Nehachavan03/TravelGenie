USE travel_planner;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE itinerary_details;
TRUNCATE TABLE favorites;
TRUNCATE TABLE itineraries;
TRUNCATE TABLE reviews;
TRUNCATE TABLE places;
TRUNCATE TABLE cities;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
TRUNCATE TABLE countries;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Countries
INSERT INTO countries (country_code, country_name) VALUES
('IN','India'), ('US','United States'), ('FR','France'), ('JP','Japan'), ('IT','Italy');

-- 2. Categories
INSERT INTO categories (category_name) VALUES
('Historical'), ('Museum'), ('Park'), ('Religious'), ('Monument'), ('Beach'), ('Shopping'), ('Nature'), ('Dining'), ('Experience');

-- 3. Cities (5 per country)
INSERT INTO cities (city_id, name, pincode, country_code) VALUES
-- India
(1, 'Mumbai', '400001', 'IN'),
(2, 'Delhi', '110001', 'IN'),
(3, 'Jaipur', '302001', 'IN'),
(4, 'Goa', '403001', 'IN'),
(5, 'Agra', '282001', 'IN'),
-- US
(6, 'New York', '10001', 'US'),
(7, 'Los Angeles', '90001', 'US'),
(8, 'Chicago', '60601', 'US'),
(9, 'Miami', '33101', 'US'),
(10, 'Las Vegas', '89101', 'US'),
-- France
(11, 'Paris', '75000', 'FR'),
(12, 'Nice', '06000', 'FR'),
(13, 'Lyon', '69000', 'FR'),
(14, 'Marseille', '13000', 'FR'),
(15, 'Bordeaux', '33000', 'FR'),
-- Japan
(16, 'Tokyo', '100000', 'JP'),
(17, 'Kyoto', '600-0000', 'JP'),
(18, 'Osaka', '530-0000', 'JP'),
(19, 'Sapporo', '060-0000', 'JP'),
(20, 'Hiroshima', '730-0000', 'JP'),
-- Italy
(21, 'Rome', '00100', 'IT'),
(22, 'Venice', '30100', 'IT'),
(23, 'Florence', '50100', 'IT'),
(24, 'Milan', '20100', 'IT'),
(25, 'Naples', '80100', 'IT');

-- 4. Users (Demo Accounts)
INSERT INTO users (user_id, name, email, password) VALUES
(1, 'Neha Chavan', 'neha@email.com', '$2a$10$7bE7VYh5kE3gG0Xg0pX9W.6Q3n5E5V1h2k0Zp4G5v8cF1YzQ7uK6e'),
(2, 'Test User', 'test@example.com', '$2a$10$7bE7VYh5kE3gG0Xg0pX9W.6Q3n5E5V1h2k0Zp4G5v8cF1YzQ7uK6e');

-- 5. Places (At least 3 per city so Chatbot itinerary generation works)
INSERT INTO places (place_id, city_id, name, description, address, category_id) VALUES
-- Mumbai
(1, 1, 'Gateway of India', 'Historic monument', 'Mumbai', 5),
(2, 1, 'Marine Drive', 'Seaside promenade', 'Mumbai', 10),
(3, 1, 'Juhu Beach', 'Popular beach', 'Mumbai', 6),
-- Delhi
(4, 2, 'Red Fort', 'Historic fort', 'Delhi', 1),
(5, 2, 'India Gate', 'War memorial', 'Delhi', 5),
(6, 2, 'Qutub Minar', 'Tallest brick minaret', 'Delhi', 1),
-- Jaipur
(7, 3, 'Hawa Mahal', 'Palace of Winds', 'Jaipur', 1),
(8, 3, 'Amber Palace', 'Hilltop fort', 'Jaipur', 1),
(9, 3, 'City Palace', 'Royal residence', 'Jaipur', 1),
-- Goa
(10, 4, 'Baga Beach', 'Bustling beach', 'Goa', 6),
(11, 4, 'Fort Aguada', 'Portuguese fort', 'Goa', 1),
(12, 4, 'Dudhsagar Falls', 'Waterfalls', 'Goa', 8),
-- Agra
(13, 5, 'Taj Mahal', 'Ivory-white marble mausoleum', 'Agra', 5),
(14, 5, 'Agra Fort', 'Historical fort', 'Agra', 1),
(15, 5, 'Fatehpur Sikri', 'Abandoned city', 'Agra', 1),

-- New York
(16, 6, 'Statue of Liberty', 'Iconic monument', 'NY', 5),
(17, 6, 'Central Park', 'Large urban park', 'NY', 3),
(18, 6, 'Times Square', 'Commercial intersection', 'NY', 10),
-- Los Angeles
(19, 7, 'Hollywood Walk of Fame', 'Famous sidewalk', 'LA', 10),
(20, 7, 'Griffith Observatory', 'Astronomy and views', 'LA', 2),
(21, 7, 'Santa Monica Pier', 'Amusement pier', 'LA', 6),
-- Chicago
(22, 8, 'Millennium Park', 'Public park', 'Chicago', 3),
(23, 8, 'Navy Pier', 'Lakefront destination', 'Chicago', 10),
(24, 8, 'Willis Tower', 'Skyscraper', 'Chicago', 5),
-- Miami
(25, 9, 'South Beach', 'Famous beach', 'Miami', 6),
(26, 9, 'Art Deco District', 'Historic architecture', 'Miami', 1),
(27, 9, 'Vizcaya Museum', 'Estate and gardens', 'Miami', 2),
-- Las Vegas
(28, 10, 'The Strip', 'Resort corridor', 'Las Vegas', 10),
(29, 10, 'Bellagio Fountains', 'Water show', 'Las Vegas', 10),
(30, 10, 'Fremont Street', 'Entertainment district', 'Las Vegas', 10),

-- Paris
(31, 11, 'Eiffel Tower', 'Iconic iron tower', 'Paris', 5),
(32, 11, 'Louvre Museum', 'World largest museum', 'Paris', 2),
(33, 11, 'Notre-Dame Cathedral', 'Gothic cathedral', 'Paris', 4),
-- Nice
(34, 12, 'Promenade des Anglais', 'Seaside walkway', 'Nice', 6),
(35, 12, 'Castle Hill', 'Park with views', 'Nice', 3),
(36, 12, 'Marc Chagall Museum', 'Art museum', 'Nice', 2),
-- Lyon
(37, 13, 'Basilica of Notre-Dame', 'Hilltop basilica', 'Lyon', 4),
(38, 13, 'Vieux Lyon', 'Old town', 'Lyon', 1),
(39, 13, 'Parc de la Tête dOr', 'Large urban park', 'Lyon', 3),
-- Marseille
(40, 14, 'Old Port', 'Historic harbor', 'Marseille', 10),
(41, 14, 'Notre-Dame de la Garde', 'Basilica', 'Marseille', 4),
(42, 14, 'Calanques National Park', 'Nature park', 'Marseille', 8),
-- Bordeaux
(43, 15, 'Place de la Bourse', 'Historic square', 'Bordeaux', 5),
(44, 15, 'La Cité du Vin', 'Wine museum', 'Bordeaux', 2),
(45, 15, 'Grand Théâtre', 'Opera house', 'Bordeaux', 1),

-- Tokyo
(46, 16, 'Tokyo Tower', 'Observation tower', 'Tokyo', 5),
(47, 16, 'Senso-ji', 'Ancient Buddhist temple', 'Tokyo', 4),
(48, 16, 'Shibuya Crossing', 'Busy intersection', 'Tokyo', 10),
-- Kyoto
(49, 17, 'Fushimi Inari Taisha', 'Shinto shrine', 'Kyoto', 4),
(50, 17, 'Kinkaku-ji', 'Golden Pavilion', 'Kyoto', 4),
(51, 17, 'Arashiyama Bamboo Grove', 'Bamboo forest', 'Kyoto', 8),
-- Osaka
(52, 18, 'Osaka Castle', 'Historic castle', 'Osaka', 1),
(53, 18, 'Dotonbori', 'Entertainment area', 'Osaka', 10),
(54, 18, 'Universal Studios Japan', 'Theme park', 'Osaka', 10),
-- Sapporo
(55, 19, 'Odori Park', 'Large central park', 'Sapporo', 3),
(56, 19, 'Sapporo TV Tower', 'Observation tower', 'Sapporo', 5),
(57, 19, 'Mount Moiwa', 'Mountain with ropeway', 'Sapporo', 8),
-- Hiroshima
(58, 20, 'Peace Memorial Park', 'Memorial park', 'Hiroshima', 3),
(59, 20, 'Itsukushima Shrine', 'Floating torii gate', 'Hiroshima', 4),
(60, 20, 'Hiroshima Castle', 'Reconstructed castle', 'Hiroshima', 1),

-- Rome
(61, 21, 'Colosseum', 'Ancient amphitheater', 'Rome', 1),
(62, 21, 'Pantheon', 'Former Roman temple', 'Rome', 1),
(63, 21, 'Trevi Fountain', 'Famous fountain', 'Rome', 5),
-- Venice
(64, 22, 'St. Marks Basilica', 'Cathedral', 'Venice', 4),
(65, 22, 'Grand Canal', 'Main waterway', 'Venice', 10),
(66, 22, 'Rialto Bridge', 'Oldest bridge', 'Venice', 5),
-- Florence
(67, 23, 'Florence Cathedral', 'Duomo', 'Florence', 4),
(68, 23, 'Uffizi Gallery', 'Art museum', 'Florence', 2),
(69, 23, 'Ponte Vecchio', 'Medieval bridge', 'Florence', 5),
-- Milan
(70, 24, 'Milan Cathedral', 'Gothic cathedral', 'Milan', 4),
(71, 24, 'Galleria Vittorio Emanuele II', 'Shopping mall', 'Milan', 7),
(72, 24, 'Sforza Castle', 'Historic castle', 'Milan', 1),
-- Naples
(73, 25, 'Mount Vesuvius', 'Active volcano', 'Naples', 8),
(74, 25, 'Pompeii', 'Ancient ruins', 'Naples', 1),
(75, 25, 'Naples National Archaeological Museum', 'Museum', 'Naples', 2);
