'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getRole } from '@/lib/session';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/signin');
    } else if (!getRole()) {
      router.replace('/onboarding');
    } else {
      router.replace('/app');
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
    </div>
  );
}
