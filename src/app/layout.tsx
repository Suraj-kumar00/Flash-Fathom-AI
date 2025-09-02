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
import { ToastContainer } from 'react-toastify'
import { Toaster } from "@/components/ui/toaster"
import BacktoTop from "@/components/BacktoTop";

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

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.className)}
      >
        <ClerkProvider
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
            <ToastContainer />
          </ThemeProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
