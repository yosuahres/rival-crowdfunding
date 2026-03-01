import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const supabase = await createClient();

    if (id) {
      // Fetch single campaign with its packages
      const { data, error } = await supabase
        .from("campaigns")
        .select("*, donation_packages(*)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Campaign fetch error:", error);
        return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
      }

      return NextResponse.json({ campaign: data });
    }

    // Fetch all active campaigns
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Campaigns fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch campaigns." }, { status: 500 });
    }

    return NextResponse.json({ campaigns: data });
  } catch (err) {
    console.error("Campaigns API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
