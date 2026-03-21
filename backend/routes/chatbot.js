const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({
      message: "Please ask something like '3 day trip in Paris'"
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using fallback response.");
      return res.json({
        message: "I'm your AI Travel Planner! Be sure to add your GEMINI_API_KEY to see my real capabilities."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful and enthusiastic AI Travel Assistant for "VoyageAI", a travel planning app. 
    
    App Context:
    - To Login: Click the "Login" button in the navigation bar. You can use the Guest account (guest@example.com / guestpassword123) for a quick look.
    - Features: Users can explore countries/cities, view places, add places to their favorites, and generate smart itineraries.
    - Smart Planner: Users can go to the "Smart Planner" page to generate a multi-day trip based on their budget and interests.
    - Favorites: Click the Heart icon on any place to save it to your Favorites list.

    The user said: "${message}"

    Respond ONLY with a valid JSON object matching this schema:
    {
      "message": "A conversational response acknowledging the request and providing a helpful reply.",
      "plan": [ 
        {
          "day": 1,
          "title": "A short, catchy title for the day",
          "description": "A brief description of the day's theme",
          "places": [
            { "time": "09:00 AM", "name": "Name of the place or activity" }
          ]
        }
      ]
    }

    Note: The "plan" array is optional. ONLY include it if the user asks for a trip plan. If they ask about app features or login, provide the info in the "message" field and omit "plan". Do not include any text outside the JSON.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up potential markdown code blocks if the AI includes them
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedData = JSON.parse(responseText);
      res.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON. Raw text:', responseText);
      res.json({ message: "I've processed your request, but I had trouble formatting the response. " + responseText.substring(0, 100) + "..." });
    }

  } catch (error) {
    console.error('Detailed Chatbot AI Error:', {
      message: error.message,
      stack: error.stack,
      details: error.response?.data
    });
    res.status(500).json({ message: "AI service error: " + (error.message || "Unknown error") });
  }
});

module.exports = router;