import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    await fetch("https://edge-config.vercel.com/v1/items", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.EDGE_CONFIG}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          operation: "upsert",
          key: "otp",
          value: { value: otp, timestamp },
        },
      ]),
    });

    return NextResponse.json({ success: true, otp, timestamp });
  } catch (error) {
    console.error("Failed to update OTP:", error);
    return NextResponse.json(
      { error: "Failed to update OTP" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(
      "https://edge-config.vercel.com/v1/items/otp",
      {
        headers: {
          Authorization: `Bearer ${process.env.EDGE_CONFIG}`,
        },
      }
    );
    const data = await response.json();
    return NextResponse.json(data || { value: null, timestamp: null });
  } catch (error) {
    console.error("Failed to fetch OTP:", error);
    return NextResponse.json({ error: "Failed to fetch OTP" }, { status: 500 });
  }
}
