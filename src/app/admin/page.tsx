import { createClient } from "@/lib/supabase/server";
import ExportExcelButton from "@/components/ExportExcelButton";

export default async function DonationsPage() {
  const supabase = await createClient();
  const { data: donations } = await supabase.from("donations").select("*");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Data</h2>
        <ExportExcelButton donations={donations ?? []} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4 font-semibold">Donatur</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donations?.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium">{d.donor_name}</div>
                  <div className="text-xs text-gray-400">{d.donor_email}</div>
                </td>
                <td className="p-4 text-sm text-gray-500">{d.donor_address}</td>
                <td className="p-4 font-bold text-gray-900">Rp{d.amount}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      d.payment_status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.payment_status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(d.created_at!).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
