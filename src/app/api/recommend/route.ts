import { NextRequest } from "next/server";
import { allEvents } from "@/lib/events";
import { distanceKm } from "@/lib/geo";
import type { Event } from "@/types/event";

/**
 * AI風レコメンド: クエリ・場所に基づいてスコア付けし、上位を返す。
 * OPENAI_API_KEY が設定されていれば OpenAI で自然言語レコメンドも可能（拡張用）。
 */
function scoreEvent(
  event: Event,
  query: string,
  lat?: number,
  lng?: number
): number {
  const q = query.toLowerCase();
  let score = 0;
  const title = event.title.toLowerCase();
  const desc = event.description.toLowerCase();
  const categories = event.category.join(" ").toLowerCase();
  const venue = `${event.venue.name} ${event.venue.city}`.toLowerCase();
  const text = `${title} ${desc} ${categories} ${venue}`;

  // キーワード一致
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    for (const t of terms) {
      if (title.includes(t)) score += 10;
      else if (desc.includes(t) || categories.includes(t)) score += 5;
      else if (venue.includes(t)) score += 3;
    }
  } else {
    score = 5; // クエリなしは全員にベーススコア
  }

  // 日付が近いほど高スコア
  const now = Date.now();
  const start = new Date(event.startAt).getTime();
  const daysUntil = (start - now) / (24 * 60 * 60 * 1000);
  if (daysUntil >= 0 && daysUntil <= 30) score += 8;
  else if (daysUntil > 30 && daysUntil <= 90) score += 4;

  // 距離が近いほど高スコア
  if (lat != null && lng != null) {
    const d = distanceKm(lat, lng, event.venue.lat, event.venue.lng);
    if (d <= 5) score += 10;
    else if (d <= 15) score += 6;
    else if (d <= 30) score += 3;
  }

  return score;
}

export async function POST(request: NextRequest) {
  let body: { query?: string; location?: string; lat?: number; lng?: number; limit?: number };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const query = (body.query ?? "").trim();
  const lat = body.lat;
  const lng = body.lng;
  const limit = Math.min(body.limit ?? 6, 20);

  const scored = allEvents
    .map((event) => ({
      event,
      score: scoreEvent(event, query, lat, lng),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.event);

  return Response.json({ events: scored });
}
