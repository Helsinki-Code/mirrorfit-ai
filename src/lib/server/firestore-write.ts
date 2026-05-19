import type { DocumentReference } from "firebase-admin/firestore";
import { sanitizeFirestoreData, topLevelKeys } from "@/lib/utils/firestore-sanitize";

type WriteMeta = {
  collection: string;
  docId: string;
};

function writeFailureLog(
  operation: "set" | "update",
  meta: WriteMeta,
  data: object,
  error: unknown,
) {
  const keySource = data as Record<string, unknown>;
  console.error("firestore.write_failed", {
    operation,
    collection: meta.collection,
    docId: meta.docId,
    keys: topLevelKeys(keySource),
    error: error instanceof Error ? error.message : String(error),
  });
}

export async function setDocSafe(params: {
  docRef: DocumentReference;
  data: object;
} & WriteMeta) {
  const sanitized = sanitizeFirestoreData(params.data);
  try {
    await params.docRef.set(sanitized);
    return sanitized;
  } catch (error) {
    writeFailureLog("set", params, sanitized, error);
    throw error;
  }
}

export async function updateDocSafe(params: {
  docRef: DocumentReference;
  data: object;
} & WriteMeta) {
  const sanitized = sanitizeFirestoreData(params.data);
  if (Object.keys(sanitized).length === 0) return sanitized;
  try {
    await params.docRef.update(sanitized);
    return sanitized;
  } catch (error) {
    writeFailureLog("update", params, sanitized, error);
    throw error;
  }
}
