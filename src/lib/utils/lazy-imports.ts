import { lazy } from 'react';

// ✅ FIXED: Only lazy load components that actually exist in your codebase

// Lazy load your actual core components
export const LazyFlashcard = lazy(() => 
  import('@/components/core/flash-card')
);

export const LazyGenerate = lazy(() => 
  import('@/components/core/generate')
);

export const LazyFAQ = lazy(() => 
  import('@/components/FAQ')
);

// Lazy load your actual pricing page
export const LazyPricingPage = lazy(() => 
  import('@/app/pricing/page')
);

// ✅ FIXED: Changed 'module' to 'razorpayModule' to avoid reserved variable name
export const loadRazorpayScript = async () => {
  try {
    const razorpayModule = await import('@/utils/get-razorpay'); // ✅ CHANGED: module → razorpayModule
    return razorpayModule.loadRazorpay();
  } catch (error) {
    console.error('Failed to load Razorpay script:', error);
    return false;
  }
};

// Simple lazy loading for dynamic imports without complex fallbacks
export const createSimpleLazy = (importPath: string) => {
  return lazy(() => import(importPath));
};
