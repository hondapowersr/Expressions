'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ArtistRole } from '@expressions/shared';
import { setRole, setEmotionalIntent } from '@/lib/session';
import RoleCard from '@/components/RoleCard';

const ROLES: { id: ArtistRole; title: string; description: string }[] = [
  { id: 'tutor', title: 'Tutor', description: 'Patient step-by-step guidance and teaching' },
  { id: 'guide', title: 'Guide', description: 'Questions that help you trust your instincts' },
  { id: 'critic', title: 'Critic', description: 'Honest, specific, actionable craft feedback' },
  { id: 'freestyle', title: 'Freestyle', description: 'Energetic brainstorming partner' },
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<ArtistRole | null>(null);
  const [intent, setIntent] = useState('');
  const router = useRouter();

  function handleSubmit() {
    if (!selectedRole) return;
    setRole(selectedRole);
    setEmotionalIntent(intent);
    router.push('/app');
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16 gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">How do you want to work today?</h1>
        <p className="text-zinc-400">Choose a role for your AI collaborator</p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
        {ROLES.map((role) => (
          <RoleCard
            key={role.id}
            title={role.title}
            description={role.description}
            selected={selectedRole === role.id}
            onClick={() => setSelectedRole(role.id)}
          />
        ))}
      </div>
      <div className="max-w-lg w-full flex flex-col gap-2">
        <label className="text-sm text-zinc-400">
          What's the emotional intent for this session?{' '}
          <span className="text-zinc-600">(optional)</span>
        </label>
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="e.g. I want to make something that feels urgent and raw..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-zinc-600 text-sm"
          rows={3}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedRole}
        className="px-8 py-3 rounded-full bg-white text-black font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors"
      >
        Start Creating
      </button>
    </div>
  );
}
