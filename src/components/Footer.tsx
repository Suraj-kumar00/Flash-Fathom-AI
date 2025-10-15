"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Heart, ExternalLink, Zap } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/useSubscription";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isSignedIn } = useUser();
  const { canAccessPro } = useSubscription();

  return (
    <footer className="relative py-20 px-4 md:px-6 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100/80 dark:via-gray-900/20 dark:to-gray-800/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none" aria-hidden="true" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          
          {/* Brand Section - Enhanced */}
          <motion.div 
            className="mb-8 lg:mb-0 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link href="/" className="group flex items-center gap-3 mb-6">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div> */}
              <Image
                            src="/Flash-Fathom-AI-Logo.png"
                            width={32}
                            height={32}
                            alt="Logo"
                            className="h-8 w-8"
                          />{" "}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                FlashFathom AI
              </h2>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Transforming learning with AI-powered flashcards. Create, study, and master concepts faster than ever before.
            </p>

            <motion.div 
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by</span>
              <Link 
                href="https://x.com/surajk_umar01" 
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 flex items-center gap-1"
              >
                @surajk_umar01
                <ExternalLink className="h-3 w-3" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="https://x.com/compose/tweet?text=I%27ve%20been%20using%20%23FlashFathomAI%20share%20your%20thought%20%40surajk_umar01%20">
                <Button 
                  variant="secondary" 
                  className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Share Your Thoughts
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Links Grid - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 max-w-2xl">
            
            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mr-2"></div>
                Product
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/features", label: "Features" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/demo", label: "Demo" },
                  { href: isSignedIn ? (canAccessPro ? "/generate-pro" : "/generate") : "/sign-up", label: "Get Started" }

                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2"></div>
                Company
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social Links - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2"></div>
                Social
              </h3>
              <ul className="space-y-3">
                {[
                  { 
                    href: "https://github.com/Suraj-kumar00/Flash-Fathom-AI", 
                    label: "Github",
                    icon: <Github className="h-4 w-4" />
                  },
                  { 
                    href: "https://www.linkedin.com/in/surajkumar00/", 
                    label: "LinkedIn",
                    icon: <Linkedin className="h-4 w-4" />
                  },
                  { 
                    href: "https://x.com/surajk_umar01", 
                    label: "Twitter",
                    icon: <Twitter className="h-4 w-4" />
                  }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group"
                    >
                      <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links - Enhanced */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
                Legal
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/tos", label: "Terms of Service" },
                  { href: "/cookies", label: "Cookie Policy" },
                  { href: "/gdpr", label: "GDPR" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div> */}
          </div>
        </div>

        {/* Divider */}
        <motion.div 
          className="my-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        {/* Large Brand Text - Enhanced */}
        <motion.div 
          className="w-full flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-center text-3xl md:text-5xl lg:text-[8rem] xl:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-600 to-gray-900 dark:from-gray-600 dark:via-gray-400 dark:to-gray-200 select-none leading-none">
            FlashFathom AI
          </h1>
        </motion.div>

        {/* Bottom Section - Enhanced */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="w-full flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              © {currentYear} FlashFathom AI. All rights reserved.
            </p>
          </div>

          
          {/* <div className="flex items-center space-x-6 text-sm">
            <Link 
              href="/status" 
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-1"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              All systems operational
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span className="text-gray-600 dark:text-gray-400">
              Made with Next.js & AI
            </span>
          </div> */}
        </motion.div>
      </div>

      {/* Subtle background animation */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/5 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        aria-hidden="true"
      />
    </footer>
  );
}
