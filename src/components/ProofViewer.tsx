"use client";

import { useState } from "react";

export default function ProofViewer({ invoiceNumber }: { invoiceNumber: string }) {
  const [loading, setLoading] = useState(false);

  const openProofs = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/donations/proof?invoice=${encodeURIComponent(invoiceNumber)}`);
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to load proofs.");
        return;
      }

      const files: { signedUrl: string }[] = result.files || [];

      if (files.length === 0) {
        alert("No transfer proof uploaded for this invoice.");
        return;
      }

      for (const file of files) {
        window.open(file.signedUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      alert("Network error while loading proofs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={openProofs}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      {loading ? "Loading..." : "Proof"}
    </button>
  );
}
