# ✈️ Travel Itinerary Planner (VoyageAI)

A full-stack, AI-powered travel planning platform that helps users **discover destinations, save favorites, and generate smart itineraries instantly**.

---

## 🌐 Live Demo

🚀 **Try it here:** https://travel-genie-nine.vercel.app/

---

## 🧠 Project Overview

Planning a trip usually means juggling multiple tabs, apps, and notes.
**VoyageAI simplifies everything into one intelligent platform.**

It combines:

* 🌍 Destination discovery
* ❤️ Personalized favorites
* 🤖 AI-powered itinerary generation

➡️ So users can go from *“Where should I go?”* to *“Here’s my complete plan”* in seconds.

---

## ✨ Key Features

### 🔐 Authentication

* Secure login & registration
* JWT-based authentication
* Password hashing using Bcrypt

### 🌍 Explore Destinations

* Browse countries, cities, and attractions
* Categorized places (Historical, Nature, Beaches, etc.)
* Real-world travel data

### 🗓️ Itinerary Builder

* Create structured day-by-day plans
* Organize trips efficiently
* Track activities with time slots

### 🤖 AI Travel Assistant

* Generate 1–3 day travel plans instantly
* Smart recommendations based on interests
* Conversational chatbot interface

### ❤️ Favorites System

* Save places for future trips
* Personalized travel wishlist

### ⭐ Reviews & Ratings

* View user feedback
* Make informed travel decisions

---

## 🛠️ Tech Stack

### 🔙 Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* BcryptJS
* Dotenv

### 🎨 Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Axios

---

## ⚙️ Installation & Setup

### 1. Prerequisites

* Node.js (v16+)
* MySQL (v8+)

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Database Setup

* Run `database/schema.sql`
* Run `database/seed_data.sql`

---

### 4. Environment Variables

Create a `.env` file inside `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=travel_planner
JWT_SECRET=your_secret_key
PORT=4000
```

---

### 5. Run Server

```bash
npm start
```

Backend runs at:
👉 http://localhost:4000

---

## 🧪 API Endpoints

| Feature           | Endpoint                           | Method |
| ----------------- | ---------------------------------- | ------ |
| Register          | `/auth/register`                   | POST   |
| Login             | `/auth/login`                      | POST   |
| Chatbot           | `/chatbot`                         | POST   |
| Itinerary         | `/itinerary/:user_id`              | GET    |
| Itinerary Details | `/itinerary/details/:itinerary_id` | GET    |
| Favorites         | `/favorites/toggle`                | POST   |
| Places            | `/places/:city_id`                 | GET    |

---

## 👤 Demo Credentials

Use this account to test quickly:

* Email: `demo@example.com`
* Password: `password123`

---

## 🚀 What Makes This Project Stand Out

* AI-powered travel planning (real-world use case)
* Full-stack architecture (React + Express + MySQL)
* Clean UI with modern SaaS design
* Scalable backend structure
* Hackathon-ready product

---

## 🔮 Future Improvements

* 🌐 Multi-day advanced planning
* 💰 Budget optimization AI
* 📍 Map integration (Google Maps)
* 🧠 Personalized recommendations using ML
* ⚡ Real-time itinerary updates

---

## 👩‍💻 Author

**Neha Chavan**
B.Tech CSE-2nd Year

🔗 LinkedIn: https://www.linkedin.com/in/neha-chavan-280178367

---

## ⭐ Show Your Support

If you like this project:

* ⭐ Star the repo
* 🔁 Share on LinkedIn
* 💬 Give feedback

---
