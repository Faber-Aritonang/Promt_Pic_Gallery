// Firebase client SDK setup (browser-side only).
// Server-side code should use lib/firebase-admin instead.
// See PRD Section 5.3 and Phase 1.2.

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasFirebaseConfig(config: Record<string, string | undefined>) {
  return Object.values(config).every((value) => value && value.length > 0);
}

// Only initialize when real credentials are present, so the app still runs
// (and tests/builds pass) before the Firebase project is wired up.
const app =
  getApps().length > 0 || !hasFirebaseConfig(firebaseConfig)
    ? (getApps()[0] ?? null)
    : initializeApp(firebaseConfig as Record<string, string>);

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

export { app };
