require('dotenv').config();
const axios = require('axios');

async function listModelsDirectly() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in .env file.");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log("Fetching available models directly from Google API...");
    const response = await axios.get(url);
    const models = response.data.models;
    
    console.log("\n--- Available Models ---");
    models.forEach(m => {
      console.log(`- ${m.name} (${m.displayName})`);
      console.log(`  Supported Methods: ${m.supportedGenerationMethods.join(', ')}`);
    });
    
  } catch (error) {
    console.error("Error fetching models:", error.response?.data || error.message);
  }
}

listModelsDirectly();
