import { getApp, getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function ensureAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID");
  }

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
      storageBucket,
    });
  }

  return initializeApp({
    projectId,
    storageBucket,
  });
}

export function getAdminAuth() {
  return getAuth(ensureAdminApp());
}

export function getAdminDb() {
  return getFirestore(ensureAdminApp());
}

export function getAdminStorage() {
  return getStorage(ensureAdminApp());
}
