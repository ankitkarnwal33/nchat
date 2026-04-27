import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Handle SNS subscription confirmation
  if (body.Type === "SubscriptionConfirmation") {
    await fetch(body.SubscribeURL);
    return NextResponse.json({ ok: true });
  }

  // Handle actual email notification
  if (body.Type === "Notification") {
    const message = JSON.parse(body.Message);

    // message contains S3 object key
    // You can fetch email from S3 here
  }

  return NextResponse.json({ ok: true });
}
