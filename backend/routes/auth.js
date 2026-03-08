const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// REGISTER
// POST /auth/register
// ==========================
router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  // basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  try {

    // check if email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email already registered"
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
      `;

      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Error creating user"
          });
        }

        const user_id = result.insertId;
        const token = jwt.sign({ user_id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
          message: "User registered successfully",
          user: { id: user_id, name, email },
          token
        });

      });

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }

});


// ==========================
// LOGIN
// POST /auth/login
// ==========================
router.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const user = results[0];

    try {

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }

      const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error"
      });
    }

  });

});

module.exports = router;