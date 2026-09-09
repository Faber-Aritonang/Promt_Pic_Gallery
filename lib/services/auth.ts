// Client-side Firebase Auth service.
// Handles Google OAuth sign-in, sign-out, and current user state.
// Server-side verification should use firebase-admin getAdminAuth().

import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ── Sign in with Google ────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars."
    );
  }

  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");

  const result = await signInWithPopup(auth, provider);
  return firebaseUserToAuthUser(result.user);
}

// ── Sign out ───────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

// ── Listen to auth state ───────────────────────────────────────────────────

export function onAuthChange(
  callback: (user: AuthUser | null) => void
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? firebaseUserToAuthUser(firebaseUser) : null);
  });
}

// ── Get ID token for server-side verification ──────────────────────────────

export async function getIdToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}

// ── Helper ─────────────────────────────────────────────────────────────────

function firebaseUserToAuthUser(user: FirebaseUser): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}
