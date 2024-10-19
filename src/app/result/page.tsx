'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Session {
    payment_status: string;
    // Add other session properties as needed
}

export default function ResultPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return
            try {
                const res = await fetch(`/api/checkout-sessions?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError('An error occurred while retrieving the session.')
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Payment Result</h1>
                <Link href="/flashcards">
                    <Button>Back to Flashcards</Button>
                </Link>
            </div>
            <Card className="lg:hover:scale-[1.02] duration-200 transition ease-in-out">
                <CardContent className="p-6">
                    {error ? (
                        <p className="text-xl text-red-500">{error}</p>
                    ) : session?.payment_status === 'paid' ? (
                        <>
                            <h2 className="text-2xl text-primary mb-4">Thank you for your purchase!</h2>
                            <p className="text-lg mb-2">Session ID: {session_id}</p>
                            <p className="text-muted-foreground">
                                We have received your payment. You will receive an email with the order details shortly.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl text-primary mb-4">Payment failed</h2>
                            <p className="text-muted-foreground">
                                Your payment was not successful. Please try again.
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}