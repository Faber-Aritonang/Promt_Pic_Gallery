import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Firebase",
  "React Query",
  "GLM-3 (Phase 3)",
];

const phases = [
  { n: "Phase 1", title: "Foundation & Setup", state: "active" },
  { n: "Phase 2", title: "Gallery & Database", state: "upcoming" },
  { n: "Phase 3", title: "AI Chat Integration", state: "upcoming" },
  { n: "Phase 4", title: "Image Generation", state: "upcoming" },
  { n: "Phase 5", title: "Testing & Deployment", state: "upcoming" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <Badge variant="secondary" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-success" />
          Foundation ready
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          PromtPicGallery
        </h1>
        <p className="text-muted-foreground">
          Text-to-image prompt template gallery with AI-powered refinement.
          Browse templates, chat with GLM-3 to improve your prompt, and
          generate images with the model of your choice.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {stack.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/api">Check API health</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="https://github.com/vercel/next.js" target="_blank">
            Docs
          </Link>
        </Button>
      </div>

      <ol className="grid w-full max-w-xl gap-2">
        {phases.map((phase) => (
          <li
            key={phase.n}
            className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm"
          >
            <span className="flex items-center gap-3 font-medium">
              <span className="text-muted-foreground">{phase.n}</span>
              {phase.title}
            </span>
            <Badge
              variant={phase.state === "active" ? "default" : "secondary"}
            >
              {phase.state === "active" ? "In progress" : "Planned"}
            </Badge>
          </li>
        ))}
      </ol>
    </main>
  );
}
