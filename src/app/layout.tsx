import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/ThemeProvider";
import Footer from "@/components/Footer";
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from "@/components/ui/toaster"
import BacktoTop from "@/components/BacktoTop";

// Disable static generation globally to avoid Clerk issues during build
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flash Fathom AI",
  description: "Building a flashcard generator web application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ If you need to access headers/cookies in layout, they're now async
  // const headersList = await headers();
  // const cookieStore = await cookies();

  // Validate Clerk publishable key
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is required in production. ' +
        'Please set this variable in your production environment.'
      );
    } else {
      // Development/test fallback with warning
      console.warn(
        '⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Using development fallback. ' +
        'Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env.local file for proper authentication.'
      );
    }
  }

  const publishableKey = clerkPublishableKey || 'pk_dev_fallback_please_set_env_var';

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.className)}
      >
        <ClerkProvider
          publishableKey={publishableKey}
          appearance={{
            variables: {
              colorPrimary: "#3371ff",
              fontSize: "16px",
            },
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <Toaster />
            {children}
            <Footer />
            <BacktoTop />
          </ThemeProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
