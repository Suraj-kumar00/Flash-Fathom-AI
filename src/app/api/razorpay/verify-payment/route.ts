import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { prisma } from '@/lib/database';

export async function POST(req: NextRequest) {
  console.log('🔍 Verify payment API called');
  
  try {
    const { userId } = await auth();
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('📦 Verification request:', { 
      orderId: body.razorpay_order_id, 
      paymentId: body.razorpay_payment_id?.slice(0, 10) + '...',
      plan: body.plan,
      billingCycle: body.billingCycle
    });

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan,
      billingCycle 
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan || !billingCycle) {
      console.log('❌ Missing required fields for verification');
      return NextResponse.json(
        { error: 'Missing required payment verification data' },
        { status: 400 }
      );
    }

    // ✅ IMPROVED: Verify signature with better error handling
    const body_string = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body_string.toString())
      .digest('hex');

    console.log('🔐 Signature verification:', {
      expected: expectedSignature.slice(0, 10) + '...',
      received: razorpay_signature.slice(0, 10) + '...',
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Signature verification failed');
      
      // Mark payment as failed
      try {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: razorpay_order_id },
          data: { 
            status: 'FAILED',
            failureReason: 'Invalid signature verification',
            updatedAt: new Date()
          }
        });
      } catch (updateError) {
        console.warn('⚠️ Failed to update payment status:', updateError);
      }

      return NextResponse.json(
        { error: 'Payment verification failed - Invalid signature' },
        { status: 400 }
      );
    }

    console.log('✅ Signature verification passed');

    // ✅ IMPROVED: Calculate subscription dates
    const now = new Date();
    const subscriptionStartedAt = new Date(now);
    const subscriptionEndsAt = new Date(now);
    
    if (billingCycle === 'monthly') {
      subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1);
    }

    console.log('📅 Subscription dates:', {
      startedAt: subscriptionStartedAt.toISOString(),
      endsAt: subscriptionEndsAt.toISOString()
    });

    // ✅ IMPROVED: Update records in transaction with better error handling
    let result;
    try {
      result = await prisma.$transaction(async (tx:any) => {
        // Update user subscription status
        const updatedUser = await tx.user.update({
          where: { clerkUserId: userId },
          data: { 
            subscriptionPlan: plan,
            subscriptionCycle: billingCycle,
            subscriptionStatus: 'active',
            paymentId: razorpay_payment_id,
            subscriptionEndsAt: subscriptionEndsAt,
            subscriptionStartedAt: subscriptionStartedAt,
            updatedAt: new Date()
          }
        });

        // Update payment record to completed
        const updatedPayment = await tx.payment.updateMany({
          where: { razorpayOrderId: razorpay_order_id },
          data: {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'COMPLETED',
            updatedAt: new Date()
          }
        });

        return { user: updatedUser, payment: updatedPayment };
      });

      console.log('✅ Transaction completed successfully');
    } catch (transactionError) {
      console.error('❌ Transaction failed:', transactionError);
      
      // Try to mark payment as failed
      try {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: razorpay_order_id },
          data: { 
            status: 'FAILED',
            failureReason: 'Database transaction failed',
            updatedAt: new Date()
          }
        });
      } catch (updateError) {
        console.error('❌ Failed to update payment status after transaction failure:', updateError);
      }

      return NextResponse.json(
        { error: 'Failed to activate subscription. Please contact support.' },
        { status: 500 }
      );
    }

    const responseData = {
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        plan,
        billingCycle,
        status: 'active',
        startedAt: subscriptionStartedAt,
        endsAt: subscriptionEndsAt
      }
    };

    console.log('✅ Payment verified and subscription activated:', {
      userId,
      plan,
      billingCycle,
      expiresAt: subscriptionEndsAt.toISOString()
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('💥 Verification API Error:', error);
    
    // Try to mark payment as failed if we have the order ID
    try {
      const body = await req.json();
      if (body.razorpay_order_id) {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: body.razorpay_order_id },
          data: { 
            status: 'FAILED',
            failureReason: error instanceof Error ? error.message : 'Unknown error',
            updatedAt: new Date()
          }
        });
      }
    } catch (updateError) {
      console.error('❌ Failed to update payment status:', updateError);
    }

    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
