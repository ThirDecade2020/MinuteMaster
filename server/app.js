import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/*  
   FUNCTION: generateSolution
   - Returns ONLY the clean solution code.
   - No explanations.
   - No markdown.
   - No backticks.
   - No steps.
*/
async function generateSolution(taskName, challengeQuestion, suggestedSolution) {
  const userPrompt = `
Task: ${taskName}

Challenge Question:
${challengeQuestion}

Suggested Solution (optional):
${suggestedSolution || "None provided"}

INSTRUCTIONS:
Return ONLY the final clean solution.
- No explanation
- No commentary
- No formatting
- No markdown
- No backticks
- Only the solution itself.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You return ONLY the clean final solution. No explanation. No formatting. No markdown. No backticks."
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  return completion.choices[0].message.content.trim();
}

// API Endpoint
app.post("/api/solve", async (req, res) => {
  try {
    const { taskName, challengeQuestion, suggestedSolution } = req.body;

    const solution = await generateSolution(
      taskName,
      challengeQuestion,
      suggestedSolution
    );

    res.json({ solution });
  } catch (error) {
    console.error("Error generating solution:", error);
    res.status(500).json({ error: "Failed to generate solution" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

