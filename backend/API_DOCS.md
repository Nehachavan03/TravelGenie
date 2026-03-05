# Travel Planner Backend APIs

Base URL
http://localhost:5000

---

## 1. Get all countries

**GET /countries**

Returns list of all countries.

Example
http://localhost:5000/countries

---

## 2. Get cities by country

**GET /cities/:country_code**

Returns cities belonging to a country.

Example
http://localhost:5000/cities/IN

---

## 3. Get places by city

**GET /places/:city_id**

Returns tourist places for a city.

Example
http://localhost:5000/places/1

---

## 4. Get reviews for a place

**GET /reviews/:place_id**

Returns reviews and ratings for a place.

Example
http://localhost:5000/reviews/1

---

# Itinerary APIs

## 5. Create itinerary

**POST /itinerary/create**

Creates a new travel itinerary.

Example
http://localhost:5000/itinerary/create

Body (JSON)

{
"user_id": 1,
"start_date": "2025-12-10",
"end_date": "2025-12-12",
"budget": 8000,
"city_id": 3
}

Response

{
"message": "Itinerary created",
"itinerary_id": 9
}

---

## 6. Add place to itinerary

**POST /itinerary/add-place**

Adds a place to a specific day in an itinerary.

Example
http://localhost:5000/itinerary/add-place

Body (JSON)

{
"itinerary_id": 9,
"day_no": 1,
"place_id": 11
}

Response

{
"message": "Place added to itinerary"
}

---

## 7. Get itineraries of a user

**GET /itinerary/:user_id**

Returns all itineraries belonging to a user.

Example
http://localhost:5000/itinerary/1

---

## 8. Get itinerary details

**GET /itinerary/details/:itinerary_id**

Returns all places planned for an itinerary with day numbers.

Example
http://localhost:5000/itinerary/details/9

Response Example

[
{
"day_no": 1,
"place": "India Gate",
"address": "Delhi"
},
{
"day_no": 2,
"place": "Red Fort",
"address": "Delhi"
}
]

---

# Running the Backend

1. Navigate to backend folder

cd backend

2. Install dependencies

npm install

3. Start server

node server.js

Server runs on

http://localhost:5000
