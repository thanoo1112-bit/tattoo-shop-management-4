import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import AdminPortfolioManager from "./AdminPortfolioManager";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Since layout protects this route, we know user is admin.

  return (
    <div className="min-h-screen bg-background-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> กลับสู่หน้าหลักแอดมิน (Back to Dashboard)
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8 border-b border-border-dark pb-4">
          <ImageIcon className="text-white" size={32} />
          <h1 className="text-3xl font-gothic tracking-widest uppercase">Manage Portfolios</h1>
        </div>

        <AdminPortfolioManager />
      </div>
    </div>
  );
}
