import type { ArtistRole } from '@expressions/shared';

const ROLE_KEY = 'expressions_role';
const INTENT_KEY = 'expressions_intent';

export function getRole(): ArtistRole | null {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem(ROLE_KEY) as ArtistRole) || null;
}

export function setRole(role: ArtistRole): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function getEmotionalIntent(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(INTENT_KEY) || '';
}

export function setEmotionalIntent(intent: string): void {
  localStorage.setItem(INTENT_KEY, intent);
}

export function clearSession(): void {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(INTENT_KEY);
}
