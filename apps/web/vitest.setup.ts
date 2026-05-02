import '@testing-library/jest-dom';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '.env.local') });

// Node 25+ ships a native localStorage global that lacks .clear() and other
// standard Storage methods. Override it with a proper in-memory implementation
// so jsdom-based tests get a fully spec-compliant Storage mock.
const makeLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
};

Object.defineProperty(globalThis, 'localStorage', {
  value: makeLocalStorageMock(),
  writable: true,
});
