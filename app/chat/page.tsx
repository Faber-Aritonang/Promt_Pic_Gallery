"use client";

import { useTranslations } from "next-intl";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { ChatInterface } from "@/components/customize/ChatInterface";

export default function ChatPage() {
  const t = useTranslations("chat");

  return (
    <ShellLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <ChatInterface />
      </div>
    </ShellLayout>
  );
}
