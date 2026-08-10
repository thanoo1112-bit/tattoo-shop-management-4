import { CalendarClock, CheckCircle, Clock, Users } from "lucide-react";

const MOCK_STATS = [
  { label: "คิวจองทั้งหมด (Total Bookings)", value: "128", icon: CalendarClock, color: "text-blue-400" },
  { label: "รอตรวจสอบ (Pending)", value: "14", icon: Clock, color: "text-yellow-400" },
  { label: "งานสักเสร็จสิ้น (Completed)", value: "95", icon: CheckCircle, color: "text-green-400" },
  { label: "ลูกค้า (Clients)", value: "112", icon: Users, color: "text-purple-400" },
];

const MOCK_APPOINTMENTS = [
  { id: "1", client: "Somchai K.", artist: "Artist 1 (Chicano)", date: "Oct 24, 2026", status: "pending", style: "Blackwork sleeve" },
  { id: "2", client: "Amanda R.", artist: "Artist 2 (Darkwork)", date: "Oct 25, 2026", status: "approved", style: "Demon chest piece" },
  { id: "3", client: "Kittipong M.", artist: "Artist 3 (Thai/Japan)", date: "Oct 28, 2026", status: "deposit_paid", style: "Traditional Thai back" },
  { id: "4", client: "Sarah J.", artist: "Artist 1 (Chicano)", date: "Nov 02, 2026", status: "completed", style: "Font lettering arm" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  approved: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  deposit_paid: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  completed: "bg-green-500/20 text-green-400 border-green-500/50",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">ภาพรวมระบบ (Dashboard Overview)</h1>
          <p className="text-text-secondary text-sm mt-1">ยินดีต้อนรับกลับ สถานะสตูดิโอของคุณวันนี้</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-raw text-sm max-w-xs">
            <option value="all">ช่างสักทั้งหมด (All Artists)</option>
            <option value="artist1">Artist 1</option>
            <option value="artist2">Artist 2</option>
            <option value="artist3">Artist 3</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {MOCK_STATS.map((stat) => {
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

      {/* Recent Appointments Table */}
      <div className="raw-panel p-0 overflow-hidden">
        <div className="p-6 border-b border-border-dark flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-gothic tracking-widest uppercase">คำขอจองล่าสุด (Recent Requests)</h2>
          <button className="text-xs uppercase tracking-widest font-bold border-b border-white hover:text-accent-silver hover:border-accent-silver transition-colors">
            ดูทั้งหมด (View All)
          </button>
        </div>
        
        {/* Mobile View (Cards) */}
        <div className="md:hidden flex flex-col">
          {MOCK_APPOINTMENTS.map((app) => (
            <div key={app.id} className="p-5 border-b border-border-dark last:border-b-0 space-y-3">
              <div className="flex justify-between items-start">
                <p className="font-bold">{app.client}</p>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-none font-bold ${STATUS_COLORS[app.status]}`}>
                  {app.status.replace("_", " ")}
                </span>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p><span className="opacity-50">Date:</span> {app.date}</p>
                <p><span className="opacity-50">Artist:</span> {app.artist}</p>
                <p><span className="opacity-50">Style:</span> {app.style}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-dark text-xs uppercase tracking-widest text-text-secondary bg-black/20">
                <th className="p-6 font-medium">ลูกค้า (Client)</th>
                <th className="p-6 font-medium">ช่างสัก (Artist)</th>
                <th className="p-6 font-medium">รายละเอียดงาน (Style/Request)</th>
                <th className="p-6 font-medium">วันที่ (Date)</th>
                <th className="p-6 font-medium">สถานะ (Status)</th>
                <th className="p-6 font-medium text-right">จัดการ (Action)</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_APPOINTMENTS.map((app) => (
                <tr key={app.id} className="border-b border-border-dark/50 last:border-b-0 hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold">{app.client}</td>
                  <td className="p-6 text-sm text-text-secondary">{app.artist}</td>
                  <td className="p-6 text-sm">{app.style}</td>
                  <td className="p-6 text-sm">{app.date}</td>
                  <td className="p-6">
                    <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border rounded-none font-bold ${STATUS_COLORS[app.status]}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-xs font-bold uppercase tracking-widest hover:text-accent-silver transition-colors">
                      ตรวจสอบ (Review)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
