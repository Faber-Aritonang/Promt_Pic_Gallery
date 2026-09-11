// Server-side auth helper.
// Verifies Firebase ID tokens from Authorization header or cookies.
// Used in Route Handlers to identify the current user.

import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import type { User } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ServerUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ── Verify ID token from request ───────────────────────────────────────────

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns the decoded user if valid, or null if not authenticated.
 */
export async function verifyAuthToken(
  request: Request
): Promise<ServerUser | null> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.slice(7);
    if (!token) return null;

    const adminAuth = await getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
      photoURL: decoded.picture ?? null,
    };
  } catch (error) {
    // Invalid or expired token
    console.warn("[auth] Token verification failed:", error);
    return null;
  }
}

/**
 * Verify token and require authentication.
 * Returns user or throws 401 Response.
 */
export async function requireAuth(
  request: Request
): Promise<ServerUser> {
  const user = await verifyAuthToken(request);
  if (!user) {
    throw new Response(
      JSON.stringify({
        success: false,
        error: "Authentication required",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return user;
}

// ── User profile helpers ───────────────────────────────────────────────────

/**
 * Get or create a user profile in Firestore.
 */
export async function getOrCreateUser(
  firebaseUser: ServerUser
): Promise<User> {
  const db = getAdminDb();
  const userRef = db.collection("users").doc(firebaseUser.uid);
  const doc = await userRef.get();

  if (doc.exists) {
    return { id: doc.id, ...doc.data() } as User;
  }

  // Create new user profile
  const now = Date.now();
  const newUser: Omit<User, "id"> = {
    username: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "user",
    email: firebaseUser.email ?? "",
    avatar_url: firebaseUser.photoURL ?? "",
    stats: {
      total_templates_created: 0,
      total_versions_created: 0,
      total_images_generated: 0,
      favorite_count: 0,
    },
    created_at: now,
    updated_at: now,
  };

  await userRef.set(newUser);
  return { id: firebaseUser.uid, ...newUser };
}

/**
 * Update user profile in Firestore.
 */
export async function updateUser(
  uid: string,
  updates: Partial<Omit<User, "id" | "created_at">>
): Promise<User> {
  const db = getAdminDb();
  const userRef = db.collection("users").doc(uid);

  await userRef.update({
    ...updates,
    updated_at: Date.now(),
  });

  const doc = await userRef.get();
  return { id: doc.id, ...doc.data() } as User;
}
