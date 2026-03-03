"use client";

import * as XLSX from "xlsx";

type Donation = {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_address: string;
  donor_gender: string | null;
  amount: number;
  payment_status: string | null;
  created_at: string | null;
};

export default function ExportExcelButton({ donations }: { donations: Donation[] }) {
  const handleExport = () => {
    const rows = donations.map((d) => ({
      Donatur: d.donor_name,
      Email: d.donor_email,
      Phone: d.donor_phone,
      Address: d.donor_address,
      Gender: d.donor_gender ?? "-",
      "Total (Rp)": d.amount,
      Status: d.payment_status ?? "-",
      Tanggal: d.created_at ? new Date(d.created_at).toLocaleDateString() : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

    // Auto-size columns
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String(r[key as keyof typeof r]).length)) + 2,
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, `donations-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl border border-black hover:bg-gray-100 transition-colors cursor-pointer"
    >
      Download Excel
    </button>
  );
}
