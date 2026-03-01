import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaign_id");

    const supabase = await createClient();

    let query = supabase.from("donation_packages").select("*").order("amount", { ascending: true });

    if (campaignId) {
      query = query.eq("campaign_id", campaignId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Packages fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch packages." }, { status: 500 });
    }

    return NextResponse.json({ packages: data });
  } catch (err) {
    console.error("Packages API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
