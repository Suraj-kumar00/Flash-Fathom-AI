"use client";

import * as React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper"; 
import { buttonVariants } from "./ui/button"; 
const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white/75 backdrop-blur-lg py-4">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-between sm:flex-row">
          {/* Copyright Text */}
          <span className="text-lg text-gray-500">
            &copy; {new Date().getFullYear()} @flashfathom ai. 2024 All rights reserved.
          </span>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="https://github.com/Suraj-kumar00/Flash-Fathom-AI" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <Github className="h-5 w-5 text-purple-600" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://x.com/surajk_umar01" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <Twitter className="h-5 w-5 text-purple-600" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://www.linkedin.com/in/surajkumar00/" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <Linkedin className="h-5 w-5 text-purple-600" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
