import type { Event } from "@/types/event";
import Image from "next/image";

function ImagePlaceholderIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]">
      <path d="M12 2L2 18h20L12 2z" />
      <path d="M8 14l4-4 4 4" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="h-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <a
        href={event.url ?? "#"}
        target={event.url ? "_blank" : undefined}
        rel={event.url ? "noopener noreferrer" : undefined}
        className="block"
      >
        <div className="relative flex aspect-[4/3] items-center justify-center bg-[var(--border)]">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 280px"
            />
          ) : (
            <ImagePlaceholderIcon />
          )}
        </div>
        <div className="h-12 border-t border-[var(--border)] bg-[var(--surface)] px-3 flex items-center">
          <span className="truncate text-sm font-medium text-[var(--foreground)]">
            {event.title}
          </span>
        </div>
      </a>
    </article>
  );
}
