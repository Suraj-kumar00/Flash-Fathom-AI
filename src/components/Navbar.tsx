"use client";

import * as React from "react";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs"; // Added useUser
import { ThemeToggle } from "./DarkToggle";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { isSignedIn } = useUser(); // Get user's sign-in state

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-primary-foreground backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center space-x-2 z-40 font-semibold">
            <img src="/flashfathomai.png" alt="Logo" className="h-8 w-8" /> {/* Adjust size as needed */}
            <span>FlashFathom AI.</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Other Nav Links */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>
              {/* Show Sign-in and Sign-up only if the user is not signed in */}
              {!isSignedIn && (
                <>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className={`bg-purple-700 text-white px-4 py-2 rounded ${buttonVariants(
                      {
                        size: "sm",
                      }
                    )}`}
                  >
                    Sign Up
                    <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Link>
                </>
              )}
            </div>
            {/* User profile and logout button */}
            {isSignedIn && <UserButton showName afterSignOutUrl="/" />} 
            <ThemeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
