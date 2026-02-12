import type { Event } from "@/types/event";
import { EventCard } from "./EventCard";

export function EventList({
  events,
  emptyMessage = "No events.",
}: {
  events: Event[];
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--muted)]">{emptyMessage}</p>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-5 md:grid-cols-[1.2fr_1fr]">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}
