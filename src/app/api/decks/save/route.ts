import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, flashcards } = await req.json()

    // Get the current user from auth
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Create deck with flashcards
    const deck = await prisma.deck.create({
      data: {
        name,
        userId: user.id,
        flashcards: {
          create: flashcards.map((card: { question: string; answer: string }) => ({
            question: card.question,
            answer: card.answer,
            userId: user.id,
            difficulty: "MEDIUM",
            repetitions: 0
          }))
        }
      },
      include: {
        flashcards: true
      }
    })

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Error saving deck:', error)
    return NextResponse.json(
      { error: 'Failed to save deck' },
      { status: 500 }
    )
  }
} 