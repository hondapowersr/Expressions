import { describe, it, expect, beforeEach } from 'vitest';
import { getRole, setRole, getEmotionalIntent, setEmotionalIntent, clearSession } from '@/lib/session';

describe('session store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getRole returns null when not set', () => {
    expect(getRole()).toBeNull();
  });

  it('setRole and getRole round-trip correctly', () => {
    setRole('tutor');
    expect(getRole()).toBe('tutor');
  });

  it('setRole overwrites previous value', () => {
    setRole('tutor');
    setRole('critic');
    expect(getRole()).toBe('critic');
  });

  it('getEmotionalIntent returns empty string when not set', () => {
    expect(getEmotionalIntent()).toBe('');
  });

  it('setEmotionalIntent and getEmotionalIntent round-trip correctly', () => {
    setEmotionalIntent('urgent and raw');
    expect(getEmotionalIntent()).toBe('urgent and raw');
  });

  it('clearSession removes both values', () => {
    setRole('guide');
    setEmotionalIntent('melancholy');
    clearSession();
    expect(getRole()).toBeNull();
    expect(getEmotionalIntent()).toBe('');
  });
});
