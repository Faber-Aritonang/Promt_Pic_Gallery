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
// Remembered so repeated calls fail fast instead of re-parsing credentials.
let initFailure: Error | null = null;

/**
 * Read the service-account JSON out of the environment.
 * The private key is normalized because the value is routinely copied with
 * escaped newlines (`\n`) instead of real ones, which makes `cert()` fail with
 * `error:1E08010C:DECODER routines::unsupported`.
 */
function parseServiceAccount(serviceAccountJson: string): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} {
  const serviceAccount = JSON.parse(serviceAccountJson) as Record<string, unknown>;

  return {
    projectId: serviceAccount.project_id as string,
    clientEmail: serviceAccount.client_email as string,
    privateKey: String(serviceAccount.private_key ?? "").replace(/\\n/g, "\n"),
  };
}

function initFirebaseAdmin(): App {
  // Return existing app if already initialized
  if (app) return app;

  // Check if another Firebase Admin app exists (e.g. via hot-reload)
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  let credentialFailure: unknown = null;

  if (serviceAccountJson && serviceAccountJson.length > 0) {
    // ── Path 1: Explicit service account credentials (JSON string in env) ──
    try {
      app = initializeApp({ credential: cert(parseServiceAccount(serviceAccountJson)) });
      return app;
    } catch (error) {
      credentialFailure = error;
      console.error(
        "[firebase-admin] FIREBASE_SERVICE_ACCOUNT is set but unusable " +
          "(is the full JSON pasted in, with a valid private_key?):",
        error
      );
    }
  }

  // Never quietly fall back to Application Default Credentials when explicit
  // credentials were provided but rejected: on serverless platforms the ADC
  // lookup goes to a metadata server that never answers, so the caller hangs
  // until the platform kills the request — which the browser sees as an empty
  // 500 with no server-side error. Failing fast is what lets the seed-data
  // fallbacks in lib/services/* keep the app (and its pages) working.
  if (credentialFailure) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is set but invalid: " +
        (credentialFailure instanceof Error
          ? credentialFailure.message
          : String(credentialFailure))
    );
  }

  // ── Path 2: Application Default Credentials (GCP, or local gcloud login) ─
  try {
    app = initializeApp();
  } catch (error) {
    console.error(
      "[firebase-admin] Application Default Credentials unavailable:",
      error
    );
    throw new Error("Firebase Admin credentials are not configured.");
  }

  return app;
}

// ── Public getters (lazy-init on first call) ────────────────────────────────

function getAdminApp(): App {
  if (app) return app;

  if (initFailure) throw initFailure;

  try {
    app = initFirebaseAdmin();
  } catch (error) {
    initFailure = error instanceof Error ? error : new Error(String(error));
    throw initFailure;
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
