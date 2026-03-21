const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Initialize once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Safe model getter (fallback included)
function getModel() {
  try {
    return genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });
  } catch (e) {
    console.warn("Falling back to pro model");
    return genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest"
    });
  }
}

// -------------------- PLAN ROUTE --------------------
router.post('/plan', async (req, res) => {
  const { city, days, budget, interests } = req.body;

  // ✅ Validation (prevents runtime crash)
  if (!city || !days || !budget || !Array.isArray(interests)) {
    return res.status(400).json({
      message: "city, days, budget, and interests[] are required"
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No API key → fallback");

      return res.json({
        itinerary: `Day 1: Explore ${city}\nDay 2: Culture + food\nDay 3: Nature + relax`
      });
    }

    const model = getModel();

    const prompt = `
Act as a senior travel consultant.

Plan a realistic ${days}-day trip to ${city} with budget ${budget}.
User interests: ${interests.join(", ")}.

Provide:
- Morning, Afternoon, Evening
- Real locations
- Approx timings

ONLY itinerary. No intro or conclusion.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ itinerary: text });

  } catch (error) {
    console.error("AI Planner Error:", error.message);

    res.status(500).json({
      message: "Error generating itinerary"
    });
  }
});

// -------------------- RECOMMEND ROUTE --------------------
router.post('/recommend', async (req, res) => {
  const { favorites } = req.body;

  // ✅ Validation
  if (!Array.isArray(favorites)) {
    return res.status(400).json({
      message: "favorites must be an array"
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        recommendations:
          `Since you like ${favorites[0] || "beautiful places"}, try Kyoto or Swiss Alps.`
      });
    }

    const model = getModel();

    const prompt = `
User favorites: ${favorites.join(", ")}

1. Travel style (1 line)
2. Recommend 3 destinations
3. 1-line reason each

Keep concise.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ recommendations: text });

  } catch (error) {
    console.error("AI Recommend Error:", error.message);

    res.status(500).json({
      message: "Error generating recommendations"
    });
  }
});

module.exports = router;