import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth(); // ✅ FIXED: Added missing 'await'
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Delete deck and all associated flashcards
    await prisma.deck.delete({
      where: {
        id: params.id,
        userId: userId // Ensure user owns the deck
      }
    });

    return NextResponse.json({ message: 'Deck deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting deck:', error);
    return NextResponse.json(
      { error: 'Failed to delete deck' },
      { status: 500 }
    );
  }
}
