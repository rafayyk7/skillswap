import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SkillSwap — Learn a skill. Teach a skill. Swap knowledge.",
    template: "%s | SkillSwap",
  },
  description:
    "SkillSwap is a global community where people exchange knowledge instead of money. Teach what you know, learn what you don't.",
  keywords: ["skill swap", "peer learning", "knowledge exchange", "learn skills", "teach skills"],
  openGraph: {
    title: "SkillSwap — Learn a skill. Teach a skill. Swap knowledge.",
    description: "A global community where knowledge is exchanged, not bought.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

