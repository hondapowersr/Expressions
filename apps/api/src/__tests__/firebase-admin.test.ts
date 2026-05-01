import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockAuth = { verifyIdToken: vi.fn() };
const mockFirestore = { collection: vi.fn() };
const mockApp = {
  auth: vi.fn(() => mockAuth),
  firestore: vi.fn(() => mockFirestore),
};

// Mutable state shared between the mock factory and tests
const mockState = {
  apps: [] as unknown[],
};

vi.mock('firebase-admin', () => ({
  default: {
    get apps() { return mockState.apps; },
    initializeApp: vi.fn(() => mockApp),
    credential: { applicationDefault: vi.fn(() => ({})) },
  },
  get apps() { return mockState.apps; },
  initializeApp: vi.fn(() => mockApp),
  credential: { applicationDefault: vi.fn(() => ({})) },
}));

describe('firebase-admin service', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockState.apps = [];
  });

  it('getFirebaseAdmin initializes and returns an app on first call', async () => {
    mockState.apps = [];
    const adminMock = await import('firebase-admin');
    const { getFirebaseAdmin } = await import('../services/firebase-admin');
    const result = getFirebaseAdmin();
    expect(result).toBe(mockApp);
    expect(adminMock.initializeApp).toHaveBeenCalledOnce();
  });

  it('getFirebaseAdmin returns existing app when firebase already initialized', async () => {
    mockState.apps = [mockApp];
    const adminMock = await import('firebase-admin');
    const { getFirebaseAdmin } = await import('../services/firebase-admin');
    const result = getFirebaseAdmin();
    expect(result).toBe(mockApp);
    expect(adminMock.initializeApp).not.toHaveBeenCalled();
  });

  it('getAuth returns the auth service from the app', async () => {
    mockState.apps = [];
    await import('firebase-admin');
    const { getAuth } = await import('../services/firebase-admin');
    const auth = getAuth();
    expect(auth).toBe(mockAuth);
  });

  it('getFirestore returns the firestore service from the app', async () => {
    mockState.apps = [];
    await import('firebase-admin');
    const { getFirestore } = await import('../services/firebase-admin');
    const firestore = getFirestore();
    expect(firestore).toBe(mockFirestore);
  });
});
