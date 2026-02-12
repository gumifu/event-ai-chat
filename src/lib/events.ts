import type { Event, SearchParams } from "@/types/event";
import { ownEvents } from "@/data/events-own";
import { externalEvents } from "@/data/events-external";
import { distanceKm } from "./geo";

const allEvents: Event[] = [...ownEvents, ...externalEvents];

function matchesQuery(event: Event, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase();
  const text = [
    event.title,
    event.description,
    event.venue.name,
    event.venue.city,
    ...event.category,
  ]
    .join(" ")
    .toLowerCase();
  return text.includes(lower);
}

function withinRadius(
  event: Event,
  lat: number,
  lng: number,
  radiusKm: number
): boolean {
  const d = distanceKm(lat, lng, event.venue.lat, event.venue.lng);
  return d <= radiusKm;
}

export function searchEvents(params: SearchParams): Event[] {
  const {
    q = "",
    lat,
    lng,
    radiusKm = 50,
    source = "all",
    limit = 50,
  } = params;

  let list: Event[] =
    source === "own"
      ? [...ownEvents]
      : source === "external"
        ? [...externalEvents]
        : [...allEvents];

  if (q.trim()) {
    list = list.filter((e) => matchesQuery(e, q));
  }
  if (lat != null && lng != null) {
    list = list.filter((e) => withinRadius(e, lat, lng, radiusKm));
    list.sort(
      (a, b) =>
        distanceKm(lat, lng, a.venue.lat, a.venue.lng) -
        distanceKm(lat, lng, b.venue.lat, b.venue.lng)
    );
  } else {
    list.sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  }

  return list.slice(0, limit);
}

export function getEventById(id: string): Event | undefined {
  return allEvents.find((e) => e.id === id);
}

export { ownEvents, externalEvents, allEvents };
