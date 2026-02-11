import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

// Input validation schema
const conversionEventSchema = z.object({
  eventName: z.string().default("Purchase"),
  email: z.string().email().optional().or(z.literal("")),
  value: z.number().optional(),
  currency: z.string().default("BDT"),
  eventId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = conversionEventSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          errors: validatedData.error.flatten()
        },
        { status: 400 }
      );
    }

    const {
      eventName,
      email,
      value,
      currency,
      eventId,
    } = validatedData.data;

    // Hash email (required by Meta) if present
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
            client_ip_address: req.headers.get("x-forwarded-for") || (req as any).ip,
            client_user_agent: req.headers.get("user-agent"),
          },
          custom_data: {
            value,
            currency,
          },
        },
      ],
    };

    const pixelId = process.env.META_PIXEL_ID;
    const capiToken = process.env.META_CAPI_TOKEN;

    if (!pixelId || !capiToken) {
      console.error("Meta Pixel configuration missing");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${capiToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta API error:", result);
      return NextResponse.json(
        { success: false, message: "Failed to send event to Meta", error: result },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Meta conversion API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}