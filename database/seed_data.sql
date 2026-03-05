USE travel_planner;
INSERT INTO countries (country_code, country_name) VALUES
('IN','India'),
('US','United States'),
('FR','France'),
('JP','Japan'),
('IT','Italy');

INSERT INTO categories (category_name) VALUES
('Historical'),
('Museum'),
('Park'),
('Religious'),
('Monument'),
('Beach'),
('Shopping'),
('Nature');

INSERT INTO cities (name,pincode,country_code) VALUES
('Mumbai','400001','IN'),
('Pune','411001','IN'),
('Delhi','110001','IN'),
('Bangalore','560001','IN'),
('Jaipur','302001','IN'),

('New York','10001','US'),
('Los Angeles','90001','US'),
('Chicago','60601','US'),
('San Francisco','94101','US'),
('Miami','33101','US'),

('Paris','75000','FR'),
('Lyon','69000','FR'),
('Nice','06000','FR'),
('Marseille','13000','FR'),
('Toulouse','31000','FR'),

('Tokyo','100000','JP'),
('Osaka','530000','JP'),
('Kyoto','600000','JP'),
('Hiroshima','730000','JP'),
('Sapporo','060000','JP'),

('Rome','00100','IT'),
('Milan','20100','IT'),
('Venice','30100','IT'),
('Florence','50100','IT'),
('Naples','80100','IT');

INSERT INTO users (name,email,password) VALUES
('Neha Chavan','neha@email.com','123'),
('Rahul Sharma','rahul@email.com','123'),
('Priya Patel','priya@email.com','123'),
('John Smith','john@email.com','123'),
('Emily Clark','emily@email.com','123'),
('Amit Verma','amit@email.com','123'),
('Sara Khan','sara@email.com','123'),
('David Lee','david@email.com','123');


INSERT INTO places (city_id,name,description,address,category_id) VALUES

-- Mumbai (1)
(1,'Gateway of India','Historic monument','Mumbai',5),
(1,'Marine Drive','Seaside promenade','Mumbai',6),
(1,'Elephanta Caves','Ancient cave temples','Mumbai',1),
(1,'Juhu Beach','Popular beach','Mumbai',3),
(1,'Siddhivinayak Temple','Famous temple','Mumbai',4),

-- Pune (2)
(2,'Shaniwar Wada','Historic fort','Pune',1),
(2,'Aga Khan Palace','Freedom monument','Pune',1),
(2,'Sinhagad Fort','Hill fort','Pune',1),
(2,'Dagdusheth Temple','Religious temple','Pune',4),
(2,'Pashan Lake','Nature spot','Pune',3),

-- Delhi (3)
(3,'India Gate','War memorial','Delhi',5),
(3,'Red Fort','Historic fort','Delhi',1),
(3,'Qutub Minar','UNESCO monument','Delhi',5),
(3,'Lotus Temple','Religious architecture','Delhi',4),
(3,'Akshardham Temple','Cultural complex','Delhi',4),

-- Bangalore (4)
(4,'Lalbagh Garden','Botanical garden','Bangalore',3),
(4,'Bangalore Palace','Historic palace','Bangalore',1),
(4,'Cubbon Park','City park','Bangalore',3),
(4,'ISKCON Temple','Religious temple','Bangalore',4),
(4,'Bannerghatta Park','Wildlife park','Bangalore',3),

-- Jaipur (5)
(5,'Hawa Mahal','Historic palace','Jaipur',1),
(5,'Amber Fort','Fort complex','Jaipur',1),
(5,'City Palace','Royal residence','Jaipur',1),
(5,'Jantar Mantar','Astronomical site','Jaipur',5),
(5,'Nahargarh Fort','Hilltop fort','Jaipur',1),

-- New York (6)
(6,'Statue of Liberty','Iconic monument','New York',5),
(6,'Central Park','Urban park','New York',3),
(6,'Times Square','Tourist hotspot','New York',7),
(6,'Brooklyn Bridge','Historic bridge','New York',5),
(6,'Empire State Building','Observation tower','New York',5),

-- Los Angeles (7)
(7,'Hollywood Sign','Famous landmark','Los Angeles',5),
(7,'Santa Monica Pier','Oceanfront attraction','Los Angeles',3),
(7,'Griffith Observatory','Science museum','Los Angeles',2),
(7,'Venice Beach','Popular beach','Los Angeles',3),
(7,'Universal Studios','Theme park','Los Angeles',3),

-- Chicago (8)
(8,'Millennium Park','Urban park','Chicago',3),
(8,'Navy Pier','Lakefront attraction','Chicago',3),
(8,'Art Institute','Art museum','Chicago',2),
(8,'Willis Tower','Observation tower','Chicago',5),
(8,'Lincoln Park Zoo','City zoo','Chicago',3),

-- San Francisco (9)
(9,'Golden Gate Bridge','Famous bridge','San Francisco',5),
(9,'Alcatraz Island','Historic prison island','San Francisco',1),
(9,'Fishermans Wharf','Tourist area','San Francisco',7),
(9,'Golden Gate Park','Urban park','San Francisco',3),
(9,'Lombard Street','Crooked street','San Francisco',5),

-- Miami (10)
(10,'South Beach','Popular beach','Miami',3),
(10,'Ocean Drive','Historic street','Miami',1),
(10,'Vizcaya Museum','Historic estate','Miami',2),
(10,'Bayfront Park','Waterfront park','Miami',3),
(10,'Little Havana','Cultural district','Miami',7),

-- Paris (11)
(11,'Eiffel Tower','Iconic tower','Paris',5),
(11,'Louvre Museum','World famous museum','Paris',2),
(11,'Notre Dame','Historic cathedral','Paris',4),
(11,'Montmartre','Art district','Paris',7),
(11,'Luxembourg Gardens','City garden','Paris',3),

-- Lyon (12)
(12,'Basilica of Fourviere','Historic basilica','Lyon',4),
(12,'Parc de la Tete','City park','Lyon',3),
(12,'Lyon Cathedral','Historic cathedral','Lyon',4),
(12,'Old Lyon','Historic district','Lyon',1),
(12,'Museum of Fine Arts','Art museum','Lyon',2),

-- Nice (13)
(13,'Promenade des Anglais','Seaside walkway','Nice',3),
(13,'Castle Hill','Scenic hilltop','Nice',3),
(13,'Nice Cathedral','Historic cathedral','Nice',4),
(13,'Marc Chagall Museum','Art museum','Nice',2),
(13,'Old Town Nice','Historic district','Nice',1),

-- Marseille (14)
(14,'Old Port','Historic harbor','Marseille',1),
(14,'Notre Dame de la Garde','Hilltop basilica','Marseille',4),
(14,'Calanques Park','Nature park','Marseille',3),
(14,'Marseille Cathedral','Historic church','Marseille',4),
(14,'Museum of Europe','Museum','Marseille',2),

-- Toulouse (15)
(15,'Capitole Square','Historic square','Toulouse',1),
(15,'Basilica Saint Sernin','Historic basilica','Toulouse',4),
(15,'Canal du Midi','Historic canal','Toulouse',1),
(15,'Space City Museum','Science museum','Toulouse',2),
(15,'Japanese Garden','City garden','Toulouse',3),

-- Tokyo (16)
(16,'Tokyo Tower','Observation tower','Tokyo',5),
(16,'Sensoji Temple','Historic temple','Tokyo',4),
(16,'Shinjuku Gyoen','Urban garden','Tokyo',3),
(16,'Meiji Shrine','Religious shrine','Tokyo',4),
(16,'Akihabara','Electronics district','Tokyo',7),

-- Osaka (17)
(17,'Osaka Castle','Historic castle','Osaka',1),
(17,'Dotonbori','Entertainment district','Osaka',7),
(17,'Universal Studios','Theme park','Osaka',3),
(17,'Sumiyoshi Shrine','Historic shrine','Osaka',4),
(17,'Tennoji Park','City park','Osaka',3),

-- Kyoto (18)
(18,'Fushimi Inari Shrine','Historic shrine','Kyoto',4),
(18,'Kinkakuji Temple','Golden temple','Kyoto',4),
(18,'Arashiyama Bamboo','Nature forest','Kyoto',3),
(18,'Nijo Castle','Historic castle','Kyoto',1),
(18,'Gion District','Historic district','Kyoto',7),

-- Hiroshima (19)
(19,'Peace Memorial Park','Historic park','Hiroshima',3),
(19,'Atomic Dome','Historic monument','Hiroshima',5),
(19,'Hiroshima Castle','Historic castle','Hiroshima',1),
(19,'Shukkeien Garden','Japanese garden','Hiroshima',3),
(19,'Mazda Museum','Automobile museum','Hiroshima',2),

-- Sapporo (20)
(20,'Odori Park','City park','Sapporo',3),
(20,'Sapporo Tower','Observation tower','Sapporo',5),
(20,'Moerenuma Park','Modern park','Sapporo',3),
(20,'Hokkaido Shrine','Religious shrine','Sapporo',4),
(20,'Beer Museum','Historic museum','Sapporo',2),

-- Rome (21)
(21,'Colosseum','Ancient amphitheatre','Rome',1),
(21,'Roman Forum','Historic ruins','Rome',1),
(21,'Trevi Fountain','Famous fountain','Rome',5),
(21,'Pantheon','Historic temple','Rome',4),
(21,'Vatican Museums','Art museum','Rome',2),

-- Milan (22)
(22,'Duomo Cathedral','Historic cathedral','Milan',4),
(22,'Sforza Castle','Historic castle','Milan',1),
(22,'Galleria Vittorio','Shopping gallery','Milan',7),
(22,'Brera Art Gallery','Art museum','Milan',2),
(22,'Sempione Park','City park','Milan',3),

-- Venice (23)
(23,'St Marks Basilica','Historic church','Venice',4),
(23,'Grand Canal','Famous canal','Venice',5),
(23,'Rialto Bridge','Historic bridge','Venice',5),
(23,'Doge Palace','Historic palace','Venice',1),
(23,'Murano Island','Glassmaking island','Venice',7),

-- Florence (24)
(24,'Florence Cathedral','Historic cathedral','Florence',4),
(24,'Uffizi Gallery','Art museum','Florence',2),
(24,'Ponte Vecchio','Historic bridge','Florence',5),
(24,'Boboli Gardens','City garden','Florence',3),
(24,'Pitti Palace','Historic palace','Florence',1),

-- Naples (25)
(25,'Mount Vesuvius','Volcano site','Naples',3),
(25,'Pompeii Ruins','Historic ruins','Naples',1),
(25,'Naples Cathedral','Historic cathedral','Naples',4),
(25,'Royal Palace','Historic palace','Naples',1),
(25,'National Archaeological','History museum','Naples',2);

INSERT INTO itineraries (user_id,start_date,end_date,budget,city_id) VALUES
(1,'2025-06-10','2025-06-12',8000,1),
(2,'2025-07-01','2025-07-04',12000,6),
(3,'2025-07-15','2025-07-18',10000,11),
(4,'2025-08-02','2025-08-05',15000,16),
(5,'2025-08-20','2025-08-23',9000,21),
(6,'2025-09-05','2025-09-07',7000,2),
(7,'2025-09-18','2025-09-20',6000,7),
(8,'2025-10-01','2025-10-03',8500,12);

INSERT INTO itinerary_details (itinerary_id,day_no,place_id) VALUES
(1,1,1),
(1,2,2),
(1,3,3),

(2,1,26),
(2,2,27),
(2,3,28),

(3,1,51),
(3,2,52),

(4,1,76),
(4,2,77),
(4,3,78),

(5,1,101),
(5,2,102),

(6,1,6),
(6,2,7),

(7,1,31),
(7,2,32),

(8,1,56),
(8,2,57);

INSERT INTO reviews (rating,comment,review_date,user_id,place_id) VALUES
(5,'Amazing place to visit','2025-01-10',1,1),
(4,'Beautiful location','2025-01-12',2,2),
(5,'Must visit attraction','2025-01-14',3,3),
(4,'Great experience','2025-01-16',4,26),
(5,'Loved the architecture','2025-01-18',5,27),
(3,'Very crowded but good','2025-01-20',6,31),
(4,'Nice tourist spot','2025-01-22',7,52),
(5,'Fantastic view','2025-01-24',8,76),
(4,'Enjoyed the visit','2025-01-26',1,101),
(5,'Highly recommended','2025-01-28',2,102);