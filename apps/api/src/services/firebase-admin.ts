import * as admin from 'firebase-admin';

let app: admin.app.App;

export function getFirebaseAdmin(): admin.app.App {
  if (app) return app;

  const projectId = process.env.GCP_PROJECT_ID || 'gen-lang-client-0010416291';

  if (admin.apps.length > 0) {
    app = admin.apps[0]!;
    return app;
  }

  // On Cloud Run: uses attached service account automatically.
  // Locally: uses Application Default Credentials (gcloud auth application-default login).
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
    storageBucket: `${projectId}.firebasestorage.app`,
  });

  return app;
}

export function getFirestore(): admin.firestore.Firestore {
  return getFirebaseAdmin().firestore();
}

export function getAuth(): admin.auth.Auth {
  return getFirebaseAdmin().auth();
}
