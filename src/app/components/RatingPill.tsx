interface RatingPillProps {
  rating: number;
}

export default function RatingPill({ rating }: RatingPillProps) {
  const width = `${Math.max(0, Math.min(100, rating * 10))}%`;

  return (
    <div className="flex min-w-28 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-3 py-2">
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7c3aed,#c084fc)]"
          style={{ width }}
        />
      </div>
      <span className="text-sm font-semibold text-white">{rating}/10</span>
    </div>
  );
}
