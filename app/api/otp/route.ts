import { NextResponse } from "next/server";

function getApiKey() {
  return Buffer.from(process.env.ENCODED_JSONBIN_API_KEY!, "base64").toString();
}

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const url = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}`;
    // console.log("apikey", process.env.JSONBIN_API_KEY);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "X-Master-Key": getApiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: otp, timestamp }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("JSONBin API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
      throw new Error(`API returned ${response.status}: ${errorData}`);
    }

    const responseData = await response.json();
    console.log("JSONBin Response:", responseData);

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
      `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}/latest`,
      {
        headers: {
          "X-Master-Key": getApiKey(),
        },
      }
    );
    const { record } = await response.json();
    return NextResponse.json(record || { value: null, timestamp: null });
  } catch (error) {
    console.error("Failed to fetch OTP:", error);
    return NextResponse.json({ error: "Failed to fetch OTP" }, { status: 500 });
  }
}
