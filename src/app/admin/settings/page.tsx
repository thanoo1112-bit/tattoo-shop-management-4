import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";
import LinkProfile from "./LinkProfile";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">
          ตั้งค่า (Settings)
        </h1>
        <p className="text-text-secondary text-sm mt-1">จัดการข้อมูลส่วนตัวและบัญชีรับเงินของคุณ</p>
      </div>

      <div className="raw-panel p-6 border border-border-dark max-w-2xl text-center">
        <p className="text-text-secondary">ผู้ดูแลระบบ (Admin) ไม่จำเป็นต้องตั้งค่า QR Code รับเงิน</p>
        <p className="text-xs mt-2 opacity-50">สำหรับช่างสัก (Artist) เท่านั้น</p>
      </div>
    </div>
  );
}
