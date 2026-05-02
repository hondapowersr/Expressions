import type { ChatMessage as ChatMessageType } from '@expressions/shared';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-white text-black rounded-br-sm'
            : 'bg-zinc-900 text-white rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
