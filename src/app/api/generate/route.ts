import { NextResponse } from "next/server";
import OpenAI from 'openai';

// Initialize the OpenAI instance with Cloudflare’s OpenRouter API
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY, // Ensure this is stored in your environment variables
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL, // Should be set in your .env.local
        "X-Title": 'Flashcards App',
    },
});

// System prompt for flashcard generation
const systemPrompt = `
You are a helpful assistant that generates flashcards. You take in text and create exactly 10 flashcards from it. Both front and back should be one sentence long. You MUST return your response in the following JSON format, with no additional text before or after the JSON:

{
  "flashcards": [
    {
      "question": "Front of the card",
      "answer": "Back of the card"
    },
    // ... (8 more flashcards)
  ]
}`;

// POST method for handling incoming requests
export async function POST(request: Request) {
    try {
        const data = await request.text(); // Get the input text from the request

        // Call OpenRouter (Cloudflare's OpenAI-like API)
        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.1-8b-instruct:free", // Model choice
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: data },
            ],
            response_format: { type: 'json_object' }, // Ensure response is JSON
        });

        const content = completion.choices[0]?.message?.content;

        // Handle case where no content is returned
        if (!content) {
            return NextResponse.json({ error: "Failed to generate flashcards." }, { status: 500 });
        }

        // Try parsing the JSON content
        try {
            const flashcards = JSON.parse(content);
            
            // Validate the structure of the flashcards object
            if (flashcards?.flashcards && Array.isArray(flashcards.flashcards)) {
                return NextResponse.json(flashcards); // Return flashcards in JSON response
            } else {
                throw new Error('Invalid flashcards format');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Raw content:', content);
            return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
        }

    } catch (error) {
        // Catch any other errors and log them
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: "Failed to generate flashcards." }, { status: 500 });
    }
}
