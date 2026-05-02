interface RoleCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function RoleCard({ title, description, selected, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition-colors ${
        selected
          ? 'border-white bg-zinc-900'
          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
      }`}
    >
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-sm text-zinc-400">{description}</div>
    </button>
  );
}
