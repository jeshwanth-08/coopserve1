import { NextResponse } from "next/server";
import { sendSms, getSmsDeliveryLogs } from "@/lib/smsGatewayService";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    gateway: "CoopServe Unified SMS Gateway",
    providersAvailable: ["Fast2SMS", "Twilio", "Sandbox_Coop_SMS"],
    recentDispatches: getSmsDeliveryLogs(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, message, type = "ALERT", bookingId } = body;

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number 'to' and 'message' are required" }, { status: 400 });
    }

    const result = await sendSms({
      to,
      message,
      type,
      bookingId,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("SMS API Error:", err);
    return NextResponse.json({ error: "Failed to dispatch SMS" }, { status: 500 });
  }
}
