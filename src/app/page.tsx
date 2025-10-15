"use client";

import Image from "next/image";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import FAQ from "@/components/FAQ";
import Noise from "@/components/noise";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/useSubscription";


const avatars = [
    { src: "https://randomuser.me/api/portraits/women/68.jpg", alt: "Sarah, Marketing Manager" },
    { src: "https://randomuser.me/api/portraits/men/45.jpg", alt: "John, Software Engineer" },
    { src: "https://randomuser.me/api/portraits/women/12.jpg", alt: "Emma, UX Designer" }
];

export default function Home() {
    const { isSignedIn } = useUser();
    const { canAccessPro } = useSubscription();
    
    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Toast Notification Container */}
            <ToastContainer />
            <Noise />

            {/* Hero Section - Enhanced with better visual hierarchy */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="z-10"
            >
                <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center px-4">
                    {/* Enhanced announcement badge with better styling */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="mx-auto mb-6 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-purple-200/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:border-purple-700/50 dark:from-purple-900/20 dark:to-blue-900/20 px-8 py-3 shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:scale-105"
                        role="banner"
                        aria-label="FlashFathom AI announcement"
                    >
                        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            FlashFathom AI is now public!
                        </p>
                    </motion.div>

                    {/* Enhanced main heading with better typography hierarchy */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h1 className="max-w-5xl text-5xl font-extrabold md:text-6xl lg:text-7xl xl:text-8xl text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                            Flashcards instantly{" "}
                            <span className="relative">
                                <span className="text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text">
                                    wisdom,
                                </span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                                    aria-hidden="true"
                                />
                            </span>{" "}
                            endlessly.
                        </h1>
                    </motion.div>

                    {/* Enhanced subtitle with better spacing */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed"
                    >
                        FlashFathom AI lets you create powerful flashcards in
                        seconds. Just upload your notes and start mastering
                        concepts faster, with AI that helps you understand more
                        deeply.
                    </motion.p>

                    {/* Enhanced CTA section with improved accessibility */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
                    >
                        <Link
                            className={`group relative overflow-hidden bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white dark:from-purple-600 dark:to-purple-500 dark:hover:from-purple-500 dark:hover:to-purple-400 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${buttonVariants({
                                size: "lg",
                            })}`}
                            href={isSignedIn ? (canAccessPro ? "/generate-pro" : "/generate") : "/sign-up"}
                            aria-label="Get started with FlashFathom AI"
                        >
                            <span className="relative z-10 flex items-center">
                                {isSignedIn ? (canAccessPro ? "Go to Pro Generator" : "Generate Flashcards") : "Get started"}
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                        </Link>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2"
                            aria-label="Join our community of creators"
                        >
                            <div className="flex -space-x-2" role="img" aria-label="User avatars">
                                {avatars.map((avatar, index) => (
                                    <Image
                                        key={index}
                                        src={avatar.src} 
                                        alt={avatar.alt} 
                                        width={32} 
                                        height={32} 
                                        className="rounded-full border-2 border-white dark:border-gray-800" 
                                    />
                                ))}
                            </div>
                            <span>Join 100+ creators</span>
                        </motion.div>
                    </motion.div>
                </MaxWidthWrapper>

                {/* Enhanced Product Preview Section */}
                <section className="relative isolate mt-16 sm:mt-24" aria-label="Product showcase">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        {/* Animated background elements */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        >
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.7, 0.3],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                                style={{
                                    clipPath:
                                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                                }}
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            />
                        </div>

                        {/* Enhanced product showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="mx-auto max-w-7xl px-6 lg:px-8"
                        >
                            <div className="mt-16 flow-root sm:mt-24">
                                <div className="relative -m-2 rounded-2xl bg-gradient-to-br from-gray-900/5 to-purple-900/10 dark:from-gray-800/50 dark:to-purple-800/20 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-3xl lg:p-4 backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl lg:rounded-3xl" />
                                    <Image
                                        src="/FlashCard-Generate.png"
                                        alt="FlashFathom AI product preview - AI-powered flashcard generation interface"
                                        width={1364}
                                        height={866}
                                        quality={100}
                                        className="rounded-xl bg-white dark:bg-gray-900 p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 lg:rounded-2xl transform hover:scale-[1.02] transition-transform duration-700"
                                    />
                                    {/* Floating elements for visual enhancement */}
                                    <motion.div
                                        animate={{ y: [-10, 10, -10] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-60"
                                        aria-hidden="true"
                                    />
                                    <motion.div
                                        animate={{ y: [10, -10, 10] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-40"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Enhanced Feature Section */}
                <section 
                    className="mx-auto mb-32 mt-32 max-w-6xl sm:mt-56"
                    aria-label="Features"
                >
                    <div className="mb-16 px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-6"
                            >
                                <Brain className="h-4 w-4" aria-hidden="true" />
                                <span>Powered by AI</span>
                            </motion.div>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl mb-6"
                            >
                                Start creating flashcards in{" "}
                                <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                                    seconds
                                </span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                            >
                                Creating flashcards from your PDF files has
                                never been easier than with FlashFathom AI
                            </motion.p>
                        </div>
                    </div>

                    {/* Enhanced Steps with modern card design */}
                    <div className="grid md:grid-cols-3 gap-8 px-6 lg:px-8">
                        {[
                            {
                                step: 1,
                                icon: <Brain className="h-8 w-8" aria-hidden="true" />,
                                title: "Sign up for an account",
                                description: "Either starting out with a free plan or choose our pro plan.",
                                color: "from-purple-500 to-violet-500"
                            },
                            {
                                step: 2,
                                icon: <Zap className="h-8 w-8" aria-hidden="true" />,
                                title: "Upload your PDF file",
                                description: "We'll process your file and make it ready for you to create flashcards with it.",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                step: 3,
                                icon: <Sparkles className="h-8 w-8" aria-hidden="true" />,
                                title: "Start creating flashcards by typing",
                                description: "It's that simple. Try out FlashFathom AI today",
                                color: "from-emerald-500 to-teal-500"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                    ease: "easeOut"
                                }}
                                viewport={{ once: true }}
                                className="group relative"
                                role="article"
                                tabIndex={0}
                            >
                                <div className="relative h-full p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2">
                                    {/* Step number with gradient background */}
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} text-white font-bold text-lg mb-6 shadow-lg`}>
                                        {item.step}
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${item.color} text-white mb-6 shadow-lg`}>
                                        {item.icon}
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        {item.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                    
                                    {/* Decorative gradient */}
                                    <div className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r ${item.color} rounded-full`} aria-hidden="true" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Enhanced FAQ Section */}
                <motion.section
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="relative"
                    aria-label="Frequently asked questions"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent dark:via-purple-900/10 pointer-events-none" aria-hidden="true" />
                    <FAQ />
                </motion.section>
            </motion.div>
        </div>
    );
}
