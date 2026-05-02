import { render, screen } from '@testing-library/react';
import ChatMessage from '@/components/ChatMessage';
import type { ChatMessage as ChatMessageType } from '@expressions/shared';

describe('ChatMessage', () => {
  const userMsg: ChatMessageType = { role: 'user', content: 'Hello there', timestamp: 0 };
  const assistantMsg: ChatMessageType = { role: 'assistant', content: 'Hi back', timestamp: 0 };

  it('renders user message content', () => {
    render(<ChatMessage message={userMsg} />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
  });

  it('renders assistant message content', () => {
    render(<ChatMessage message={assistantMsg} />);
    expect(screen.getByText('Hi back')).toBeInTheDocument();
  });

  it('user message bubble has bg-white class', () => {
    render(<ChatMessage message={userMsg} />);
    expect(screen.getByText('Hello there').className).toContain('bg-white');
  });

  it('assistant message bubble has bg-zinc-900 class', () => {
    render(<ChatMessage message={assistantMsg} />);
    expect(screen.getByText('Hi back').className).toContain('bg-zinc-900');
  });
});
