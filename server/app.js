import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/solve
app.post("/api/solve", async (req, res) => {
    const { taskName, challengeQuestion, suggestedSolution, taskStyle } = req.body;

    try {
        let prompt;
        if (taskStyle === "pseudocode") {
            prompt = `Write a high-level pseudocode or English description for this task. Do NOT use any programming language:\n\n${challengeQuestion}`;
        } else if (taskStyle === "iterative") {
            prompt = `Provide a clean code solution for this task. Also provide progressively optimized versions to improve time/space complexity:\n\n${challengeQuestion}`;
        } else {
            prompt = `Provide a clean code solution for this task. Use any necessary details from the suggested solution if provided:\n\n${challengeQuestion}\n\nSuggested solution (optional):\n${suggestedSolution || ""}`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "You are a helpful coding assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
        });

        const solution = completion.choices[0].message.content.trim();

        res.json({ solution });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate solution" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

