import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AppointmentRow from "@/app/admin/AppointmentRow";
import { Calendar } from "lucide-react";

export const revalidate = 0;

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch artist link
  const { data: artistRecord } = await supabase
    .from("artists")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!artistRecord) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <h2 className="text-xl font-gothic tracking-widest text-red-400">Profile Not Linked</h2>
        <p className="text-text-secondary mt-2">ยังไม่ได้เชื่อมโยงบัญชีนี้เข้ากับรายชื่อช่าง กรุณาติดต่อ Admin หรือไปที่เมนูตั้งค่า</p>
      </div>
    );
  }

  const artistId = artistRecord.id;

  // Fetch Appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, artists(name)")
    .eq("artist_id", artistId)
    .order("preferred_date", { ascending: true }) // Order by date for the calendar view
    .order("created_at", { ascending: false });

  // Group appointments by date
  const upcomingApps = appointments?.filter(a => a.preferred_date && new Date(a.preferred_date) >= new Date()) || [];
  const pastApps = appointments?.filter(a => a.preferred_date && new Date(a.preferred_date) < new Date()) || [];
  const noDateApps = appointments?.filter(a => !a.preferred_date) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase flex items-center gap-3">
            <Calendar size={28} className="opacity-80" /> คิวงานสัก (Appointments)
          </h1>
          <p className="text-text-secondary text-sm mt-1">จัดการคิวงานสักทั้งหมดของคุณ เรียงตามวันที่</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Upcoming */}
        <section>
          <h2 className="text-lg font-gothic tracking-widest uppercase mb-4 text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> คิวที่กำลังจะถึง (Upcoming)
          </h2>
          <div className="raw-panel p-0 overflow-hidden border border-border-dark">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border-dark text-xs uppercase tracking-widest text-text-secondary bg-black/20">
                    <th className="p-4 font-medium">ลูกค้า (Client)</th>
                    <th className="p-4 font-medium">ช่างสัก (Artist)</th>
                    <th className="p-4 font-medium">รายละเอียดงาน (Style/Request)</th>
                    <th className="p-4 font-medium">วันที่ (Date)</th>
                    <th className="p-4 font-medium">สถานะ (Status)</th>
                    <th className="p-4 font-medium text-right">อัปเดต (Update)</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingApps.length > 0 ? (
                    upcomingApps.map((app) => <AppointmentRow key={app.id} app={app} />)
                  ) : (
                    <tr><td colSpan={6} className="p-8 text-center text-text-secondary text-sm">ไม่มีคิวงานที่กำลังจะถึง</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* No Date Specified */}
        {noDateApps.length > 0 && (
          <section>
            <h2 className="text-lg font-gothic tracking-widest uppercase mb-4 text-yellow-400">
              รอระบุวันที่ (TBD)
            </h2>
            <div className="raw-panel p-0 overflow-hidden border border-border-dark">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <tbody>
                    {noDateApps.map((app) => <AppointmentRow key={app.id} app={app} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Past */}
        <section>
          <h2 className="text-lg font-gothic tracking-widest uppercase mb-4 text-text-secondary">
            คิวที่ผ่านมาแล้ว (Past Appointments)
          </h2>
          <div className="raw-panel p-0 overflow-hidden border border-border-dark opacity-70 hover:opacity-100 transition-opacity">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <tbody>
                  {pastApps.length > 0 ? (
                    pastApps.map((app) => <AppointmentRow key={app.id} app={app} />)
                  ) : (
                    <tr><td colSpan={6} className="p-8 text-center text-text-secondary text-sm">ไม่มีประวัติคิวงาน</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
