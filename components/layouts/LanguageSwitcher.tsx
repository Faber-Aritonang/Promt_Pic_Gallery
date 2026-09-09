"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const localeLabels: Record<string, string> = {
  en: "English",
  id: "Indonesia",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function handleLocaleChange(newLocale: string) {
    // Set locale via cookie (next-intl uses cookie-based locale detection)
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    // Force a reload to apply the new locale
    router.refresh();
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[120px] border-slate-700 bg-slate-800">
        <Globe className="mr-1 h-3 w-3" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="border-slate-700 bg-slate-800">
        {Object.entries(localeLabels).map(([code, label]) => (
          <SelectItem key={code} value={code}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
