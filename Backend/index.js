import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// AI ROUTE
app.post("/ai/get-response", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "No code provided." });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `Review and improve this JavaScript code:\n\n${code}`,
            },
          ],
        },
      ],
    });

    const aiText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    res.json({ response: aiText });
  } catch (error) {
    console.error("AI API ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: "Gemini API error",
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
