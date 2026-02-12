"use client";

import { useState } from "react";
import type { Event } from "@/types/event";
import Image from "next/image";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Subtle placeholder when image is missing or fails to load */
function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--border)]/30">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--muted)]/50"
      >
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="4"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
        <path
          d="M6 38 L6 30 L20 38 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20 38 L20 24 L36 38 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function EventCard({ event }: { event: Event }) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !event.imageUrl || imageError;

  return (
    <article className="h-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <a
        href={event.url ?? "#"}
        target={event.url ? "_blank" : undefined}
        rel={event.url ? "noopener noreferrer" : undefined}
        className="block"
      >
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-t-xl bg-[var(--border)]/20 sm:h-52">
          {showPlaceholder ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={event.imageUrl!}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 280px"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-3 py-2">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">
            {event.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
            {formatDateTime(event.startAt)} | {event.venue.name}
            {event.price ? ` | ${event.price}` : " | Free"}
          </p>
        </div>
      </a>
    </article>
  );
}
