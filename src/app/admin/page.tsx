import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CalendarClock, CheckCircle, Clock, Users, LogOut } from "lucide-react";
import AppointmentRow from "./AppointmentRow";

export const revalidate = 0; // Disable caching for the dashboard

export default async function AdminDashboard() {
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

  // Fetch artist link if role is artist
  let artistId = null;
  if (role === "artist") {
    const { data: artistRecord } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (artistRecord) artistId = artistRecord.id;
  }

  // Fetch Appointments
  let appointmentsQuery = supabase
    .from("appointments")
    .select("*, artists(name)")
    .order("created_at", { ascending: false });

  if (role === "artist" && artistId) {
    appointmentsQuery = appointmentsQuery.eq("artist_id", artistId);
  }

  const { data: appointments } = await appointmentsQuery;
  const totalBookings = appointments?.length || 0;
  const pendingCount = appointments?.filter(a => a.status === "pending").length || 0;
  const completedCount = appointments?.filter(a => a.status === "completed").length || 0;
  
  // Quick hack to count unique clients
  const uniqueClients = new Set(appointments?.map(a => a.guest_email)).size;

  const STATS = [
    { label: "คิวจองทั้งหมด (Total Bookings)", value: totalBookings, icon: CalendarClock, color: "text-blue-400" },
    { label: "รอตรวจสอบ (Pending)", value: pendingCount, icon: Clock, color: "text-yellow-400" },
    { label: "งานสักเสร็จสิ้น (Completed)", value: completedCount, icon: CheckCircle, color: "text-green-400" },
    { label: "ลูกค้า (Clients)", value: uniqueClients, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">
            {role === 'admin' ? 'ภาพรวมระบบ (Admin Dashboard)' : 'หน้าจัดการคิว (Artist Dashboard)'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">ยินดีต้อนรับกลับ สถานะสตูดิโอของคุณวันนี้</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="raw-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-background-dark border border-border-dark rounded-md ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-text-secondary text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
              </div>
              <p className="text-4xl font-gothic">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Master Calendar Placeholder (For Admins) */}
      {role === "admin" && (
        <div className="raw-panel p-6 border border-accent-silver/30">
          <h2 className="text-lg md:text-xl font-gothic tracking-widest uppercase mb-2">Master Calendar</h2>
          <p className="text-sm text-text-secondary">ตารางงานของช่างทุกคน (สามารถต่อยอดเป็น Calendar UI เต็มรูปแบบได้ในอนาคต)</p>
        </div>
      )}

      {/* Recent Appointments Table */}
      <div className="raw-panel p-0 overflow-hidden border border-border-dark">
        <div className="p-6 border-b border-border-dark flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-gothic tracking-widest uppercase">
            {role === 'admin' ? 'คิวจองทั้งหมด (All Requests)' : 'คำขอจองคิวของคุณ (Your Requests)'}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-dark text-xs uppercase tracking-widest text-text-secondary bg-black/20">
                <th className="p-4 font-medium">ลูกค้า (Client)</th>
                <th className="p-4 font-medium">ช่างสัก (Artist)</th>
                <th className="p-4 font-medium">รายละเอียดงาน (Style/Request)</th>
                <th className="p-4 font-medium">วันที่สะดวก (Date)</th>
                <th className="p-4 font-medium">สถานะ (Status)</th>
                <th className="p-4 font-medium text-right">อัปเดต (Update)</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((app) => (
                  <AppointmentRow key={app.id} app={app} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary text-sm">
                    ยังไม่มีข้อมูลคิวจองในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
