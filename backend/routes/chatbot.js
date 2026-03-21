const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Initialize once (important)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Safe model getter (with fallback)
function getModel() {
  try {
    return genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });
  } catch (e) {
    console.warn("Fallback to pro model");
    return genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest"
    });
  }
}

router.post("/", async (req, res) => {
  const { message } = req.body;

  // ✅ Input validation
  if (!message || typeof message !== "string") {
    return res.json({
      message: "Please ask something like '3 day trip in Paris'"
    });
  }

  try {
    // ✅ Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        message: "AI key missing. Running in demo mode."
      });
    }

    const model = getModel();

    // ✅ STRONG JSON prompt (more reliable)
    const prompt = `
You are an AI Travel Assistant for VoyageAI.

User message: "${message}"

STRICT RULES:
- Output ONLY valid JSON
- NO markdown
- NO explanation text
- NO extra text outside JSON

JSON format:
{
  "message": "string",
  "plan": [
    {
      "day": 1,
      "title": "string",
      "description": "string",
      "places": [
        { "time": "09:00 AM", "name": "string" }
      ]
    }
  ]
}

Rules:
- If user asks for travel plan → include "plan"
- Otherwise → ONLY return "message"
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // ✅ Clean markdown if model adds it
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ EXTRA SAFETY: extract JSON only
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in response");
    }

    const cleanJSON = responseText.slice(jsonStart, jsonEnd + 1);

    try {
      const parsedData = JSON.parse(cleanJSON);
      return res.json(parsedData);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", cleanJSON);

      return res.json({
        message: "AI formatting issue. Try again."
      });
    }

  } catch (error) {
    console.error("CHATBOT ERROR:", {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      message: "AI service error: " + error.message
    });
  }
});

module.exports = router;