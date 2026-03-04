-- Create database
CREATE DATABASE travel_planner;
USE travel_planner;

-- Countries table
CREATE TABLE countries (
    country_code VARCHAR(10) PRIMARY KEY,
    country_name VARCHAR(100)
);

-- Cities table
CREATE TABLE cities (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    pincode VARCHAR(20),
    country_code VARCHAR(10),
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

-- Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100)
);

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

-- Places table
CREATE TABLE places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT,
    name VARCHAR(150),
    description TEXT,
    address VARCHAR(255),
    category_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Itineraries table
CREATE TABLE itineraries (
    itinerary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    start_date DATE,
    end_date DATE,
    budget FLOAT,
    city_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
);

-- Itinerary details table
CREATE TABLE itinerary_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id INT,
    day_no INT,
    place_id INT,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(itinerary_id),
    FOREIGN KEY (place_id) REFERENCES places(place_id)
);

-- Reviews table
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT,
    comment TEXT,
    review_date DATE,
    user_id INT,
    place_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (place_id) REFERENCES places(place_id)
);