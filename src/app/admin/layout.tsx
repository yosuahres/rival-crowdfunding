import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex gap-6 items-center">
          <h1 className="text-xl font-bold text-gray-800 mr-4">Admin</h1>
        </div>
      </nav>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
