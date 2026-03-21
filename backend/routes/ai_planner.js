const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Init once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Single working model
const model = genAI.getGenerativeModel({
  model: "gemini-pro"
});

// -------------------- PLAN ROUTE --------------------
router.post('/plan', async (req, res) => {
  const { city, days, budget, interests } = req.body;

  if (!city || !days || !budget || !Array.isArray(interests)) {
    return res.status(400).json({
      message: "city, days, budget, and interests[] are required"
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        itinerary: `Day 1: Explore ${city}\nDay 2: Culture + food\nDay 3: Nature + relax`
      });
    }

    const prompt = `
Plan a realistic ${days}-day trip to ${city}.
Budget: ${budget}
Interests: ${interests.join(", ")}

Provide:
- Morning, Afternoon, Evening
- Real places
- Timings

ONLY itinerary. No extra text.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ itinerary: text });

  } catch (error) {
    console.error("PLAN ERROR:", error.message);

    res.status(500).json({
      message: "AI itinerary error"
    });
  }
});

// -------------------- RECOMMEND ROUTE --------------------
router.post('/recommend', async (req, res) => {
  const { favorites } = req.body;

  if (!Array.isArray(favorites)) {
    return res.status(400).json({
      message: "favorites must be an array"
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        recommendations: `Try Kyoto, Bali, Swiss Alps`
      });
    }

    const prompt = `
Favorites: ${favorites.join(", ")}

1. Travel style (1 line)
2. Recommend 3 places
3. Reason (1 line each)
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ recommendations: text });

  } catch (error) {
    console.error("RECOMMEND ERROR:", error.message);

    res.status(500).json({
      message: "AI recommendation error"
    });
  }
});

module.exports = router;