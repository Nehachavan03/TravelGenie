const express = require('express');
 const router = express.Router();
     // const { GoogleGenerativeAI } = require("@google/generative-ai"); // Uncomment if using Gemini
     // const OpenAI = require("openai"); // Uncomment if using OpenAI
    
     // Initialize AI (Example for Gemini)
     // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
     router.post('/plan', async (req, res) => {
        const { city, days, budget, interests } = req.body;
   
        try {
            // Construct the prompt
            const prompt = `Plan a ${days}-day trip to ${city} with a ${budget} budget.
                            User interests: ${interests.join(', ')}.
                            Provide a day-by-day itinerary with morning, afternoon, and evening activities.`;     
   
            // Call AI API here
            // const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            // const result = await model.generateContent(prompt);
            // const response = await result.response;
            // const text = response.text();
   
            // MOCK RESPONSE (Remove this when you have an API key)
            const text = `Day 1: Explore ${city} City Center...\nDay 2: Visit the famous museums...`;
   
            res.json({ itinerary: text });
        } catch (error) {
            console.error(error);
            res.status(500).send("AI Error");
        }
   
   
   
    });
router.post('/recommend', async (req, res) => {
  const { favorites } = req.body;
  try {
    const prompt = 'Based on these favorite places: ' + favorites.join(', ') + ', recommend 3 similar destinations or activities world-wide. Provide brief reasons why.';
    const text = 'Since you like ' + favorites[0] + ', you might love visiting Kyoto for its temples or Swiss Alps for nature!';
    res.json({ recommendations: text });
  } catch (error) {
    res.status(500).send('AI Error');
  }
});

module.exports = router;
