import { NextRequest } from "next/server";
import { searchEvents } from "@/lib/events";

/**
 * Mock AI chat: returns event suggestions or a friendly reply.
 * Replace with OpenAI/Claude etc. for real AI.
 */
export async function POST(request: NextRequest) {
  let body: { message?: string; location?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const message = (body.message ?? "").trim().toLowerCase();
  const location = body.location ?? "Vancouver";

  if (!message) {
    return Response.json({
      reply: "What kind of events are you looking for? Try \"jazz\", \"tech meetup\", or \"sports\" and I can suggest some.",
    });
  }

  // Use existing search to get event suggestions
  const coords = location === "New York"
    ? { lat: 40.7128, lng: -74.006 }
    : location === "Tokyo"
      ? { lat: 35.6762, lng: 139.6503 }
      : { lat: 49.2827, lng: -123.1207 };

  const events = searchEvents({
    q: message,
    lat: coords.lat,
    lng: coords.lng,
    radiusKm: 30,
    source: "all",
    limit: 3,
  });

  if (events.length > 0) {
    const list = events
      .slice(0, 3)
      .map((e) => `• ${e.title} — ${new Date(e.startAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${e.venue.name}`)
      .join("\n");
    return Response.json({
      reply: `Here are some events that might match "${message}" near ${location}:\n\n${list}\n\nCheck the main list for more and to filter by Your events or Partner events.`,
    });
  }

  return Response.json({
    reply: `I couldn't find specific events for "${message}" right now. Try a different keyword like Music, Tech, or Sports, or browse the tags above.`,
  });
}
