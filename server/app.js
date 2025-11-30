import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OpenAI from "openai";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/solve", async (req, res) => {
    try {
        const { taskName, challengeQuestion, suggestedSolution, taskStyle } = req.body;

        let prompt = "";

        if (taskStyle === "pseudocode") {
            prompt = `Provide a high-level pseudocode for the following challenge question in English (no programming language specific syntax):\n\n${challengeQuestion}`;
        } else if (taskStyle === "break-debug") {
            prompt = `You are an interviewer AI. Provide ONE concise way to break the candidate's solution and ONE concise way to debug it. Output only two lines: "How to break the code: ..." and "How to debug it: ...". Challenge question:\n${challengeQuestion}\nSuggested solution (if any): ${suggestedSolution || "none"}`;
        } else if (taskStyle === "iterative") {
            // One click, return all 3 solutions: original + 2 alternatives
            prompt = `You are an AI coding interviewer. Provide three distinct solutions for the following coding challenge:
1. Include the original solution (or standard approach)
2. Provide two alternative optimized solutions, each different from the previous
Include code blocks for each solution and a brief time and space complexity analysis for each. Challenge question:\n${challengeQuestion}\nSuggested solution (if any): ${suggestedSolution || "none"}`;
        } else {
            prompt = `Provide a working code solution for the following coding challenge. Output only the code:
Challenge question:
${challengeQuestion}
Suggested solution (if any): ${suggestedSolution || "none"}`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0
        });

        const solution = completion.choices[0].message.content.trim();
        res.json({ solution });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch solution." });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

