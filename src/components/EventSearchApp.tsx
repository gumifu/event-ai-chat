"use client";

import { useState, useCallback, useEffect, useRef } from "react";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref, onClose]);
}
import type { Event } from "@/types/event";
import { SearchForm } from "./SearchForm";
import { TagRow } from "./TagRow";
import { EventCardRow } from "./EventCardRow";
import { AIChatPanel } from "./AIChatPanel";

type SourceTab = "all" | "own" | "external";

const LOCATIONS: Record<string, { lat: number; lng: number }> = {
  Vancouver: { lat: 49.2827, lng: -123.1207 },
  "New York": { lat: 40.7128, lng: -74.006 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
};

export function EventSearchApp() {
  const [events, setEvents] = useState<Event[]>([]);
  const [source, setSource] = useState<SourceTab>("all");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [locationLabel, setLocationLabel] = useState("Vancouver");
  const [hasSearched, setHasSearched] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiPicks, setAiPicks] = useState<Event[]>([]);
  const locationRef = useRef<HTMLDivElement>(null);
  useClickOutside(locationRef, () => setLocationOpen(false));

  const coords = LOCATIONS[locationLabel];

  useEffect(() => {
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 8 }),
    })
      .then((r) => r.json())
      .then((data) => setAiPicks(data.events ?? []))
      .catch(() => setAiPicks([]));
  }, []);

  const fetchEvents = useCallback(
    async (q: string) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      // Only filter by location when user has searched; otherwise show all events
      if (coords && q) {
        params.set("lat", String(coords.lat));
        params.set("lng", String(coords.lng));
        params.set("radiusKm", "50");
      }
      params.set("source", source);
      params.set("limit", "30");
      try {
        const res = await fetch(`/api/events?${params}`);
        const data = await res.json();
        setEvents(data.events ?? []);
      } finally {
        setLoading(false);
      }
    },
    [source, coords]
  );

  useEffect(() => {
    fetchEvents("");
  }, [fetchEvents]);

  const handleSearch = useCallback(
    (q: string) => {
      setHasSearched(true);
      setSelectedTag(undefined);
      fetchEvents(q);
    },
    [fetchEvents]
  );

  const handleTagSelect = useCallback(
    (tag: string) => {
      setSelectedTag(tag);
      setQuery(tag === "All" ? "" : tag);
      setHasSearched(tag !== "All");
      setLoading(true);
      const params = new URLSearchParams();
      if (tag !== "All") params.set("q", tag);
      params.set("source", source);
      params.set("limit", "30");
      fetch(`/api/events?${params}`)
        .then((r) => r.json())
        .then((data) => setEvents(data.events ?? []))
        .finally(() => setLoading(false));
    },
    [source]
  );

  const handleSourceChange = (s: SourceTab) => {
    setSource(s);
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (coords && query) {
      params.set("lat", String(coords.lat));
      params.set("lng", String(coords.lng));
      params.set("radiusKm", "50");
    }
    params.set("source", s);
    params.set("limit", "30");
    fetch(`/api/events?${params}`)
      .then((r) => r.json())
      .then((data) => setEvents(data.events ?? []))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="relative" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationOpen((o) => !o)}
              className="flex items-center gap-2 text-[var(--foreground)]"
              aria-label="Change location"
              aria-expanded={locationOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="font-medium">{locationLabel}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition ${locationOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {locationOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 min-w-[160px] rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
                {Object.keys(LOCATIONS).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setLocationLabel(loc);
                      setLocationOpen(false);
                      if (hasSearched) fetchEvents(query);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm ${locationLabel === loc ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--foreground)] hover:bg-[var(--border)]"}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
              aria-label="Filter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </div>
          <div className="pb-3">
            <SearchForm
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              isLoading={loading}
              placeholder="AI Search"
              showSubmitButton={true}
              onOpenChat={() => setChatOpen(true)}
            />
          </div>
        </div>
      </header>

      {chatOpen && (
        <AIChatPanel
          onClose={() => setChatOpen(false)}
          locationLabel={locationLabel}
        />
      )}

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <TagRow onSelect={handleTagSelect} selectedTag={selectedTag} />
        </div>

        <div className="h-1 w-full shrink-0 bg-[var(--border)]" aria-hidden />

        <div className="mt-4">
          <EventCardRow
            title="AI Picks For You"
            emoji="⚡"
            events={aiPicks}
            seeAllHref="#ai-picks"
            emptyMessage="No picks yet."
          />
          <EventCardRow
            title="Happening Near You"
            emoji="📍"
            events={events}
            seeAllHref="#happening"
            emptyMessage={loading ? "Loading…" : hasSearched ? "No events match your search." : "No events yet."}
          />
          <EventCardRow
            title="Trending Now"
            emoji="🔥"
            events={[...events].sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()).slice(0, 10)}
            seeAllHref="#trending"
            emptyMessage="No trending events."
          />
        </div>
      </main>
    </div>
  );
}
