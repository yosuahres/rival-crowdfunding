import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyNotificationSignature } from "@/lib/doku";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // ── Verify DOKU SNAP signature ──
    const timestamp = request.headers.get("X-TIMESTAMP") || "";
    const signature = request.headers.get("X-SIGNATURE") || "";
    const authorization = request.headers.get("Authorization") || "";
    const accessToken = authorization.replace("Bearer ", "");
    const notificationTarget = "/api/doku/notification";

    const isValid = verifyNotificationSignature(
      "POST",
      notificationTarget,
      accessToken,
      rawBody,
      timestamp,
      signature,
    );

    if (!isValid) {
      console.error("DOKU notification: invalid signature");
    }

    const invoiceNumber =
      body.partnerReferenceNo || body.originalPartnerReferenceNo || body.order?.invoice_number;

    const txnStatus = body.latestTransactionStatus || body.transaction?.status;

    if (!invoiceNumber) {
      console.error("DOKU notification: missing invoice number", body);
      return NextResponse.json({ error: "Missing invoice number" }, { status: 400 });
    }

    let paymentStatus: "success" | "failed" | "pending" = "pending";
    if (txnStatus === "00" || txnStatus === "SUCCESS") {
      paymentStatus = "success";
    } else if (
      txnStatus === "06" ||
      txnStatus === "03" ||
      txnStatus === "FAILED" ||
      txnStatus === "EXPIRED"
    ) {
      paymentStatus = "failed";
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("donations")
      .update({ payment_status: paymentStatus })
      .eq("doku_reference_id", invoiceNumber);

    if (error) {
      console.error("Failed to update donation status:", error);
      return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 });
    }

    console.log(
      `DOKU notification: invoice=${invoiceNumber} status=${txnStatus} → ${paymentStatus}`,
    );

    return NextResponse.json({
      responseCode: "2005500",
      responseMessage: "Request has been processed successfully",
    });
  } catch (err) {
    console.error("DOKU notification error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
