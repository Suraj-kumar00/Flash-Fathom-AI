import type { 
  SubscriptionPlan, 
  BillingCycle, 
  RazorpayOrderResponse 
} from '@/types';

// Interface Segregation Principle: Define payment contract
export interface IPaymentProvider {
  createOrder(plan: SubscriptionPlan, cycle: BillingCycle, userId: string): Promise<RazorpayOrderResponse>;
  verifyPayment(paymentData: any): Promise<boolean>;
}

// Open/Closed Principle: Extensible payment providers
export class RazorpayProvider implements IPaymentProvider {
  private razorpay: any;

  constructor() {
    const Razorpay = require('razorpay');
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  private getPricing() {
    return {
      monthly: { Pro: 500, Organizational: 1500 },
      yearly: { Pro: 5000, Organizational: 15000 }
    };
  }

  async createOrder(
    plan: SubscriptionPlan, 
    cycle: BillingCycle, 
    userId: string
  ): Promise<RazorpayOrderResponse> {
    if (plan === 'Free') {
      throw new Error('Free plan does not require payment');
    }

    const pricing = this.getPricing();
    const amount = pricing[cycle][plan as keyof typeof pricing.monthly];

    const order = await this.razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { userId, plan, billingCycle: cycle }
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!
    };
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<boolean> {
    const crypto = require('crypto');
    
    const body = paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === paymentData.razorpay_signature;
  }
}

// Future: Add Stripe provider for international users
export class StripeProvider implements IPaymentProvider {
  async createOrder(plan: SubscriptionPlan, cycle: BillingCycle, userId: string): Promise<RazorpayOrderResponse> {
    // Implementation when needed
    throw new Error('Stripe provider not implemented yet');
  }

  async verifyPayment(paymentData: any): Promise<boolean> {
    // Implementation when needed
    throw new Error('Stripe provider not implemented yet');
  }
}

// Dependency Inversion: Service depends on abstraction
export class PaymentService {
  constructor(private provider: IPaymentProvider) {}

  async createPaymentOrder(
    plan: SubscriptionPlan, 
    cycle: BillingCycle, 
    userId: string
  ): Promise<RazorpayOrderResponse> {
    return await this.provider.createOrder(plan, cycle, userId);
  }

  async verifyPayment(paymentData: any): Promise<boolean> {
    return await this.provider.verifyPayment(paymentData);
  }
}

// Factory for payment providers
export const createPaymentService = (provider: 'razorpay' | 'stripe' = 'razorpay'): PaymentService => {
  switch (provider) {
    case 'razorpay':
      return new PaymentService(new RazorpayProvider());
    case 'stripe':
      return new PaymentService(new StripeProvider());
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
};

export const paymentService = createPaymentService('razorpay');
