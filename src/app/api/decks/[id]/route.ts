import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: params.id },
      include: { flashcards: true }
    })

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Error fetching deck:', error)
    return NextResponse.json(
      { error: 'Error fetching deck' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$transaction([
      prisma.flashcard.deleteMany({
        where: { deckId: params.id }
      }),
      prisma.deck.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deck:', error)
    return NextResponse.json(
      { error: 'Error deleting deck' },
      { status: 500 }
    )
  }
} 