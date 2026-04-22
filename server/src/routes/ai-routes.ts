import { Router } from "express";

const router = Router();

router.post("/ask", async (req, res) => {
    try {
        const { code, language, prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Missing prompt" });
        }

        // Construct standard AI instruction combining contextual code and user prompt
        const systemPrompt = `You are a highly capable AI assistant helping a developer in a code editor application called CodeNShip. 
The developer is currently working in a file identified as language: ${language}.
Here is the code they currently have in their editor:
\`\`\`${language}
${code || "/* No code provided */"}
\`\`\`
Answer the user's prompt directly, concisely, and provide clear code blocks if you write code. Do not apologize or add unnecessary conversational fluff.`;

        // We make a request to the local Ollama instance using the phi3 model
        // Make sure streaming is set to false to make the HTTP request simple to consume
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "phi3",
                system: systemPrompt,
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama returned status ${response.status}`);
        }

        const data = await response.json();
        
        res.json({ result: data.response });
    } catch (error) {
        console.error("Ask AI error:", error);
        res.status(500).json({ error: "Failed to connect to local AI. Ensure Ollama is running and the phi3 model is pulled." });
    }
});

export default router;
