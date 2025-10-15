'use client'

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'

// Stripe is removed; keep only simple status via query param

// ✅ FIXED: Separate component for search params logic
function ResultContent() {
    const searchParams = useSearchParams()
    const payment = searchParams.get('payment') // success | failed
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
    const resolveResult = () => {
      if (payment === 'success' || payment === 'failed') {
        setLoading(false)
        return
      }
      setError('Missing payment status')
      setLoading(false)
    }
    resolveResult()
  }, [payment])

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Processing payment result...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />
                    Payment Result
                </h1>
                <Link href="/flashcards">
                    <Button className="w-full sm:w-auto">Back to Flashcards</Button>
                </Link>
            </div>
            
            <Card className="lg:hover:scale-[1.02] duration-200 transition ease-in-out">
                <CardContent className="p-6 sm:p-8">
                    {error ? (
                        <div className="text-center space-y-4">
                            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-2">
                                    Payment Error
                                </h2>
                                <p className="text-red-500 mb-4">{error}</p>
                                <Link href="/pricing">
                                    <Button variant="outline">Try Again</Button>
                                </Link>
                            </div>
                        </div>
                    ) : payment === 'success' ? (
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <div>
                                <h2 className="text-xl sm:text-2xl text-green-600 font-semibold mb-4">
                                    Thank you for your purchase! 🎉
                                </h2>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                                    <p className="text-muted-foreground text-sm sm:text-base">
                                        We have received your payment successfully. You will receive an email with the order details shortly.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/flashcards">
                                        <Button className="w-full sm:w-auto">
                                            Start Creating Flashcards
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                            <div>
                                <h2 className="text-xl sm:text-2xl text-red-600 font-semibold mb-4">
                                    Payment Failed
                                </h2>
                             <p className="text-muted-foreground mb-4">Your payment failed. Please try again.</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/pricing">
                                        <Button className="w-full sm:w-auto">Try Again</Button>
                                    </Link>
                                    <Link href="/support">
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            Contact Support
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// ✅ FIXED: Fallback component for loading state
function ResultSkeleton() {
    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-10 w-full sm:w-40" />
            </div>
            
            <Card>
                <CardContent className="p-6 sm:p-8">
                    <div className="text-center space-y-4">
                        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64 mx-auto" />
                            <Skeleton className="h-4 w-48 mx-auto" />
                            <Skeleton className="h-4 w-56 mx-auto" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Skeleton className="h-10 w-full sm:w-40" />
                            <Skeleton className="h-10 w-full sm:w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ✅ FIXED: Main page component with Suspense
export default function ResultPage() {
    return (
        <Suspense fallback={<ResultSkeleton />}>
            <ResultContent />
        </Suspense>
    );
}
