const aiService = require("../services/ai.service");

module.exports.getResponse = async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const prompt = `
You are a senior JavaScript code reviewer.
Review the following code and:
1. Point out issues or improvements.
2. Suggest better practices.
3. Format your answer in Markdown.
4. Include syntax-highlighted code examples inside triple backticks.

Code to review:
\`\`\`javascript
${code}
\`\`\`
`;

    const reviewText = await aiService.getAIResponse(prompt);
    res.status(200).json({ response: reviewText });

  } catch (error) {
    console.error("AI Controller Error:", error.message);

    if (error.message.includes("overloaded")) {
      return res.status(503).json({ error: "The AI service is overloaded. Please try again in a moment." });
    }

    if (error.message.includes("unavailable")) {
      return res.status(503).json({ error: "The AI service is currently unavailable. Please try again later." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};