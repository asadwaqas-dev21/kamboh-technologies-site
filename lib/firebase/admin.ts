import type { App, ServiceAccount } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

let app: App | null = null;

/**
 * Server-only Firebase Admin app. Credentials, in order:
 * 1. FIREBASE_KEY_PATH (local development, path to the service account JSON)
 * 2. FIREBASE_SERVICE_ACCOUNT_JSON (Vercel/production, the JSON contents)
 * 3. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 */
function loadServiceAccount(): ServiceAccount {
  if (process.env.FIREBASE_KEY_PATH) {
    try {
      return JSON.parse(readFileSync(resolve(process.env.FIREBASE_KEY_PATH), "utf-8"));
    } catch (error) {
      console.warn("[firebase] Could not read FIREBASE_KEY_PATH, trying env vars:", (error as Error).message);
    }
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  const { FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail, FIREBASE_PRIVATE_KEY: privateKey } = process.env;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are not configured.");
  }
  return { projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") };
}

export function getAdminApp(): App {
  if (app) return app;
  // Use require() to avoid Turbopack mangling the package name during bundling.
  const { cert, getApps, initializeApp } = require("firebase-admin/app");
  app = getApps()[0] ?? initializeApp({ credential: cert(loadServiceAccount()) });
  return app!;
}

export function getAdminAuth() {
  const { getAuth } = require("firebase-admin/auth");
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  const { getFirestore } = require("firebase-admin/firestore");
  return getFirestore(getAdminApp());
}

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_KEY_PATH ||
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY),
  );
}
