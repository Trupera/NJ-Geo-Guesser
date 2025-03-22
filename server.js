import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config(); // Load API key from .env

const app = express();
app.use(express.json());
app.use(cors()); // Allows frontend to make API requests

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Securely access the API key
});

// API endpoint for analyzing images
app.post("/analyze", async (req, res) => {
    try {
        const { imageUrl } = req.body; // Get image URL from frontend request

        
        if (!imageBase64) {
            return res.status(400).json({ error: "No image provided" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: "Guess this location based on the image." },
                    { type: "image_file", image_file: { url: imageBase64 } }
                ]
            }]
        });

        res.json({ location: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "Error processing request" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
