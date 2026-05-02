'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getRole, getEmotionalIntent, clearSession } from '@/lib/session';

const TOOLS = [
  {
    href: '/app/idea-factory',
    title: 'Idea Factory',
    description: 'Multi-turn AI brainstorming with session memory',
    available: true,
  },
  {
    href: '/app/color-tools',
    title: 'Color Tools',
    description: 'Color wheels, palettes, and AI color intelligence',
    available: false,
  },
];

export default function AppHome() {
  const { logout } = useAuth();
  const router = useRouter();
  const role = getRole();
  const intent = getEmotionalIntent();

  async function handleLogout() {
    clearSession();
    await logout();
    router.replace('/signin');
  }

  function handleResetRole() {
    clearSession();
    router.replace('/onboarding');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <h1 className="text-lg font-semibold">Expressions</h1>
        <div className="flex items-center gap-4">
          {role && (
            <button
              onClick={handleResetRole}
              className="text-xs text-zinc-500 capitalize hover:text-zinc-300 transition-colors"
            >
              {role} ↺
            </button>
          )}
          <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </header>
      {intent && (
        <div className="px-6 py-3 bg-zinc-950 border-b border-zinc-900">
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-600">Intent: </span>
            {intent}
          </p>
        </div>
      )}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-8">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) =>
            tool.available ? (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">{tool.title}</div>
                <div className="text-sm text-zinc-400">{tool.description}</div>
              </Link>
            ) : (
              <div
                key={tool.href}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 opacity-40 cursor-not-allowed"
              >
                <div className="font-semibold mb-1">{tool.title}</div>
                <div className="text-sm text-zinc-400">{tool.description}</div>
                <div className="text-xs text-zinc-600 mt-2">Coming soon</div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
