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

    // Using gemini-1.5-flash and requesting JSON output
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are a helpful and enthusiastic AI Travel Assistant for "VoyageAI", a travel planning app. 
    
    App Context:
    - To Login: Click the "Login" button in the navigation bar. You can use the Guest account (guest@example.com / guestpassword123) for a quick look.
    - Features: Users can explore countries/cities, view places, add places to their favorites, and generate smart itineraries.
    - Smart Planner: Users can go to the "Smart Planner" page to generate a multi-day trip based on their budget and interests.
    - Favorites: Click the Heart icon on any place to save it to your Favorites list.

    The user said: "${message}"

    Respond with a JSON object exactly matching this schema:
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

    Note: The "plan" array is optional and should ONLY be included if the user is asking for an itinerary or a trip plan. If they ask about app features or login, provide the information in the "message" field and omit the "plan".`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const parsedData = JSON.parse(responseText);
      res.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON:', responseText);
      res.json({ message: "I'm sorry, I couldn't formulate a proper response to that. Could you try rephrasing?" });
    }

  } catch (error) {
    console.error('Chatbot AI Error:', error);
    res.status(500).json({ message: "AI service error" });
  }
});

module.exports = router;