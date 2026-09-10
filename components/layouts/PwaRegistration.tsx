"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
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
