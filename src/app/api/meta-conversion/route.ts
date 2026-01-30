import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    eventName = "Purchase",
    email,
    value,
    currency = "BDT",
    eventId,
  } = body;

  // Hash email (required by Meta)
  const hashedEmail = email
    ? crypto.createHash("sha256").update(email).digest("hex")
    : undefined;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, //  deduplication
        action_source: "website",
        user_data: {
          em: hashedEmail ? [hashedEmail] : undefined,
          client_ip_address: req.headers.get("x-forwarded-for"),
          client_user_agent: req.headers.get("user-agent"),
        },
        custom_data: {
          value,
          currency,
        },
      },
    ],
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();
  return NextResponse.json(result);
}