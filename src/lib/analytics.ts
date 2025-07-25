// Simple analytics for performance monitoring
export class Analytics {
  private static instance: Analytics;
  
  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Track user actions
  track(event: string, properties?: Record<string, any>) {
    if (typeof window === 'undefined') return;
    
    console.log(`[Analytics] ${event}`, properties);
    
    // In production, you'd send this to your analytics service
    // Example: amplitude, mixpanel, google analytics, etc.
  }

  // Track page views
  page(name: string, properties?: Record<string, any>) {
    this.track('Page View', { page: name, ...properties });
  }

  // Track performance metrics
  timing(name: string, duration: number) {
    this.track('Performance', { metric: name, duration });
  }

  // Track errors
  error(error: Error, context?: Record<string, any>) {
    this.track('Error', { 
      message: error.message, 
      stack: error.stack,
      ...context 
    });
  }
}

export const analytics = Analytics.getInstance();
