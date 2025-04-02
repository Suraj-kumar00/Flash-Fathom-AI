import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: any) {
  try {
    const text = await req.text();
    console.log("Received text:", text);

    const prompt = `Create 10 flashcards from this text: "${text}". 
        Each flashcard should have a question and answer. 
        Format your response as a JSON array like this:
        {
          "flashcards": [
            {"question": "What is X?", "answer": "X is Y"},
            // more cards...
          ]
        }`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("Invalid response format from Gemini API");

    // Fix JSON parsing issue by removing markdown code block markers
    content = content.replace(/```json|```/g, "").trim();

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
