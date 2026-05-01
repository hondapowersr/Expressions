import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock firebase-admin before importing our service
vi.mock('firebase-admin', () => {
  const mockApp = {
    auth: vi.fn(() => ({ verifyIdToken: vi.fn() })),
    firestore: vi.fn(() => ({})),
  };
  return {
    default: {
      apps: [],
      initializeApp: vi.fn(() => mockApp),
      credential: {
        applicationDefault: vi.fn(() => ({})),
      },
      app: {},
    },
    apps: [],
    initializeApp: vi.fn(() => mockApp),
    credential: {
      applicationDefault: vi.fn(() => ({})),
    },
  };
});

describe('firebase-admin service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getFirebaseAdmin returns an initialized app', async () => {
    process.env.GCP_PROJECT_ID = 'gen-lang-client-0010416291';
    const { getFirebaseAdmin } = await import('../services/firebase-admin');
    const admin = getFirebaseAdmin();
    expect(admin).toBeDefined();
  });

  it('getAuth returns auth service', async () => {
    const { getAuth } = await import('../services/firebase-admin');
    const auth = getAuth();
    expect(auth).toBeDefined();
  });

  it('getFirestore returns firestore service', async () => {
    const { getFirestore } = await import('../services/firebase-admin');
    const firestore = getFirestore();
    expect(firestore).toBeDefined();
  });
});
