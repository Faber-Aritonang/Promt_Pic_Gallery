import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PromtPicGallery",
    template: "%s | PromtPicGallery",
  },
  description:
    "Text-to-image prompt template gallery with AI-powered refinement. Browse, customize, and generate with your favorite AI models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
