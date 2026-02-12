"use client";

import { useState, useEffect } from "react";
import type { Event } from "@/types/event";
import { EventCard } from "./EventCard";

type RecommendSectionProps = {
  query: string;
  lat?: number;
  lng?: number;
};

export function RecommendSection({ query, lat, lng }: RecommendSectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query && lat == null && lng == null) {
      setLoading(true);
      fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 6 }),
      })
        .then((r) => r.json())
        .then((data) => {
          setEvents(data.events ?? []);
        })
        .finally(() => setLoading(false));
      return;
    }
    setLoading(true);
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, lat, lng, limit: 6 }),
    })
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? []);
      })
      .finally(() => setLoading(false));
  }, [query, lat, lng]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <span className="text-[var(--accent)]">AI</span>
          Recommended for you
        </h2>
        <p className="py-8 text-center text-[var(--muted)]">Loading…</p>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
        <span className="text-[var(--accent)]">AI</span>
        Recommended for you
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
}
