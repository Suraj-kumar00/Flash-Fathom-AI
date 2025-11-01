import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { subscriptionService } from '@/lib/services/subscription.service';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscriptionStatus = await subscriptionService.getUserSubscriptionStatus(userId);
    
    return NextResponse.json(subscriptionStatus);

  } catch (error) {
    console.error('❌ Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
