import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import PortfolioManager from "./PortfolioManager";

export default async function ArtistPortfolioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch artist link
  const { data: artistRecord } = await supabase
    .from("artists")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!artistRecord) {
    return (
      <div className="min-h-screen bg-background-dark p-8 flex items-center justify-center">
        <div className="text-center text-text-secondary">
          <p>คุณยังไม่ได้เชื่อมโยงกับโปรไฟล์ช่างสัก (Artist Profile)</p>
          <p>กรุณาติดต่อแอดมินเพื่อตั้งค่า</p>
          <Link href="/artist" className="mt-4 inline-block text-white underline">กลับไปหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/artist" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> กลับสู่หน้าหลักช่างสัก (Back to Dashboard)
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8 border-b border-border-dark pb-4">
          <ImageIcon className="text-white" size={32} />
          <h1 className="text-3xl font-gothic tracking-widest uppercase">My Portfolio & Flash</h1>
        </div>

        {/* Client Component for managing portfolios with tabs and upload modal */}
        <PortfolioManager artistId={artistRecord.id} />
      </div>
    </div>
  );
}
