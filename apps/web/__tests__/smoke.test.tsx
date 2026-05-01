import { describe, it, expect } from 'vitest';

describe('Frontend smoke test', () => {
  it('environment has required config', () => {
    expect(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
  });
});
