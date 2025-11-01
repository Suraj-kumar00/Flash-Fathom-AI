import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  "/flashcards(.*)",
  '/',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/pricing', 
  '/api/subscribe',
  '/api/razorpay/webhook'
])

export default clerkMiddleware(async (auth, request) => {
  // ✅ FIXED: Clerk v6 approach - check userId directly
  const { userId } = await auth()
  
  // Check authentication first
  if (!isPublicRoute(request) && !userId) {
    // Redirect to sign-in instead of using protect()
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }
  
  // Note: Pro access check moved to page component due to Prisma Edge Runtime limitations
  // The /generate-pro page will handle subscription validation server-side
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
