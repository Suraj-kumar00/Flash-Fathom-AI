"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus, Zap, Crown, Building, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { loadRazorpay } from "@/utils/get-razorpay";
import { useTheme } from "next-themes";
// ✅ ADDED: Import toast functionality
import { useToast } from "@/components/ui/use-toast";

// TypeScript interfaces
interface Feature {
  text: string;
  footnote?: string;
  negative?: boolean;
}

interface PricingItem {
  plan: string;
  tagline: string;
  quota: number;
  icon: React.ReactNode;
  popular: boolean;
  features: Feature[];
  price: {
    monthly: string;
    yearly: string;
  };
}

const PricingContent = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const { theme } = useTheme();
  // ✅ ADDED: Toast hook
  const { toast } = useToast();

  // Check if user was redirected here for upgrade
  const upgradeRequired = searchParams.get('upgrade') === 'required';
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    if (upgradeRequired) {
      toast({
        title: "🔒 Pro Access Required",
        description: "You need a Pro subscription to access this feature. Choose a plan below to continue.",
        variant: "default",
      });
    }
  }, [upgradeRequired, toast]);

  const handleSignUp = async (plan: string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (plan === "Free") {
      router.push("/generate");
      return;
    }

    setLoading(plan);

    try {
      // Load Razorpay script
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error('Razorpay failed to load');
      }

      // Map frontend plan names to backend plan names
      const planMapping: { [key: string]: string } = {
        'Basic': 'basic',
        'Pro': 'pro', 
        'Organizations': 'orgs'
      };

      const backendPlan = planMapping[plan] || plan.toLowerCase();

      console.log('🚀 Creating order for:', { plan, backendPlan, billingCycle });

      // ✅ ADDED: Show loading toast
      toast({
        title: "Setting up payment...",
        description: "Please wait while we prepare your payment.",
      });

      // Create order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan: backendPlan,
          billingCycle 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment setup failed');
      }

      const { orderId, amount, currency, keyId } = await response.json();

      console.log('✅ Order created:', { orderId, amount: `₹${amount/100}` });

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'FlashFathom AI',
        description: `${plan} Plan - ${billingCycle}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            console.log('💳 Payment completed, verifying...');
            
            // ✅ ADDED: Show verification toast
            toast({
              title: "Payment successful! 🎉",
              description: "Verifying your payment...",
            });
            
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: backendPlan,
                billingCycle,
              }),
            });

            if (verifyResponse.ok) {
              const result = await verifyResponse.json();
              console.log('✅ Payment verified:', result);
              
              // ✅ ADDED: Success toast
              toast({
                title: "🎉 Payment Verified Successfully!",
                description: `Welcome to ${plan} plan! Your subscription is now active.`,
                variant: "default",
              });
              
              // Redirect after a short delay to show toast
              setTimeout(() => {
                // If user was redirected here for upgrade, go back to original page
                if (redirectUrl) {
                  router.push(redirectUrl);
                } else {
                  router.push('/result?payment=success');
                }
              }, 2000);
            } else {
              const error = await verifyResponse.json();
              console.error('❌ Verification failed:', error);
              
              // ✅ ADDED: Verification failed toast
              toast({
                title: "❌ Payment Verification Failed",
                description: "Your payment was successful but verification failed. Please contact support.",
                variant: "destructive",
              });
              
              setTimeout(() => {
                router.push('/result?payment=failed');
              }, 2000);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            
            // ✅ ADDED: Verification error toast
            toast({
              title: "❌ Verification Error",
              description: "Something went wrong during payment verification. Please contact support.",
              variant: "destructive",
            });
            
            setTimeout(() => {
              router.push('/result?payment=failed');
            }, 2000);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#7C3AED',
        },
        modal: {
          ondismiss: function() {
            setLoading(null);
            // ✅ ADDED: Payment cancelled toast
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment. No charges were made.",
              variant: "default",
            });
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      
      // ✅ ADDED: Error toast instead of alert
      toast({
        title: "❌ Payment Setup Failed",
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Pricing items data (same as before)
  const pricingItems: PricingItem[] = [
    {
      plan: "Free",
      tagline: "Perfect for getting started.",
      quota: 10,
      icon: <Sparkles className="h-6 w-6" />,
      popular: false,
      features: [
        {
          text: "10 flashcards per month",
          footnote: "Create up to 10 flashcards monthly.",
        },
        {
          text: "Basic study modes",
          footnote: "Access to standard flashcard review modes.",
        },
        {
          text: "Limited analytics",
          footnote: "Basic progress tracking and statistics.",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
      price: {
        monthly: "0",
        yearly: "0",
      },
    },
    {
      plan: "Basic",
      tagline: "Great for students and learners.",
      quota: 500,
      icon: <Zap className="h-6 w-6" />,
      popular: false,
      features: [
        {
          text: "500 flashcards per month",
          footnote: "Create up to 500 flashcards monthly.",
        },
        {
          text: "Advanced study modes",
          footnote: "Access to spaced repetition and advanced review modes.",
        },
        {
          text: "Detailed analytics",
          footnote: "Comprehensive progress tracking and performance insights.",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Email support",
        },
      ],
      price: {
        monthly: "59",
        yearly: "590",
      },
    },
    {
      plan: "Pro",
      tagline: "Perfect for serious learners.",
      quota: 2000,
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      features: [
        {
          text: "2000 flashcards per month",
          footnote: "Create up to 2000 flashcards monthly.",
        },
        {
          text: "All study modes",
          footnote: "Access to all advanced study modes and features.",
        },
        {
          text: "Advanced analytics",
          footnote: "Detailed insights, learning patterns, and recommendations.",
        },
        {
          text: "Premium-quality responses",
          footnote: "Top-tier algorithmic responses for optimal content quality",
        },
        {
          text: "Priority support",
        },
        {
          text: "Export to PDF/Anki",
        },
      ],
      price: {
        monthly: "99",
        yearly: "990",
      },
    },
    {
      plan: "Organizations",
      tagline: "For teams and organizations.",
      quota: 10000,
      icon: <Building className="h-6 w-6" />,
      popular: false,
      features: [
        {
          text: "10,000 flashcards per month",
          footnote: "Create up to 10,000 flashcards monthly for your team.",
        },
        {
          text: "All Pro features",
          footnote: "Everything included in the Pro plan.",
        },
        {
          text: "Team management",
          footnote: "Manage multiple users and assign roles.",
        },
        {
          text: "Shared libraries",
          footnote: "Create and share flashcard decks across your organization.",
        },
        {
          text: "Advanced team analytics",
          footnote: "Team-wide progress tracking and reporting.",
        },
        {
          text: "24/7 Priority support",
        },
        {
          text: "Custom branding",
        },
        {
          text: "API access",
        },
      ],
      price: {
        monthly: "159",
        yearly: "1590",
      },
    },
  ];

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-6xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 dark:text-gray-400 sm:text-lg">
            Affordable plans that grow with your learning needs.
            Start free and upgrade anytime.
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center items-center space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg max-w-xs mx-auto">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all",
              billingCycle === "monthly"
                ? "bg-white dark:bg-gray-700 shadow text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all relative",
              billingCycle === "yearly"
                ? "bg-white dark:bg-gray-700 shadow text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              17% off
            </span>
          </button>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, quota, features, price, icon, popular }) => {
              return (
                <div
                  key={plan}
                  className={cn(
                    "relative rounded-2xl bg-white shadow-lg dark:bg-gray-800 transition-all duration-200 hover:shadow-xl",
                    {
                      "border-2 border-purple-500 shadow-purple-200 dark:shadow-purple-900 scale-105": popular,
                      "border border-gray-200 dark:border-gray-600": !popular,
                    }
                  )}
                >
                  {popular && (
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 px-3 py-2 text-sm font-medium text-white">
                      Most Popular
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={cn(
                        "p-3 rounded-full",
                        popular ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      )}>
                        {icon}
                      </div>
                    </div>
                    
                    <h3 className="my-3 text-center font-display text-2xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tagline}</p>
                    
                    <div className="text-center">
                      <span className="text-4xl font-bold">₹{price[billingCycle]}</span>
                      {plan !== "Free" && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    
                    {billingCycle === 'yearly' && plan !== "Free" && (
                      <p className="text-center text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ₹{(parseInt(price.monthly) * 12 - parseInt(price.yearly)).toString()}
                      </p>
                    )}
                  </div>

                  <div className="flex h-16 items-center justify-center border-b border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="flex items-center space-x-1">
                      <p className="dark:text-gray-300 text-sm">
                        {quota.toLocaleString()} flashcards/month
                      </p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="cursor-default ml-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          Maximum flashcards you can create per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className="my-6 space-y-4 px-6">
                    {features.map((feature) => {
                      const { text, footnote, negative = false } = feature;
                      return (
                        <li key={text} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            {negative ? (
                              <Minus className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                            ) : (
                              <Check className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          {footnote ? (
                            <div className="flex items-center space-x-1">
                              <p
                                className={cn("text-sm", {
                                  "text-gray-400 dark:text-gray-500": negative,
                                  "text-gray-700 dark:text-gray-300": !negative,
                                })}
                              >
                                {text}
                              </p>
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger className="cursor-default ml-1.5">
                                  <HelpCircle className="h-4 w-4 text-zinc-500" />
                                </TooltipTrigger>
                                <TooltipContent className="w-80 p-2">
                                  {footnote}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <p
                              className={cn("text-sm", {
                                "text-gray-400 dark:text-gray-500": negative,
                                "text-gray-700 dark:text-gray-300": !negative,
                              })}
                            >
                              {text}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600" />
                  <div className="p-6">
                    {plan === "Free" ? (
                      <Link
                        href="/generate"
                        className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 px-6 py-3 rounded-lg w-full text-center text-white font-medium inline-block transition-colors"
                      >
                        Get Started Free
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          "w-full px-6 py-3 rounded-lg font-medium transition-all",
                          popular 
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl" 
                            : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900",
                          loading === plan ? "opacity-50 cursor-not-allowed" : ""
                        )}
                        onClick={() => handleSignUp(plan)}
                        disabled={loading === plan}
                      >
                        {loading === plan ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            Choose {plan} <ArrowRight className="h-4 w-4 ml-2" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Pricing disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All prices are in Indian Rupees (₹). 
            <span className="text-green-600 dark:text-green-400 font-medium"> Limited time launch pricing - Up to 80% off regular rates!</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Cancel anytime • 7-day money back guarantee • No setup fees
          </p>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
};

export default Page;
