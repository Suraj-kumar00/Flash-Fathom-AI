import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { paymentService } from '@/lib/services/payment.service';
import type { RazorpayOrderRequest, ApiError } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      const error: ApiError = { error: 'Unauthorized - Please sign in' };
      return NextResponse.json(error, { status: 401 });
    }

    const { plan, billingCycle }: RazorpayOrderRequest = await req.json();

    // Single Responsibility: Delegate to payment service
    const orderResponse = await paymentService.createPaymentOrder(plan, billingCycle, userId);

    return NextResponse.json(orderResponse);

  } catch (error) {
    console.error('Error creating payment order:', error);
    const errorResponse: ApiError = { 
      error: error instanceof Error ? error.message : 'Failed to create payment order' 
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
