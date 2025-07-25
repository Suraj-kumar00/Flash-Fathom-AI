import { prisma } from '@/lib/database'
import type { Flashcard, Deck } from '@prisma/client'

export async function fetchFlashcardsBySet(userId: string, setId: string) {
  return await prisma.flashcard.findMany({
    where: {
      AND: [
        { userId },
        { deckId: setId }
      ]
    }
  })
}

export async function saveFlashcardSet(
  userId: string, 
  setName: string, 
  flashcards: Array<{ question: string; answer: string }>
) {
  return await prisma.deck.create({
    data: {
      name: setName,
      userId,
      flashcards: {
        create: flashcards.map(card => ({
          question: card.question,
          answer: card.answer,
          userId
        }))
      }
    },
    include: {
      flashcards: true
    }
  })
}

export async function deleteFlashcardSet(userId: string, setId: string) {
  const deleteFlashcards = prisma.flashcard.deleteMany({
    where: {
      deckId: setId,
      userId: userId
    }
  })

  const deleteDeck = prisma.deck.delete({
    where: {
      id: setId,
    }
  })

  await prisma.$transaction([deleteFlashcards, deleteDeck])
}