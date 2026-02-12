import { NextRequest } from "next/server";
import { searchEvents } from "@/lib/events";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radiusKm = searchParams.get("radiusKm");
  const source = searchParams.get("source") as "all" | "own" | "external" | null;
  const limit = searchParams.get("limit");

  const events = searchEvents({
    q: q ?? undefined,
    lat: lat != null ? Number(lat) : undefined,
    lng: lng != null ? Number(lng) : undefined,
    radiusKm: radiusKm != null ? Number(radiusKm) : undefined,
    source: source ?? "all",
    limit: limit != null ? Number(limit) : undefined,
  });

  return Response.json({ events });
}
