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

    // We use gemini-2.5-flash and force it to output structured JSON
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are a helpful and enthusiastic AI Travel Assistant. The user said: "${message}"

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

Note: The "plan" array is optional and should ONLY be included if the user is asking for an itinerary or a trip plan. If they just say "hi", "plan" can be omitted. Make the itinerary highly realistic, with famous or interesting real-world places. Add roughly 3-4 places per day with logical times.`;

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