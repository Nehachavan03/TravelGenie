

# ✈️ Travel Itinerary Planner

A full-stack travel discovery and planning platform designed to help users explore destinations, save favorites, and create detailed day-by-day itineraries with the help of an AI-driven chatbot.

---

## 📖 Project Overview
The **Travel Itinerary Planner** is built to bridge the gap between "searching for things to do" and "actually planning a trip." Users can browse a global database of cities and attractions, manage a personal favorites list, and build structured, budget-conscious travel plans.

### **Core Features**
*   **Secure Authentication:** JWT-based login and registration with hashed passwords.
*   **Destination Discovery:** Browse countries, cities, and attractions categorized by type (Historical, Beach, Nature, etc.).
*   **Itinerary Builder:** Create day-by-day travel schedules for any city.
*   **AI Chatbot Assistant:** Instantly generate suggested 1-to-3 day itineraries using the built-in chatbot.
*   **Favorites System:** Save specific places to a personal wishlist for future planning.
*   **Reviews & Ratings:** View community feedback for every landmark and attraction.

---

## 🛠️ Tech Stack

### **Backend**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MySQL (Relational)
*   **Authentication:** JSON Web Tokens (JWT) & BcryptJS (Hashing)
*   **Configuration:** Dotenv

### **Frontend (Recommended)**
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **API Client:** Axios

---

## 🚀 Getting Started

### **1. Prerequisites**
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16.0 or higher)
*   [MySQL Server](https://www.mysql.com/downloads/) (v8.0 or higher)

### **2. Installation**
Navigate to the `backend` directory and install the necessary libraries:
```bash
cd backend
npm install
```

### **3. Database Setup**
1. Open your MySQL client (Workbench or CLI).
2. Execute the `database/schema.sql` file to create the tables.
3. Execute the `database/seed_data.sql` file to populate the cities, places, and the **Demo User**.

### **4. Environment Configuration**
Create a `.env` file in the `backend/` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=Your_MySQL_Password
DB_NAME=travel_planner
JWT_SECRET=your_super_secret_key
PORT=5000
```

### **5. Run the Server**
```bash
npm start
```
The server will be live at `http://localhost:5000`.

---

## 🧪 API Testing & Documentation

### **Automated Tests**
If you use the **REST Client** extension in VS Code, open `backend/api_tests.http` and click "Send Request" on any endpoint.

### **Demo User Credentials**
Use these credentials in Postman or your Frontend to test personalization features immediately:
*   **Email:** `demo@example.com`
*   **Password:** `password123`
*   **User ID:** `9`

### **Key API Endpoints**
| Feature | Endpoint | Method |
| :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` |
| **Auth** | `/auth/login` | `POST` |
| **Itinerary** | `/itinerary/:user_id` | `GET` |
| **Itinerary** | `/itinerary/details/:itinerary_id` | `GET` |
| **Chatbot** | `/chatbot` | `POST` |
| **Favorites** | `/favorites/toggle` | `POST` |
| **Places** | `/places/:city_id` | `GET` |
