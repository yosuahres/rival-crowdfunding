import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TRANSFER_PROOF_BUCKET = "transfer-proofs";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceNumber = searchParams.get("invoice");

    if (!invoiceNumber) {
      return NextResponse.json({ error: "Missing invoice number." }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase storage is not configured on server." },
        { status: 500 },
      );
    }

    const { data: files, error: listError } = await supabase.storage
      .from(TRANSFER_PROOF_BUCKET)
      .list(invoiceNumber);

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ files: [] });
    }

    const filePaths = files.map((f) => `${invoiceNumber}/${f.name}`);

    const { data: signedUrls, error: signedError } = await supabase.storage
      .from(TRANSFER_PROOF_BUCKET)
      .createSignedUrls(filePaths, 60 * 60); // 1 hour expiry

    if (signedError) {
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }

    return NextResponse.json({
      files: (signedUrls || []).map((s) => ({
        path: s.path,
        signedUrl: s.signedUrl,
      })),
    });
  } catch (err) {
    console.error("Transfer proof list error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const invoiceNumber = formData.get("invoice_number");
    const file = formData.get("file");

    if (!invoiceNumber || typeof invoiceNumber !== "string") {
      return NextResponse.json({ error: "Invoice number is required." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Transfer proof file is required." }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Uploaded file cannot be empty." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, or PDF files are allowed." },
        { status: 400 },
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase storage is not configured on server." },
        { status: 500 },
      );
    }

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .select("id")
      .eq("doku_reference_id", invoiceNumber)
      .single();

    if (donationError || !donation) {
      return NextResponse.json({ error: "Donation invoice not found." }, { status: 404 });
    }

    const fileExtension = (file.name.split(".").pop() || "bin").toLowerCase();
    const sanitizedExtension = fileExtension.replace(/[^a-z0-9]/g, "") || "bin";
    const filePath = `${invoiceNumber}/${Date.now()}-${randomUUID()}.${sanitizedExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(TRANSFER_PROOF_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError.message}`,
          bucket: TRANSFER_PROOF_BUCKET,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Transfer proof uploaded successfully.",
        bucket: TRANSFER_PROOF_BUCKET,
        path: filePath,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Transfer proof upload error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
