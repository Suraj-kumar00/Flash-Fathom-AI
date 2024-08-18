"use client";

import * as React from "react";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { setTheme } = useTheme();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center space-x-2 z-40 font-semibold">
            <img src="/flashfathomai.png" alt="Logo" className="h-8 w-8" /> {/* Adjust size as needed */}
            <span>FlashFathom AI.</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
