import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <ShellLayout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">404</h1>
              <p className="mt-2 text-lg font-semibold">Page Not Found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="default" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/gallery">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Gallery
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShellLayout>
  );
}
