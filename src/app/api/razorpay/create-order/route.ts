import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ✅ UPDATED: Complete pricing configuration
const PRICING = {
  basic: { 
    monthly: 5900,   // ₹59 in paise
    yearly: 59000    // ₹590 in paise (₹59 × 10 months = 2 months free)
  },
  pro: { 
    monthly: 9900,   // ₹99 in paise  
    yearly: 99000    // ₹990 in paise (₹99 × 10 months = 2 months free)
  },
  orgs: {
    monthly: 15900,  // ₹159 in paise
    yearly: 159000   // ₹1590 in paise (₹159 × 10 months = 2 months free)
  }
} as const;

export async function POST(req: NextRequest) {
  console.log('🔍 Create order API called');
  
  try {
    const { userId } = await auth();
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('📦 Request body:', body);
    
    const { plan, billingCycle } = body;

    // Validate plan and billing cycle
    if (!plan || !billingCycle) {
      console.log('❌ Missing plan or billingCycle:', { plan, billingCycle });
      return NextResponse.json(
        { error: 'Plan and billing cycle are required' },
        { status: 400 }
      );
    }

    // ✅ FIXED: Better plan validation
    const validPlans = ['basic', 'pro', 'orgs'] as const;
    const validCycles = ['monthly', 'yearly'] as const;

    if (!validPlans.includes(plan as any)) {
      console.log('❌ Invalid plan:', plan, 'Valid plans:', validPlans);
      return NextResponse.json(
        { error: `Invalid plan selected. Valid plans: ${validPlans.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validCycles.includes(billingCycle as any)) {
      console.log('❌ Invalid billing cycle:', billingCycle, 'Valid cycles:', validCycles);
      return NextResponse.json(
        { error: `Invalid billing cycle. Valid cycles: ${validCycles.join(', ')}` },
        { status: 400 }
      );
    }

    const amount = PRICING[plan as keyof typeof PRICING][billingCycle as keyof typeof PRICING.basic];
    
    if (!amount) {
      console.log('❌ No amount found for:', { plan, billingCycle });
      return NextResponse.json(
        { error: 'Invalid billing cycle for selected plan' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed:', { plan, billingCycle, amount: `₹${amount/100}` });

    // ✅ IMPROVED: User management with better error handling
    try {
      await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: { 
          updatedAt: new Date() 
        },
        create: {
          clerkUserId: userId,
          email: `${userId}@temp.local`,
          subscriptionPlan: 'free',
          subscriptionStatus: 'inactive'
        }
      });
      console.log('✅ User upserted successfully');
    } catch (userError) {
      console.warn('⚠️ User upsert failed, trying fallback:', userError);
      // Fallback: try without subscription fields
      try {
        await prisma.user.upsert({
          where: { clerkUserId: userId },
          update: { updatedAt: new Date() },
          create: {
            clerkUserId: userId,
            email: `${userId}@temp.local`
          }
        });
        console.log('✅ User upserted with fallback');
      } catch (fallbackError) {
        console.error('❌ User creation failed completely:', fallbackError);
        // Continue anyway - user might already exist
      }
    }

    // ✅ FIXED: Create Razorpay order with better error handling
    let order;
    try {
      order = await razorpay.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: `order_${Date.now()}_${userId.slice(-8)}`,
        notes: {
          userId,
          plan,
          billingCycle,
          created_at: new Date().toISOString()
        }
      });
      console.log('✅ Razorpay order created:', order.id);
    } catch (razorpayError) {
      console.error('❌ Razorpay order creation failed:', razorpayError);
      return NextResponse.json(
        { error: 'Failed to create payment order. Please check your payment configuration.' },
        { status: 500 }
      );
    }

    // ✅ IMPROVED: Payment record creation with better error handling
    let paymentRecord = null;
    try {
      paymentRecord = await prisma.payment.create({
        data: {
          userId,
          razorpayOrderId: order.id,
          amount,
          currency: 'INR',
          plan,
          billingCycle,
          status: 'PENDING'
        }
      });
      console.log('✅ Payment record created:', paymentRecord.id);
    } catch (paymentError) {
      console.warn('⚠️ Payment record creation failed, but order is valid:', paymentError);
      // This could fail if Payment model doesn't exist yet - order is still valid
    }

    const response = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan,
      billingCycle
    };

    console.log('✅ Payment order created successfully:', {
      orderId: order.id,
      userId,
      plan,
      billingCycle,
      amount: `₹${amount / 100}`,
      paymentRecordId: paymentRecord?.id || 'Not created'
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
