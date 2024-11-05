'use client'

import { useRef, useState } from "react";
import { motion } from "framer-motion";

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
            className="space-y-3 mt-5 overflow-hidden border-b border-muted"
            key={idx}
            onClick={toggleAnswer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
            <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-foreground font-medium">
                {faqsList.q}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        />
                    )}
                </svg>
            </h4>
            <div
                ref={answerElRef}
                className="duration-300"
                style={{ height: answerHeight }}
            >
                <div>
                    <p className="text-muted-foreground">{faqsList.a}</p>
                </div>
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
        <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8">
            <div className="space-y-3 text-center">
                <h1 className="text-3xl text-foreground font-semibold">
                    Frequently Asked Questions
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                    Have more questions? Check out our answers below or contact us for
                    further assistance.
                </p>
            </div>
            <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-14 max-w-2xl mx-auto">
                {faqsList.map((item, idx) => (
                    <FaqsCard key={idx} idx={idx} faqsList={item} />
                ))}
            </motion.div>
        </section>
    );
}