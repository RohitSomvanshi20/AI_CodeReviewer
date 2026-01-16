require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to call Gemini with retries and fallback
async function getAIResponse(prompt) {
  let models = ["gemini-2.0-flash", "gemini-2.5-pro"];

  for (let modelName of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔹 Using model: ${modelName}, attempt ${attempt}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        if (error.message.includes("overloaded") && attempt < 3) {
          console.warn(`⚠️ Model overloaded. Retrying in 2s...`);
          await new Promise(res => setTimeout(res, 2000));
        } else if (attempt === 3) {
          console.error(`❌ Failed with model: ${modelName}`, error.message);
          break; // Try next model
        }
      }
    }
  }

  throw new Error("AI service unavailable after retries and fallback");
}

module.exports = { getAIResponse };


