import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Eye, Zap, Copy, ArrowLeft, Lightbulb, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { Template } from "@/lib/types";
import { getTemplateById } from "@/lib/services/templates";

// Read directly from the server-side service instead of calling this app's API
// over HTTP. This keeps detail pages working on any local or Vercel port.
async function getTemplate(id: string): Promise<Template | null> {
  return getTemplateById(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = await getTemplate(id);
  if (!template) return { title: "Template Not Found" };
  return {
    title: template.title,
    description: template.description,
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getTemplate(id);

  if (!template) {
    return (
      <ShellLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Template Not Found</h1>
          <p className="text-muted-foreground">
            The template you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>
      </ShellLayout>
    );
  }

  const difficultyColors = {
    beginner: "bg-success/10 text-success border-success/20",
    intermediate: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
    advanced: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <ShellLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>

        {/* Title + meta */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className={difficultyColors[template.difficulty_level]}
            >
              {template.difficulty_level}
            </Badge>
            {template.category.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {template.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{template.description}</p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {template.views_count.toLocaleString()} views
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            {template.times_used} uses
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-current text-yellow-500" />
            {template.rating.toFixed(1)} rating
          </span>
        </div>

        <Separator className="mb-6" />

        {/* Image + Prompt */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Preview image */}
          <div className="relative overflow-hidden rounded-xl border bg-muted aspect-[4/3]">
            <Image
              src={template.original_image_url}
              alt={template.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Prompt card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Original Prompt
                </h2>
                <Badge variant="outline" className="text-xs">
                  {template.original_image_generated_with}
                </Badge>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
                {template.original_prompt}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(template.original_prompt);
                  }}
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Prompt
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/chat/${template.id}`}>
                    <Sparkles className="mr-2 h-3 w-3" />
                    Refine with AI
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Style tips */}
        {template.style_tips && (
          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-brand-orange" />
                Style Tips
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {template.style_tips}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Variations */}
        {template.variations_suggested.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-5">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Suggested Variations
              </h2>
              <ul className="space-y-2">
                {template.variations_suggested.map((v, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {v}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
