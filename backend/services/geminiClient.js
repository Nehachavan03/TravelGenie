const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Fetch list of all available models for the current API Key
 * (Useful helper for diagnosing 404s)
 * @returns {Promise<Array>} List of models
 */
async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("No GEMINI_API_KEY set.");
        return [];
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        return data.models || [];
    } catch (e) {
        console.error("Error listing Gemini models:", e.message);
        return [];
    }
}

/**
 * Safe generation with automatic fallback to secondary model.
 * 
 * @param {string} prompt Prompt string to send to the Gemini AI
 * @param {string} primaryModel Primary model (default: "gemini-2.5-flash")
 * @param {string} fallbackModel Fallback model (default: "gemini-2.0-flash")
 * @returns {Promise<string>} Generated text content
 */
async function safeGenerateContent(prompt, primaryModel = "gemini-2.5-flash", fallbackModel = "gemini-2.0-flash") {
    if (!genAI) {
        throw new Error("No API key configured for AI generation");
    }

    try {
        const model = genAI.getGenerativeModel({ model: primaryModel });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.warn(`[Gemini] Primary model ${primaryModel} failed: ${error.message}. Trying fallback ${fallbackModel}...`);
        try {
            const fallback = genAI.getGenerativeModel({ model: fallbackModel });
            const result = await fallback.generateContent(prompt);
            return result.response.text();
        } catch (fallbackError) {
            console.error(`[Gemini] Fallback model ${fallbackModel} also failed: ${fallbackError.message}`);
            throw fallbackError;
        }
    }
}

module.exports = {
    genAI,
    listModels,
    safeGenerateContent
};
