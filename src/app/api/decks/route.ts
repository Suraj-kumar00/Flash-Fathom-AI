import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'

// Or create a type from your schema
type DeckWithFlashcards = Prisma.DeckGetPayload<{
  include: { flashcards: true }
}>

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const decks = await prisma.deck.findMany({
      where: { userId },
      include: { flashcards: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(decks)
  } catch (error) {
    console.error('Error fetching decks:', error)
    return NextResponse.json(
      { error: 'Error fetching decks' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId, name, flashcards } = await req.json()

    const deck = await prisma.deck.create({
      data: {
        name,
        userId,
        flashcards: {
          create: flashcards.map((card: { question: string; answer: string }) => ({
            question: card.question,
            answer: card.answer,
            userId,
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
    console.error('Error creating deck:', error)
    return NextResponse.json(
      { error: 'Error creating deck: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 