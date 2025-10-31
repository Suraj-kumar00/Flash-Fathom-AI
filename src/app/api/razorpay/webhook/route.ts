import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/database';

// Ensure this route is always handled at runtime and not during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Webhook secret from Razorpay dashboard
// Note: Do NOT throw at module init; check inside the handler to avoid build-time failures

export async function POST(req: NextRequest) {
  console.log('🔔 Razorpay webhook received');
  
  try {
    const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error('❌ Missing RAZORPAY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    if (!signature) {
      console.log('❌ No signature found in webhook');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature (constant-time)
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    const providedBuf = Buffer.from(signature, 'hex');
    const expectedBuf = Buffer.from(expectedSignature, 'hex');

    if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
      console.log('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Webhook signature verified');

    const event = JSON.parse(body);
    console.log('📦 Webhook event:', event.event);

    // Handle different payment events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
        
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
        
      default:
        console.log('ℹ️ Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('💥 Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log('💰 Payment captured:', payment.id);
  
  try {
    // Find the payment record
    const paymentRecord = await prisma.payment.findFirst({
      where: { razorpayPaymentId: payment.id }
    });

    if (!paymentRecord) {
      console.log('❌ Payment record not found for:', payment.id);
      return;
    }

    // Update payment status
    if (paymentRecord.status === 'COMPLETED') {
        console.log('⚠️ Payment already processed:', payment.id);
        return;
    }
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: 'COMPLETED',
        razorpayPaymentId: payment.id,
        updatedAt: new Date()
      }
    });

    // Get order details to determine subscription
    const order = await prisma.payment.findFirst({
      where: { razorpayOrderId: payment.order_id }
    });

    if (order) {
      // Calculate subscription dates
      const now = new Date();
      const subscriptionStartedAt = new Date(now);
      const subscriptionEndsAt = new Date(now);
      const daysToAdd = order.billingCycle === 'monthly' ? 30 : 365;
      subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + daysToAdd);

      // Update user subscription
      await prisma.user.update({
        where: { clerkUserId: order.userId },
        data: {
          subscriptionPlan: order.plan,
          subscriptionCycle: order.billingCycle,
          subscriptionStatus: 'active',
          paymentId: payment.id,
          subscriptionEndsAt: subscriptionEndsAt,
          subscriptionStartedAt: subscriptionStartedAt,
          updatedAt: new Date()
        }
      });

      console.log('✅ User subscription activated:', {
        userId: order.userId,
        plan: order.plan,
        billingCycle: order.billingCycle
      });
    }

  } catch (error) {
    console.error('❌ Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  console.log('❌ Payment failed:', payment.id);
  
  try {
    // Find and update payment record (fallback by order id)
    const paymentRecord = await prisma.payment.findFirst({
      where: {
        OR: [
          { razorpayPaymentId: payment.id },
          { razorpayOrderId: payment.order_id }
        ]
      }
    });

    if (paymentRecord) {
      await prisma.payment.updateMany({
        where: { id: paymentRecord.id, status: { not: 'COMPLETED' } },
        data: {
          status: 'FAILED',
          failureReason: payment.error_description || 'Payment failed',
          updatedAt: new Date()
        }
      });

      console.log('✅ Payment marked as failed:', payment.id);
    }

  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handleOrderPaid(order: any) {
  console.log('✅ Order paid:', order.id);
  
  try {
    // Update order status
    await prisma.payment.updateMany({
      where: { razorpayOrderId: order.id },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date()
      }
    });

    console.log('✅ Order marked as paid:', order.id);

  } catch (error) {
    console.error('❌ Error handling order paid:', error);
  }
}
