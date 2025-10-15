"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface SubscriptionStatus {
  isActive: boolean;
  plan: string;
  expiresAt: string | null;
  isExpired: boolean;
  canAccessPro: boolean;
  loading: boolean;
}

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    plan: 'free',
    expiresAt: null,
    isExpired: false,
    canAccessPro: false,
    loading: true
  });

  useEffect(() => {
    if (!isLoaded || !user) {
      setSubscription(prev => ({ ...prev, loading: false }));
      return;
    }

    fetchSubscriptionStatus();
  }, [isLoaded, user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/user/subscription-status');
      if (response.ok) {
        const data = await response.json();
        setSubscription({
          ...data,
          loading: false
        });
      } else {
        setSubscription(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscription(prev => ({ ...prev, loading: false }));
    }
  };

  const refreshSubscription = () => {
    setSubscription(prev => ({ ...prev, loading: true }));
    fetchSubscriptionStatus();
  };

  return {
    ...subscription,
    refreshSubscription
  };
}
