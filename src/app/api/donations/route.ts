import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQris } from "@/lib/doku";

function generateReferenceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `DON-${timestamp}-${random}`.toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      donor_name,
      donor_email,
      donor_phone,
      donor_address,
      donor_gender,
      amount,
      package_id,
      campaign_id,
    } = body;

    // ── Validation ──
    if (!donor_name || typeof donor_name !== "string" || donor_name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!donor_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor_email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!donor_phone || typeof donor_phone !== "string" || donor_phone.trim().length === 0) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    if (!donor_address || typeof donor_address !== "string" || donor_address.trim().length === 0) {
      return NextResponse.json({ error: "Address is required." }, { status: 400 });
    }

    if (!["male", "female", "other"].includes(donor_gender)) {
      return NextResponse.json(
        { error: "Gender must be male, female, or other." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // ── Resolve amount ──
    let finalAmount: number;
    let resolvedCampaignId: string | null = campaign_id || null;

    if (package_id) {
      // Look up the package from donation_packages
      const { data: pkg, error: pkgError } = await supabase
        .from("donation_packages")
        .select("amount, campaign_id")
        .eq("id", package_id)
        .single();

      if (pkgError || !pkg) {
        return NextResponse.json({ error: "Invalid package selected." }, { status: 400 });
      }

      finalAmount = Number(pkg.amount);
      resolvedCampaignId = pkg.campaign_id ?? resolvedCampaignId;
    } else {
      // Custom amount
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount < 5000) {
        return NextResponse.json({ error: "Minimum donation is IDR 5,000." }, { status: 400 });
      }
      finalAmount = parsedAmount;
    }

    // ── Insert into Supabase ──
    const doku_reference_id = generateReferenceId();

    const { data, error } = await supabase
      .from("donations")
      .insert({
        campaign_id: resolvedCampaignId,
        donor_name: donor_name.trim(),
        donor_email: donor_email.trim(),
        donor_phone: donor_phone.trim(),
        donor_address: donor_address.trim(),
        donor_gender,
        amount: finalAmount,
        package_id: package_id || null,
        doku_reference_id,
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create donation. Please try again." },
        { status: 500 },
      );
    }

    // ── Return static QRIS while DOKU account is under review ──
    // TODO: Re-enable DOKU SNAP QRIS once account & service are approved
    // const dokuResponse = await generateQris({ invoiceNumber: doku_reference_id, amount: finalAmount });

    return NextResponse.json(
      {
        message: "Donation created successfully.",
        donation: data,
        payment: {
          qr_content: null,
          expired_date: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          invoice_number: doku_reference_id,
          reference_no: null,
          amount: finalAmount,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Donations API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
