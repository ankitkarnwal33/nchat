import { NextRequest, NextResponse } from "next/server";
import { instagramEventQueue } from "@/src/lib/InstagramEventQueue";

// Handle the webhook verification from instagram api
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Handle the webhook event from instagram api
// IMPORTANT: Returning 200 immediately is crucial for Instagram's webhook verification process.
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Queue the event to be processed in the background
  await instagramEventQueue.add("process_webhook_event", body.entry[0]);
  return NextResponse.json({ status: 200 });
  // IMPORTANT: Always return 200 fast_
}
