import { SiteConfig } from "@/types";

const site_url = process.env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "AI Flashcards App",
  description:
    "AI Flashcards App is a flashcard app that uses Gemini API to generate flashcards. Users can create flashcards based ona topic. The app is powered by Next.js and Tailwind CSS.",
  url: "site_url",
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "",
    github: "",
    portfolio: "",
  },
  mailSupport: "",
};