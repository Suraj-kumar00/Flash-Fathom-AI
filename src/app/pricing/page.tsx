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
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loadRazorpay } from "@/utils/get-razorpay";
import { useTheme } from "next-themes";

const Page = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { theme } = useTheme();

  const handleSignUp = async (plan: string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (plan === "Free") {
      router.push("/generate");
      return;
    }

    try {
      // Load Razorpay script
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error('Razorpay failed to load');
      }

      // Create order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, billingCycle }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment setup failed');
      }

      const { orderId, amount, currency, keyId } = await response.json();

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
                plan,
                billingCycle,
              }),
            });

            if (verifyResponse.ok) {
              router.push('/result?payment=success');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            router.push('/result?payment=failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#7C3AED', // Purple theme
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment setup failed. Please try again.');
    }
  };

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 10,
      features: [
        {
          text: "10 flashcards",
          footnote: "The maximum amount of flashcards.",
        },
        {
          text: "Basic study modes",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Limited analytics",
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
      plan: "Pro",
      tagline: "For larger projects with higher needs.",
      quota: 100,
      features: [
        {
          text: "100 flashcards",
          footnote: "The maximum amount of flashcards.",
        },
        {
          text: "Advanced study modes",
          footnote: "The maximum flashcards.",
        },
        {
          text: "Detailed analytics",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
      price: {
        monthly: "5",
        yearly: "50", // Discounted yearly price
      },
    },
    {
      plan: "Organizational",
      tagline: "For organizations with extensive needs.",
      quota: 500,
      features: [
        {
          text: "500 flashcards",
          footnote: "The maximum amount of flashcards.",
        },
        {
          text: "All study modes",
          footnote: "Access to all advanced study modes.",
        },
        {
          text: "Comprehensive analytics",
        },
        {
          text: "Premium-quality responses",
          footnote: "Top-tier algorithmic responses for optimal content quality",
        },
        {
          text: "24/7 Priority support",
        },
      ],
      price: {
        monthly: "15",
        yearly: "150", // Discounted yearly price
      },
    },
  ];

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-5xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 dark:text-gray-400 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-4 py-2 rounded-3xl text-sm font-medium",
              billingCycle === "monthly"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-4 py-2 rounded-3xl text-sm font-medium",
              billingCycle === "yearly"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            )}
          >
            Yearly
          </button>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, quota, features, price }) => {
              return (
                <div
                  key={plan}
                  className={cn(
                    "relative rounded-2xl bg-white shadow-lg dark:bg-gray-800",
                    {
                      "border-2 border-purple-600 shadow-blue-200": plan === "Pro",
                      "border border-gray-200 dark:border-gray-600": plan !== "Pro",
                    }
                  )}
                >
                  {plan === "Pro" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-cyan-300 px-3 py-2 text-sm font-medium text-white">
                      Upgrade now
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="my-3 text-center font-display text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{tagline}</p>
                    <p className="my-5 font-display text-6xl font-semibold">
                      ₹{price[billingCycle]}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      per {billingCycle}
                    </p>
                  </div>

                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-1">
                      <p className="dark:text-gray-400">
                        {quota.toLocaleString()} flashcard/mo included
                      </p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="cursor-default ml-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          How many flashcards you can create per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                          ) : (
                            <Check className="h-6 w-6 text-purple-500" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-gray-600 dark:text-gray-400", {
                                "text-gray-400 dark:text-gray-500": negative,
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
                            className={cn("text-gray-600 dark:text-gray-400", {
                              "text-gray-400 dark:text-gray-500": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 dark:border-gray-600" />
                  <div className="p-5">
                    {plan === "Free" ? (
                      <Link
                        href="/generate"
                        className={`bg-purple-700 px-4 py-2 rounded-lg w-full text-center text-white`}
                      >
                        Get Started
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full dark:bg-purple-700 dark:text-white dark:hover:bg-white dark:hover:text-black"
                        )}
                        onClick={() => handleSignUp(plan)}
                      >
                        Choose Plan <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
