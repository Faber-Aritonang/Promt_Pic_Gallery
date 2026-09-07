// Firebase Admin SDK (server-side only).
// Use this in Route Handlers, Server Actions, and any code that runs on the server.
// For browser-side code, use lib/firebase instead.
//
// Initialization priority:
//   1. FIREBASE_SERVICE_ACCOUNT env var (JSON string) — for local dev / self-hosted
//   2. Application Default Credentials (ADC) — for Vercel, GCP Cloud Run, etc.
//
// See PRD Section 5.3 and Phase 1.2.

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
// Storage: use Cloudinary (lib/cloudinary.ts) instead of Firebase Storage.

// ── Lazy-initialized singletons ────────────────────────────────────────────
let app: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function initFirebaseAdmin(): App {
  // Return existing app if already initialized
  if (app) return app;

  // Check if another Firebase Admin app exists (e.g. via hot-reload)
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountJson && serviceAccountJson.length > 0) {
    // ── Path 1: Explicit service account credentials (JSON string in env) ──
    try {
      const serviceAccount = JSON.parse(serviceAccountJson) as Record<string, unknown>;

      app = initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id as string,
          clientEmail: serviceAccount.client_email as string,
          privateKey: serviceAccount.private_key as string,
        }),
      });
    } catch (error) {
      console.error(
        "[firebase-admin] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:",
        error
      );
      // Fall through to ADC below
    }
  }

  // ── Path 2: Application Default Credentials (Vercel, GCP, or local gcloud) ─
  if (!app) {
    // ADC works automatically on Vercel (with Firebase integration),
    // GCP Cloud Run/App Engine, or when running `gcloud auth application-default login` locally.
    app = initializeApp();
  }

  return app;
}

// ── Public getters (lazy-init on first call) ────────────────────────────────

function getAdminApp(): App {
  if (!app) {
    app = initFirebaseAdmin();
  }
  return app;
}

function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

// Storage: use Cloudinary (lib/cloudinary.ts) instead of Firebase Storage.

export { getAdminApp, getAdminDb, getAdminAuth };
