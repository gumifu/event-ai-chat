export type EventSource = "own" | "external";

export interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string; // ISO date
  endAt?: string;
  venue: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    city: string;
  };
  imageUrl?: string;
  url?: string;
  source: EventSource;
  category: string[];
  price?: string; // "無料" | "¥1,500" etc.
}

export interface SearchParams {
  q?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  source?: "all" | EventSource;
  limit?: number;
}

export interface RecommendRequest {
  query: string;
  location?: string;
  lat?: number;
  lng?: number;
  limit?: number;
}
