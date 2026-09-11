"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    // Identifies the bundle this tab is running — useful when a deployed fix
    // appears to have no effect because the page was never fully reloaded.
    console.log(`[app] build ${process.env.NEXT_PUBLIC_BUILD_SHA ?? "local"}`);

    // Skip registration in development: the Next.js dev server already handles
    // hot reloading, and a service worker here can cache and serve stale
    // bundles that break the app after code changes.
    if (process.env.NODE_ENV === "development") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.warn("[PWA] Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
