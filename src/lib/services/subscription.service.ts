import { prisma } from '@/lib/database';

export interface SubscriptionStatus {
  isActive: boolean;
  plan: string;
  expiresAt: Date | null;
  isExpired: boolean;
  canAccessPro: boolean;
}

export class SubscriptionService {
  /**
   * Check if user has active subscription
   */
  async getUserSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: {
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionEndsAt: true,
          subscriptionStartedAt: true
        }
      });

      if (!user) {
        console.log(`⚠️ User not found in database: ${userId}`);
        return {
          isActive: false,
          plan: 'free',
          expiresAt: null,
          isExpired: false,
          canAccessPro: false
        };
      }

      const now = new Date();
      const isExpired = user.subscriptionEndsAt ? user.subscriptionEndsAt < now : false;
      const isActive = user.subscriptionStatus === 'active' && !isExpired;
      const canAccessPro = isActive && ['basic', 'pro', 'orgs'].includes(user.subscriptionPlan || 'free');

      console.log(`🔍 Subscription status for ${userId}:`, {
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        isActive,
        isExpired,
        canAccessPro,
        endsAt: user.subscriptionEndsAt
      });

      return {
        isActive,
        plan: user.subscriptionPlan || 'free',
        expiresAt: user.subscriptionEndsAt,
        isExpired,
        canAccessPro
      };

    } catch (error) {
      console.error('❌ Error checking subscription status:', error);
      return {
        isActive: false,
        plan: 'free',
        expiresAt: null,
        isExpired: false,
        canAccessPro: false
      };
    }
  }

  /**
   * Check if user can access Pro features
   */
  async canAccessProFeatures(userId: string): Promise<boolean> {
    const status = await this.getUserSubscriptionStatus(userId);
    return status.canAccessPro;
  }

  /**
   * Get user's current plan
   */
  async getUserPlan(userId: string): Promise<string> {
    const status = await this.getUserSubscriptionStatus(userId);
    return status.plan;
  }

  /**
   * Check if subscription is expired
   */
  async isSubscriptionExpired(userId: string): Promise<boolean> {
    const status = await this.getUserSubscriptionStatus(userId);
    return status.isExpired;
  }

  /**
   * Update subscription status (for webhook use)
   */
  async updateSubscriptionStatus(
    userId: string, 
    plan: string, 
    status: string, 
    expiresAt: Date
  ): Promise<void> {
    try {
      await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          subscriptionPlan: plan,
          subscriptionStatus: status,
          subscriptionEndsAt: expiresAt,
          updatedAt: new Date()
        }
      });

      console.log('✅ Subscription status updated:', { userId, plan, status });
    } catch (error) {
      console.error('❌ Error updating subscription status:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
