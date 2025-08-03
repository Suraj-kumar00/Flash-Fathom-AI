'use client'

import { useRef, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FaqsCardProps {
    faqsList: {
        q: string;
        a: string;
    };
    idx: number;
}

const FaqsCard = ({ faqsList, idx }: FaqsCardProps) => {
    const answerElRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [answerHeight, setAnswerHeight] = useState("0px");

    const toggleAnswer = () => {
        const answerElHeight = answerElRef.current?.scrollHeight || 0;
        setIsOpen(!isOpen);
        setAnswerHeight(`${isOpen ? "0px" : `${answerElHeight}px`}`);
    };

    return (
        <motion.div
            className="group relative overflow-hidden"
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
        >
            <div className="relative p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-4">
                <button
                    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg"
                    onClick={toggleAnswer}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                >
                    <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed pr-4">
                            {faqsList.q}
                        </h4>
                        <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                {isOpen ? (
                                    <Minus className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <Plus className="h-4 w-4" aria-hidden="true" />
                                )}
                            </div>
                        </div>
                    </div>
                </button>
                
                <motion.div
                    ref={answerElRef}
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ height: answerHeight }}
                    id={`faq-answer-${idx}`}
                    aria-labelledby={`faq-question-${idx}`}
                >
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faqsList.a}
                        </p>
                    </div>
                </motion.div>

                {/* Decorative gradient bottom border */}
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-purple-500 to-violet-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </div>
        </motion.div>
    );
};

export default function FAQSection(): JSX.Element {
    const faqsList: { q: string; a: string }[] = [
        {
            "q": "How does the AI turn my content into flashcards?",
            "a": "Our AI scans your content, picks out the most important ideas and terms, and turns them into flashcards that help boost your learning."
        },
        {
            "q": "Can I personalize my flashcards?",
            "a": "Absolutely! You can tweak the questions, answers, and even add your own notes to make the flashcards fit your unique study style."
        },
        {
            "q": "Is there a limit on flashcards?",
            "a": "With the Basic plan, you can make up to 100 flashcards. Pro and Enterprise plans unlock limitless flashcard creation!"
        },
        {
            "q": "Do you offer study modes?",
            "a": "Yes! Explore different study modes like spaced repetition, quizzes, and practice tests to strengthen your knowledge."
        },
        {
            "q": "Can I share my flashcards?",
            "a": "Definitely! Share your flashcards with friends, study groups, or even publish them for others to benefit from."
        }
    ];

    return (
        <section className="leading-relaxed max-w-4xl mt-20 mx-auto px-6 lg:px-8" aria-label="Frequently Asked Questions">
            {/* Enhanced Header Section */}
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-6"
                >
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Got Questions?</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl mb-6"
                >
                    Frequently Asked{" "}
                    <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                        Questions
                    </span>
                </motion.h2>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
                >
                    Have more questions? Check out our answers below or contact us for
                    further assistance.
                </motion.p>
            </div>

            {/* Enhanced FAQ Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
                className="space-y-4"
            >
                {faqsList.map((item, idx) => (
                    <FaqsCard key={idx} idx={idx} faqsList={item} />
                ))}
            </motion.div>

            {/* Enhanced Bottom CTA
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mt-16 text-center"
            >
                <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Can't find the answer you're looking for? Please chat with our friendly team.
                    </p>
                    <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                        Get in touch
                    </button>
                </div>
            </motion.div> */}
        </section>
    );
}
