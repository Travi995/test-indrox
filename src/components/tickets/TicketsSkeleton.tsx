export function TicketsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={`ticket-skeleton-${idx}`}
          className="h-24 animate-pulse rounded-xl border border-white/10 bg-slate-900/50 md:h-14"
        />
      ))}
    </div>
  );
}
