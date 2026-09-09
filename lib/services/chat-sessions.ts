// Chat session persistence service.
// Saves and retrieves chat sessions from Firestore.

import { getAdminDb } from "@/lib/firebase-admin";
import type { ChatSession, ChatMessage } from "@/lib/types";

// ── Create a new chat session ──────────────────────────────────────────────

export async function createChatSession(params: {
  userId: string;
  templateId?: string;
}): Promise<ChatSession> {
  const db = getAdminDb();
  const now = Date.now();

  const session: Omit<ChatSession, "id"> = {
    user_id: params.userId,
    template_id: params.templateId ?? "",
    messages: [],
    created_at: now,
    updated_at: now,
    status: "active",
  };

  const docRef = await db.collection("chat_sessions").add(session);
  return { id: docRef.id, ...session };
}

// ── Get a chat session ─────────────────────────────────────────────────────

export async function getChatSession(
  sessionId: string
): Promise<ChatSession | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection("chat_sessions").doc(sessionId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as ChatSession;
  } catch {
    return null;
  }
}

// ── Add a message to a session ─────────────────────────────────────────────

export async function addMessage(
  sessionId: string,
  message: ChatMessage
): Promise<void> {
  const db = getAdminDb();
  const docRef = db.collection("chat_sessions").doc(sessionId);

  // Use arrayUnion to add the message
  const doc = await docRef.get();
  if (!doc.exists) return;

  const session = doc.data() as ChatSession;
  const messages = [...session.messages, message];

  await docRef.update({
    messages,
    updated_at: Date.now(),
    status: messages.length > 0 ? "active" : session.status,
  });
}

// ── List user's chat sessions ──────────────────────────────────────────────

export async function listChatSessions(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<ChatSession[]> {
  const db = getAdminDb();
  const limit = Math.min(50, options?.limit ?? 20);
  const offset = options?.offset ?? 0;

  const snapshot = await db
    .collection("chat_sessions")
    .where("user_id", "==", userId)
    .orderBy("updated_at", "desc")
    .limit(limit + offset)
    .get();

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as ChatSession))
    .slice(offset, offset + limit);
}

// ── Update session status ──────────────────────────────────────────────────

export async function updateSessionStatus(
  sessionId: string,
  status: ChatSession["status"]
): Promise<void> {
  const db = getAdminDb();
  await db.collection("chat_sessions").doc(sessionId).update({
    status,
    updated_at: Date.now(),
  });
}

// ── Delete a chat session ──────────────────────────────────────────────────

export async function deleteChatSession(
  sessionId: string,
  userId: string
): Promise<boolean> {
  const db = getAdminDb();
  const doc = await db.collection("chat_sessions").doc(sessionId).get();

  if (!doc.exists) return false;
  const session = doc.data() as ChatSession;
  if (session.user_id !== userId) return false;

  await db.collection("chat_sessions").doc(sessionId).delete();
  return true;
}
