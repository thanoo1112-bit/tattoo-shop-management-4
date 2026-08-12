import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "artist";

  // Fetch artist data if they are an artist
  let artist = null;
  if (role === "artist") {
    const { data: artistRecord } = await supabase
      .from("artists")
      .select("*")
      .eq("profile_id", user.id)
      .single();
      
    artist = artistRecord;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">
          ตั้งค่า (Settings)
        </h1>
        <p className="text-text-secondary text-sm mt-1">จัดการข้อมูลส่วนตัวและบัญชีรับเงินของคุณ</p>
      </div>

      {role === 'admin' ? (
        <div className="raw-panel p-6 border border-border-dark max-w-2xl text-center">
          <p className="text-text-secondary">ผู้ดูแลระบบ (Admin) ไม่จำเป็นต้องตั้งค่า QR Code รับเงิน</p>
          <p className="text-xs mt-2 opacity-50">สำหรับช่างสัก (Artist) เท่านั้น</p>
        </div>
      ) : (
        artist ? (
          <SettingsForm artist={artist} />
        ) : (
          <div className="raw-panel p-6 border border-red-500/20 max-w-2xl bg-red-500/5">
            <h3 className="text-red-400 font-bold mb-2">ไม่พบโปรไฟล์ช่างสัก</h3>
            <p className="text-sm text-text-secondary">ระบบไม่พบข้อมูลของคุณในตาราง Artists กรุณาติดต่อ Admin เพื่อให้ผูกบัญชีเข้ากับโปรไฟล์ช่างของคุณ</p>
          </div>
        )
      )}
    </div>
  );
}
