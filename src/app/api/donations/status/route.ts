import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { queryQris } from "@/lib/doku";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceNumber = searchParams.get("invoice");

    if (!invoiceNumber) {
      return NextResponse.json({ error: "Missing invoice number." }, { status: 400 });
    }

    const supabase = await createClient();

    // First check our DB
    const { data: donation, error: dbError } = await supabase
      .from("donations")
      .select("id, payment_status, amount, doku_reference_id, doku_invoice_id")
      .eq("doku_reference_id", invoiceNumber)
      .single();

    if (dbError || !donation) {
      return NextResponse.json({ error: "Donation not found." }, { status: 404 });
    }

    // If already success or failed, return immediately
    if (donation.payment_status === "success") {
      return NextResponse.json({ status: "success", amount: donation.amount });
    }

    if (donation.payment_status === "failed") {
      return NextResponse.json({ status: "failed", amount: donation.amount });
    }

    // Still pending — query DOKU QRIS for real-time status
    try {
      const dokuResult = await queryQris({
        originalReferenceNo: donation.doku_invoice_id || invoiceNumber,
        originalPartnerReferenceNo: invoiceNumber,
      });

      // Map DOKU status: "00" = Success
      let status = "pending";
      if (dokuResult.latestTransactionStatus === "00") {
        status = "success";
      } else if (
        dokuResult.latestTransactionStatus === "06" ||
        dokuResult.latestTransactionStatus === "03"
      ) {
        status = "failed";
      }

      // If DOKU says paid or failed, update our DB
      if (status === "success" || status === "failed") {
        await supabase.from("donations").update({ payment_status: status }).eq("id", donation.id);
      }

      return NextResponse.json({
        status,
        amount: donation.amount,
      });
    } catch {
      // DOKU check failed, return DB status
      return NextResponse.json({
        status: donation.payment_status || "pending",
        amount: donation.amount,
      });
    }
  } catch (err) {
    console.error("Payment status check error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
