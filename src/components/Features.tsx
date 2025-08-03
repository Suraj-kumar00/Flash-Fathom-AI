"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Users, BookOpen, BarChart3, Shield, Sparkles, Clock, FileText, Smartphone, Cloud, Star } from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: <Brain className="h-8 w-8" />,
            title: "AI-Powered Generation",
            description: "Advanced AI algorithms analyze your content and automatically generate high-quality flashcards with key concepts and definitions.",
            color: "from-purple-500 to-violet-500"
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: "Instant Creation",
            description: "Upload your PDF or notes and get flashcards in seconds. No manual work required - just pure learning efficiency.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <BookOpen className="h-8 w-8" />,
            title: "Smart Study Modes",
            description: "Multiple study modes including spaced repetition, quiz mode, and practice tests to maximize retention.",
            color: "from-emerald-500 to-teal-500"
        },
        {
            icon: <BarChart3 className="h-8 w-8" />,
            title: "Progress Tracking",
            description: "Detailed analytics and progress tracking to monitor your learning journey and identify areas for improvement.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Collaborative Learning",
            description: "Share flashcard decks with friends, study groups, or the entire community. Learn together, achieve more.",
            color: "from-pink-500 to-rose-500"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Secure & Private",
            description: "Your data is encrypted and secure. We prioritize your privacy and ensure your study materials remain confidential.",
            color: "from-indigo-500 to-purple-500"
        }
    ];

    const stats = [
        { number: "1.2M+", label: "Flashcards Created" },
        { number: "35K+", label: "Active Users" },
        { number: "98%", label: "Success Rate" },
        { number: "4.9/5", label: "User Rating" }
    ];

    return (
        <section className="py-20 bg-background dark:bg-background" aria-label="Features">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-6"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Powerful Features</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl mb-6"
                    >
                        Everything you need to{" "}
                        <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                            learn faster
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                    >
                        FlashFathom AI combines cutting-edge technology with proven learning methods to create the ultimate study experience.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="relative h-full p-8 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} text-white mb-6 shadow-lg`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-semibold text-foreground mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative gradient */}
                                <div className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r ${feature.color} rounded-full`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-card border border-border rounded-2xl p-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-foreground mb-2">
                                {stat.number}
                            </div>
                            <div className="text-muted-foreground font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
