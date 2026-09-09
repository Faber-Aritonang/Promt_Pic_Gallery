"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User, Loader2 } from "lucide-react";
import {
  signInWithGoogle,
  signOut,
  onAuthChange,
  type AuthUser,
} from "@/lib/services/auth";

export function AuthButton() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = useCallback(async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
      // Show user-friendly error
      const message =
        error instanceof Error ? error.message : "Sign in failed";
      if (!message.includes("popup-closed")) {
        alert(message);
      }
    } finally {
      setSigningIn(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignIn}
        disabled={signingIn}
        className="gap-2"
      >
        {signingIn ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline-block max-w-[120px] truncate text-sm">
            {user.displayName ?? user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
