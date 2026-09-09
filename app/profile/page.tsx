"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Zap,
  Image as ImageIcon,
  Heart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  onAuthChange,
  getIdToken,
  type AuthUser,
} from "@/lib/services/auth";
import type { User } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setAuthUser(user);
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await getIdToken();
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "me" }),
        });
        const json = await res.json();
        if (json.success) {
          setProfile(json.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <ShellLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ShellLayout>
    );
  }

  if (!authUser) {
    return (
      <ShellLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Sign In Required</h1>
          <p className="text-muted-foreground">
            Please sign in to view your profile.
          </p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </ShellLayout>
    );
  }

  return (
    <ShellLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Profile header */}
        <div className="mb-8 flex items-center gap-4">
          {authUser.photoURL ? (
            <Image
              src={authUser.photoURL}
              alt={authUser.displayName ?? "User"}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">
              {(authUser.displayName ?? authUser.email ?? "U")[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {authUser.displayName ?? "User"}
            </h1>
            <p className="text-muted-foreground">{authUser.email}</p>
            <Badge variant="secondary" className="mt-1">
              Member since{" "}
              {profile
                ? new Date(profile.created_at).toLocaleDateString()
                : "..."}
            </Badge>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Stats */}
        {profile && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {profile.stats.total_images_generated}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Images Generated
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/10">
                    <Zap className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {profile.stats.total_versions_created}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Versions Created
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
                    <Heart className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {profile.stats.favorite_count}
                    </p>
                    <p className="text-xs text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Star className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {profile.stats.total_templates_created}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Templates Created
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="cursor-pointer transition-colors hover:bg-accent/50">
            <CardContent className="p-4 text-center" onClick={() => router.push("/gallery")}>
              <p className="font-semibold">My Favorites</p>
              <p className="text-sm text-muted-foreground">
                Browse your saved templates
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-accent/50">
            <CardContent className="p-4 text-center" onClick={() => router.push("/chat")}>
              <p className="font-semibold">My Versions</p>
              <p className="text-sm text-muted-foreground">
                View refined prompt versions
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-accent/50">
            <CardContent className="p-4 text-center" onClick={() => router.push("/gallery")}>
              <p className="font-semibold">Generation History</p>
              <p className="text-sm text-muted-foreground">
                See your generated images
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ShellLayout>
  );
}
