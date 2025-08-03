"use client";

import { motion } from "framer-motion";
import { Target, Users, Lightbulb, Award, Heart, Globe, Zap } from "lucide-react";

const About = () => {
    const values = [
        {
            icon: <Target className="h-6 w-6" />,
            title: "Mission-Driven",
            description: "We&apos;re on a mission to make learning accessible, efficient, and enjoyable for everyone."
        },
        {
            icon: <Lightbulb className="h-6 w-6" />,
            title: "Innovation First",
            description: "Constantly pushing the boundaries of what&apos;s possible with AI-powered education technology."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community Focused",
            description: "Building a global community of learners who support and inspire each other."
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Excellence",
            description: "Committed to delivering the highest quality learning experience through continuous improvement."
        }
    ];

    const team = [
        {
            name: "Suraj",
            role: "Creator of FlashFathom AI",
            bio: "Passionate about leveraging AI to revolutionize education and make learning more efficient.",
            social: "https://x.com/surajk_umar01"
        }
    ];

    return (
        <section className="py-20 bg-background dark:bg-background" aria-label="About Us">
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
                        <Heart className="h-4 w-4" />
                        <span>About FlashFathom AI</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl mb-6"
                    >
                        Transforming the way{" "}
                        <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                            people learn
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                    >
                        We believe that learning should be efficient, engaging, and accessible to everyone. 
                        That&apos;s why we created FlashFathom AI - to harness the power of artificial intelligence 
                        and make studying more effective than ever before.
                    </motion.p>
                </div>

                {/* Story Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-12 items-center mb-20"
                >
                    <div>
                        <h3 className="text-3xl font-bold text-foreground mb-6">
                            Our Story
                        </h3>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                FlashFathom AI was born from a simple observation: students spend countless hours 
                                creating flashcards manually, when they could be focusing on actually learning the material.
                            </p>
                            <p>
                                Our founder, frustrated with the time-consuming process of creating study materials, 
                                envisioned a world where AI could instantly transform any content into effective 
                                learning tools.
                            </p>
                            <p>
                                Today, FlashFathom AI serves over 35,000 students and professionals worldwide, 
                                helping them learn faster and retain information better through intelligent, 
                                AI-generated flashcards.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="h-10 w-10 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground mb-2">
                                    1.2M+ Flashcards Created
                                </h4>
                                <p className="text-muted-foreground">
                                    Helping students master concepts across every subject
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Values Section */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                            Our Values
                        </h3>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
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
                                className="text-center p-6 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                    {value.icon}
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">
                                    {value.title}
                                </h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                        Meet the Team
                    </h3>
                    <p className="text-xl text-muted-foreground mb-12">
                        The people behind FlashFathom AI
                    </p>

                    <div className="flex justify-center">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-sm"
                            >
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    SK
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-1">
                                    {member.name}
                                </h4>
                                <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
                                    {member.role}
                                </p>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {member.bio}
                                </p>
                                <a
                                    href={member.social}
                                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Follow on X →
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
