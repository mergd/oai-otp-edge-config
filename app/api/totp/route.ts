import { NextResponse } from "next/server";
import { authenticator } from "otplib";

export async function GET() {
  try {
    if (!process.env.TOTP_SECRET) {
      throw new Error("TOTP_SECRET is not configured");
    }

    const token = authenticator.generate(process.env.TOTP_SECRET);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Failed to generate TOTP:", error);
    return NextResponse.json(
      { error: "Failed to generate TOTP" },
      { status: 500 }
    );
  }
}
