const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  ssl: {
    rejectUnauthorized: true
  }
});

async function seedGuest() {
  const email = "guest@example.com";
  const password = "guestpassword123";
  const name = "Guest User";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        console.log("Guest user already exists.");
        process.exit(0);
      }

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) throw err;
          console.log("Guest user created successfully!");
          process.exit(0);
        }
      );
    });
  } catch (error) {
    console.error("Error seeding guest user:", error);
    process.exit(1);
  }
}

seedGuest();