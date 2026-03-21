const express = require('express');
const router = express.Router();
const { safeGenerateContent } = require("../services/geminiClient");

router.post('/plan', async (req, res) => {
  const { city, days, budget, interests } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using fallback response.");
      const text = `Day 1: Arrival in ${city}. Morning coffee at a local cafe. Visit the historic city center and enjoy a traditional lunch. Evening walk by the river.\n\nDay 2: Full day exploring local museums and art galleries. Optional shopping at the main district.\n\nDay 3: Nature day! Visit the botanical gardens or a nearby park. Farewell dinner at a top-rated restaurant.`;
      return res.json({ itinerary: text });
    }

    // Construct the prompt for VoyageAI Smart Planner
    const prompt = `Act as a senior travel consultant for VoyageAI. 
                        Plan a highly realistic ${days}-day trip to ${city} with a budget of ${budget}.
                        User interests: ${interests.join(', ')}.
                        
                        Provide a detailed day-by-day itinerary with:
                        - Morning, afternoon, and evening slots.
                        - Specific real-world locations and activity names.
                        - Estimated timings.
                        
                        Keep the response clean and well-formatted with clear headings for each day. Focus only on the itinerary steps. Do not include any introductory or concluding text.`;

    const text = await safeGenerateContent(prompt, "gemini-2.5-pro", "gemini-2.5-flash");

    res.json({ itinerary: text });
  } catch (error) {
    console.error("AI Planner Error:", error);
    res.status(500).json({ message: "Error generating the AI itinerary" });
  }
});

router.post('/recommend', async (req, res) => {
  const { favorites } = req.body;
  try {
    if (!process.env.GEMINI_API_KEY) {
      const text = 'Since you like ' + (favorites[0] || 'beautiful places') + ', you might love visiting Kyoto for its temples or Swiss Alps for nature!';
      return res.json({ recommendations: text });
    }

    const prompt = `The user has the following places in their favorites list: ${favorites.join(', ')}.
                        1. Provide a very brief (1-2 sentence) summary of their travel style based on these favorites.
                        2. Recommend 3 specific new destinations or activities worldwide that match this style.
                        3. For each recommendation, give a 1-sentence reason why they would love it.
                        
                        Keep the entire response concise and well-structured.`;

    const text = await safeGenerateContent(prompt, "gemini-2.5-flash", "gemini-2.0-flash");

    res.json({ recommendations: text });
  } catch (error) {
    console.error("AI Recommend Error:", error);
    res.status(500).send('AI Error');
  }
});

module.exports = router;
