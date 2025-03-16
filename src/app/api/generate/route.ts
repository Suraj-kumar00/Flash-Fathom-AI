import { NextResponse } from "next/server";
import OpenAI from 'openai';

// Initialize the OpenAI instance with OpenAI's API
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL as string,
        "X-Title": "FlashFathom AI"
    },
});

// POST method for handling incoming requests
export async function POST(req: Request) {
    try {
        const text = await req.text();
        console.log('Received text:', text);

        const prompt = `Create 10 flashcards from this text: "${text}". 
        Each flashcard should have a question and answer. 
        Format your response as a JSON array like this:
        {
          "flashcards": [
            {"question": "What is X?","X", "answer": "X is Y"},
            // more cards...
          ]
        }`;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that creates educational flashcards."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        console.log('API Response:', response);

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content generated');
        }

        try {
            const parsedContent = JSON.parse(content);
            if (!parsedContent.flashcards || !Array.isArray(parsedContent.flashcards)) {
                throw new Error('Invalid response format');
            }

            return NextResponse.json(parsedContent);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Content:', content);
            throw new Error('Failed to parse AI response');
        }
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json(
            { error: 'Failed to generate flashcards: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
