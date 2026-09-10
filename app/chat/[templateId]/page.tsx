import { ChatInterface } from "@/components/customize/ChatInterface";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { Template } from "@/lib/types";
import { getTemplateById } from "@/lib/services/templates";

// Read directly from the server-side service instead of calling this app's API
// over HTTP. This keeps template chat working on any local or Vercel port.
async function getTemplate(id: string): Promise<Template | null> {
  return getTemplateById(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> {
  const { templateId } = await params;
  const template = await getTemplate(templateId);
  if (!template) return { title: "Template Not Found" };
  return {
    title: `Refine: ${template.title}`,
    description: `Refine the prompt for "${template.title}" with AI assistance.`,
  };
}

export default async function TemplateChatPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = await getTemplate(templateId);

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

  return <ChatInterface template={template} />;
}
