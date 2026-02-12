"use client";

import type { Event } from "@/types/event";
import { EventCard } from "./EventCard";

type EventCardRowProps = {
  title: string;
  emoji?: string;
  events: Event[];
  seeAllHref?: string;
  emptyMessage?: string;
};

function SeeAllCard({ href }: { href: string }) {
  return (
    <li className="w-[80vw] min-w-[80vw] shrink-0 sm:w-[320px] sm:min-w-[320px] list-none">
      <a
        href={href}
        className="block h-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]/50 transition hover:bg-[var(--border)]"
      >
        <div className="flex h-48 flex-col items-center justify-center gap-2 bg-[var(--border)]/60 sm:h-52">
          <span className="text-2xl text-[var(--muted)]" aria-hidden>
            →
          </span>
          <span className="text-sm font-medium text-[var(--muted)]">See All</span>
        </div>
        <div className="h-12 border-t border-[var(--border)] bg-[var(--surface)]/80" />
      </a>
    </li>
  );
}

export function EventCardRow({
  title,
  emoji = "",
  events,
  seeAllHref = "#",
  emptyMessage = "No events.",
}: EventCardRowProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">
        {emoji} {title}
      </h2>
      {events.length === 0 ? (
        <p className="py-4 text-sm text-[var(--muted)]">{emptyMessage}</p>
      ) : (
        <ul className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {events.map((event) => (
            <li
              key={event.id}
              className="w-[80vw] min-w-[80vw] shrink-0 sm:w-[320px] sm:min-w-[320px]"
            >
              <EventCard event={event} />
            </li>
          ))}
          <SeeAllCard href={seeAllHref} />
        </ul>
      )}
    </section>
  );
}
