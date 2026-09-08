import { ChatInterface } from "@/components/customize/ChatInterface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Refinement Chat",
  description:
    "Refine your text-to-image prompts with AI-powered suggestions and real-time improvement tracking.",
};

export default function ChatPage() {
  return <ChatInterface template={null} />;
}
