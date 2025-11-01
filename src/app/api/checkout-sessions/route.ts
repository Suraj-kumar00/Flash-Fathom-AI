// Stripe support removed in favor of Razorpay.
export async function POST() {
  return new Response(JSON.stringify({ error: 'Stripe removed. Use Razorpay.' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function GET() {
  return new Response(JSON.stringify({ error: 'Stripe removed. Use Razorpay.' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  })
}
