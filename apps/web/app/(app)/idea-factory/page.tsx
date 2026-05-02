'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ChatMessage as ChatMessageType } from '@expressions/shared';
import { useAuth } from '@/lib/auth-context';
import { createApiClient } from '@/lib/api-client';
import { getRole, getEmotionalIntent } from '@/lib/session';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

export default function IdeaFactoryPage() {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const role = getRole();
  const intent = getEmotionalIntent();

  useEffect(() => {
    if (!role) router.replace('/onboarding');
  }, [role, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text: string) {
    setError(null);
    const userMsg: ChatMessageType = { role: 'user', content: text, timestamp: Date.now() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setStreaming(true);

    const placeholderMsg: ChatMessageType = { role: 'assistant', content: '', timestamp: Date.now() };
    setMessages((prev) => [...prev, placeholderMsg]);

    try {
      const client = createApiClient(getIdToken);
      const stream = client.chat({
        messages: nextMessages,
        artistRole: role!,
        sessionContext: intent || undefined,
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...placeholderMsg, content: fullText };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError('Something went wrong. Try again.');
      console.error(err);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-900 flex-shrink-0">
        <Link href="/app" className="text-zinc-400 hover:text-white text-sm transition-colors">
          ← Back
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold">Idea Factory</h1>
          {role && (
            <p className="text-xs text-zinc-500 capitalize truncate">
              {role}{intent ? ` · ${intent}` : ''}
            </p>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Clear
          </button>
        )}
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-zinc-500 text-sm">What are you working on?</p>
            {intent && <p className="text-zinc-700 text-xs max-w-sm">{intent}</p>}
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
