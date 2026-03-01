import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");

  if (!data) {
    return NextResponse.json({ error: "Missing data parameter." }, { status: 400 });
  }

  try {
    // Generate QR code as PNG buffer
    const buffer = await QRCode.toBuffer(data, {
      type: "png",
      width: 400,
      margin: 2,
      errorCorrectionLevel: "M",
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("QR code generation error:", err);
    return NextResponse.json({ error: "Failed to generate QR code." }, { status: 500 });
  }
}
