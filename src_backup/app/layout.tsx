import type { Metadata } from "next";
import { Prompt, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-sans",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const gothic = Cinzel_Decorative({
  variable: "--font-gothic",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "157 TATTOO | Booking & Management",
  description: "Official booking and management portal for 157 TATTOO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} ${gothic.variable} font-sans antialiased bg-background-dark text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
