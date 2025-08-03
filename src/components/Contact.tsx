"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, MapPin, Send, Clock, Globe, Twitter, Github, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call with a timeout
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random success/failure for demo
                    const success = Math.random() > 0.3; // 70% success rate
                    if (success) {
                        resolve("Message sent successfully");
                    } else {
                        reject(new Error("Failed to send message"));
                    }
                }, 2000);
            });

            // Success toast
            toast.success("🎉 Message sent successfully! We&apos;ll get back to you soon.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200",
            });

            // Reset form on success
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

        } catch (error) {
            // Error toast
            toast.error("❌ Failed to send message. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200",
            });

            console.error("Form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email Us",
            description: "Get in touch via email",
            value: "suraj.ukumar.p@gmail.com",
            action: "mailto:suraj.ukumar.p@gmail.com"
        },
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: "Live Chat",
            description: "Chat with our support team",
            value: "Available 9 AM - 6 PM EST",
            action: "#"
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: "Follow Us",
            description: "Stay updated on social media",
            value: "@flashfathom_ai",
            action: "https://x.com/surajk_umar01"
        }
    ];

    const socialLinks = [
        { icon: <Twitter className="h-5 w-5" />, href: "https://x.com/surajk_umar01", label: "Twitter" },
        { icon: <Github className="h-5 w-5" />, href: "https://github.com/Suraj-kumar00/Flash-Fathom-AI", label: "GitHub" },
        { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/surajkumar00/", label: "LinkedIn" }
    ];

    return (
        <section className="py-20 bg-background dark:bg-background" aria-label="Contact Us">
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
                        <MessageSquare className="h-4 w-4" />
                        <span>Get in Touch</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl mb-6"
                    >
                        Let&apos;s start a{" "}
                        <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                            conversation
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                    >
                        Have questions about FlashFathom AI? Want to share feedback? 
                        We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="bg-card border border-border rounded-2xl shadow-lg p-8"
                    >
                        <h3 className="text-2xl font-bold text-foreground mb-6">
                            Send us a message
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Contact Information - Rest remains the same */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-6">
                                Other ways to reach us
                            </h3>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start space-x-4 p-6 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-foreground mb-1">
                                                {info.title}
                                            </h4>
                                            <p className="text-muted-foreground text-sm mb-2">
                                                {info.description}
                                            </p>
                                            <a
                                                href={info.action}
                                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                                            >
                                                {info.value}
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Response Time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border rounded-2xl p-6"
                        >
                            <div className="flex items-center space-x-3 mb-3">
                                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h4 className="text-lg font-semibold text-foreground">
                                    Quick Response
                                </h4>
                            </div>
                            <p className="text-muted-foreground">
                                We typically respond to all inquiries within 24 hours during business days.
                            </p>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold text-foreground mb-4">
                                Follow us
                            </h4>
                            <div className="flex space-x-4">
                                {socialLinks.map((link, index) => (
                                    <motion.a
                                        key={index}
                                        href={link.href}
                                        className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label={link.label}
                                    >
                                        {link.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
