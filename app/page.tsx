"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageSquare,
  Palette,
  ArrowRight,
  Zap,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered Prompt Refinement
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/gallery">
              <Button size="lg" className="gap-2">
                <Globe className="h-4 w-4" />
                {t("home.browseGallery")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("home.startChat")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <Palette className="mb-2 h-8 w-8 text-blue-500" />
                <CardTitle>{t("nav.gallery")}</CardTitle>
                <CardDescription>
                  {t("gallery.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/gallery">
                  <Button variant="ghost" className="w-full gap-2">
                    {t("home.browseGallery")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <MessageSquare className="mb-2 h-8 w-8 text-green-500" />
                <CardTitle>{t("nav.chat")}</CardTitle>
                <CardDescription>
                  {t("chat.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/chat">
                  <Button variant="ghost" className="w-full gap-2">
                    {t("home.startChat")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <Zap className="mb-2 h-8 w-8 text-yellow-500" />
                <CardTitle>{t("imageGen.title")}</CardTitle>
                <CardDescription>
                  {t("imageGen.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/generate">
                  <Button variant="ghost" className="w-full gap-2">
                    {t("template.generateImage")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
