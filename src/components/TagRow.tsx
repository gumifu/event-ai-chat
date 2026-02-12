"use client";

const DEFAULT_TAGS = [
  "All",
  "Music",
  "Tech",
  "Sports",
  "Food",
  "Art",
  "Nightlife",
  "Meetup",
  "Workshop",
];

type TagRowProps = {
  onSelect: (tag: string) => void;
  selectedTag?: string;
};

export function TagRow({ onSelect, selectedTag }: TagRowProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {DEFAULT_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
            selectedTag === tag
              ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span className="text-[var(--muted)]" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18M3 12h18" />
              <path d="M8 8l8 8M16 8l-8 8" />
            </svg>
          </span>
          {tag}
        </button>
      ))}
    </div>
  );
}
