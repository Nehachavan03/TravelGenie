const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Initialize once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Use ONLY working model
const model = genAI.getGenerativeModel({
  model: "gemini-pro"
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  // ✅ Input validation
  if (!message || typeof message !== "string") {
    return res.json({
      message: "Please ask something like '3 day trip in Paris'"
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        message: "AI key missing. Running in demo mode."
      });
    }

    const prompt = `
You are an AI Travel Assistant.

User: "${message}"

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No extra text

Format:
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
- If NOT planning → only return "message"
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // ✅ Clean response
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract JSON safely
    const start = responseText.indexOf("{");
    const end = responseText.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from AI");
    }

    const json = responseText.slice(start, end + 1);

    try {
      const parsed = JSON.parse(json);
      return res.json(parsed);
    } catch (err) {
      console.error("JSON PARSE FAIL:", json);

      return res.json({
        message: "AI response formatting issue"
      });
    }

  } catch (error) {
    console.error("CHATBOT ERROR:", error.message);

    return res.status(500).json({
      message: "AI service error: " + error.message
    });
  }
});

module.exports = router;