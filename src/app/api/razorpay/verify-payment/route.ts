import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { prisma } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan,
      billingCycle 
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Payment verified - Update user subscription status
    // You can create a subscription table or update user table
    console.log('Payment verified for user:', userId);
    console.log('Plan:', plan, 'Billing:', billingCycle);

    // TODO: Update user's subscription status in database
    // await prisma.user.update({
    //   where: { clerkUserId: userId },
    //   data: { 
    //     subscriptionPlan: plan,
    //     subscriptionCycle: billingCycle,
    //     subscriptionStatus: 'active'
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
