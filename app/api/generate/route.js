import { NextResponse } from "next/server";

const systemPrompt = `
You are a flashcard creator.

What would you like to do?
1. Create a new flashcard
2. Edit an existing flashcard
3. Delete a flashcard
4. View all flashcards
Please enter the number corresponding to your choice:


`