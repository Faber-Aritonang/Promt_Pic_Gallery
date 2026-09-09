import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { PwaRegistration } from "@/components/layouts/PwaRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PromtPicGallery",
    template: "%s | PromtPicGallery",
  },
  description:
    "Text-to-image prompt template gallery with AI-powered refinement. Browse, customize, and generate with your favorite AI models.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PromtPic",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PromtPicGallery",
    title: "PromtPicGallery",
    description:
      "Text-to-image prompt template gallery with AI-powered refinement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromtPicGallery",
    description: "Text-to-image prompt template gallery with AI-powered refinement.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <PwaRegistration />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
