"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, X, User } from "lucide-react";

// Types
type Appointment = {
  id: string;
  guest_name: string;
  guest_email: string;
  artist_id: string;
  preferred_date: string;
  status: string;
  artists?: { name: string };
  style?: string;
  deposit_amount?: number;
};

type Artist = {
  id: string;
  name: string;
};

interface CalendarViewProps {
  mode: "admin" | "artist";
  appointments: Appointment[];
  artists?: Artist[];
  year: number;
  month: number; // 1-12
}

// Fixed color palette for Artists (Admin mode) - Dark Gothic Theme
const ARTIST_COLORS = [
  "bg-slate-600", "bg-purple-900", "bg-rose-900", "bg-cyan-900", "bg-amber-800", "bg-stone-700"
];

// Status colors (Artist mode)
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-amber-600";
    case "approved": return "bg-emerald-700";
    case "completed": return "bg-zinc-500";
    case "rejected": return "bg-red-900";
    default: return "bg-gray-700";
  }
};

export default function CalendarView({ mode, appointments, artists = [], year, month }: CalendarViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [filterArtist, setFilterArtist] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modals
  const [selectedDayApps, setSelectedDayApps] = useState<Appointment[] | null>(null);
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);

  // Month Navigation
  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth.toString());
    params.set("year", newYear.toString());
    router.push(`?${params.toString()}`);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth.toString());
    params.set("year", newYear.toString());
    router.push(`?${params.toString()}`);
  };

  const handleToday = () => {
    const today = new Date();
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", (today.getMonth() + 1).toString());
    params.set("year", today.getFullYear().toString());
    router.push(`?${params.toString()}`);
  };

  // Calendar Calculation
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });

  // Grid Data
  const days = [];
  
  // Leading days (Previous Month)
  const prevMonthYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({
      day: daysInPrevMonth - firstDayOfMonth + i + 1,
      month: prevMonth,
      year: prevMonthYear,
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }
  
  // Trailing days (Next Month) to fill exactly 42 slots (6 weeks)
  const nextMonthYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      month: nextMonth,
      year: nextMonthYear,
      isCurrentMonth: false
    });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  // Map artist ID to color
  const artistColorMap: Record<string, string> = {};
  artists.forEach((a, i) => {
    artistColorMap[a.id] = ARTIST_COLORS[i % ARTIST_COLORS.length];
  });

  // Filter appointments
  const filteredApps = appointments.filter(app => {
    if (filterArtist !== "all" && app.artist_id !== filterArtist) return false;
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    return true;
  });

  const getAppsForDay = (y: number, m: number, d: number) => {
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return filteredApps.filter(app => app.preferred_date && app.preferred_date.startsWith(dateStr));
  };

  const handleDayClick = (y: number, m: number, d: number, apps: Appointment[]) => {
    if (apps.length === 0) return;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    setSelectedDayStr(dateStr);
    setSelectedDayApps(apps);
  };

  const renderAppBadge = (app: Appointment) => {
    const colorClass = mode === "admin" 
      ? (artistColorMap[app.artist_id] || "bg-gray-500")
      : getStatusColor(app.status);
    
    return (
      <div 
        key={app.id} 
        onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
        className={`${colorClass} w-2 h-2 rounded-full md:w-full md:h-auto md:px-1.5 md:py-0.5 md:rounded-sm text-transparent md:text-white text-[10px] truncate cursor-pointer hover:opacity-80 transition-opacity md:mb-1 flex items-center md:gap-1 shrink-0`}
        title={app.guest_name}
      >
        {/* Status indicator dot if in Admin mode (Desktop only) */}
        {mode === "admin" && (
          <span className={`hidden md:inline-block w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(app.status)}`} />
        )}
        <span className="hidden md:inline truncate">{app.guest_name}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 bg-background-dark/80 p-3 md:p-4 border border-border-dark backdrop-blur-md rounded-lg">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl md:text-2xl font-gothic tracking-widest uppercase">
            {monthName} {year}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-sm bg-white/5"><ChevronLeft size={18} /></button>
            <button onClick={handleToday} className="px-3 py-1.5 text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 rounded-sm bg-white/5 font-bold">Today</button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-sm bg-white/5"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 w-full">
          {mode === "admin" && artists.length > 0 && (
            <select 
              value={filterArtist} 
              onChange={e => setFilterArtist(e.target.value)}
              className="input-raw text-xs py-2 px-3 w-full sm:w-auto"
            >
              <option value="all">ทุกช่าง (All Artists)</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          )}
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="input-raw text-xs py-2 px-3 w-full sm:w-auto"
          >
            <option value="all">ทุกสถานะ (All Status)</option>
            <option value="pending">รอตรวจ (Pending)</option>
            <option value="approved">อนุมัติแล้ว (Approved)</option>
            <option value="completed">เสร็จสิ้น (Completed)</option>
            <option value="rejected">ปฏิเสธ (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Admin Color Legend */}
      {mode === "admin" && artists.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center gap-3 text-xs bg-black/40 p-3 rounded-lg border border-border-dark">
          <div className="flex flex-wrap gap-3">
            {artists.map((a, i) => (
              <div key={a.id} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full md:rounded-sm ${ARTIST_COLORS[i % ARTIST_COLORS.length]}`}></span>
                <span>{a.name}</span>
              </div>
            ))}
          </div>
          <div className="md:border-l md:border-border-dark md:pl-3 flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t border-border-dark md:border-t-0 mt-1 md:mt-0">
            <span className="text-text-secondary">สถานะ:</span>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600"></span><span className="text-[10px]">รอตรวจ</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-700"></span><span className="text-[10px]">อนุมัติแล้ว</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-500"></span><span className="text-[10px]">เสร็จสิ้น</span></div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="border border-border-dark bg-black/20">
        <div className="grid grid-cols-7 border-b border-border-dark">
          {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map(day => (
            <div key={day} className="py-2 text-center text-xs font-medium text-text-secondary uppercase tracking-widest border-r border-border-dark last:border-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[70px] md:auto-rows-[120px]">
          {days.map((cell, index) => {
            const dateStr = `${cell.year}-${String(cell.month).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
            const isToday = dateStr === todayStr;
            const dayApps = getAppsForDay(cell.year, cell.month, cell.day);
            const hasApps = dayApps.length > 0;

            return (
              <div 
                key={`${cell.year}-${cell.month}-${cell.day}-${index}`} 
                onClick={() => handleDayClick(cell.year, cell.month, cell.day, dayApps)}
                className={`border-r border-b border-border-dark/50 p-1 md:p-2 transition-colors relative group
                  ${isToday ? 'bg-white/10' : 'hover:bg-white/5'}
                  ${!cell.isCurrentMonth ? 'opacity-40' : ''}
                  ${hasApps ? 'cursor-pointer' : ''}
                `}
              >
                <div className={`text-[10px] md:text-xs font-bold mb-1 flex justify-center md:justify-start ${isToday ? 'text-white' : 'text-text-secondary'}`}>
                  {isToday ? <span className="bg-white text-black px-1.5 py-0.5 rounded-sm">{cell.day}</span> : cell.day}
                </div>
                
                {/* Apps list - Dots on Mobile, Badges on Desktop */}
                <div className="flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-1 md:gap-0.5 overflow-hidden max-h-[40px] md:max-h-[80px]">
                  {dayApps.slice(0, 4).map(renderAppBadge)}
                  {dayApps.length > 4 && (
                    <div className="text-[8px] md:text-[10px] text-text-secondary pl-1 font-medium hidden md:block">
                      +{dayApps.length - 4} คิว
                    </div>
                  )}
                  {dayApps.length > 4 && (
                    <div className="text-[8px] text-text-secondary font-medium block md:hidden self-center ml-0.5">
                      +{dayApps.length - 4}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {/* Day Modal */}
      {selectedDayApps && selectedDayStr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDayApps(null)}>
          <div className="raw-panel p-6 max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-border-dark pb-4">
              <h3 className="text-xl font-gothic tracking-widest">คิวงานวันที่ {selectedDayStr}</h3>
              <button onClick={() => setSelectedDayApps(null)} className="text-text-secondary hover:text-white"><X size={20}/></button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3">
              {selectedDayApps.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  ไม่มีคิวงานในวันนี้
                </div>
              ) : (
                selectedDayApps.map(app => (
                  <div key={app.id} onClick={() => setSelectedApp(app)} className="border border-border-dark p-3 hover:bg-white/5 cursor-pointer transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`}></span>
                        {app.guest_name}
                      </div>
                      {mode === "admin" && <div className="text-xs text-text-secondary mt-1 flex items-center gap-1"><User size={12}/> {app.artists?.name || "ไม่ระบุช่าง"}</div>}
                    </div>
                    <div className="text-xs uppercase px-2 py-1 bg-white/10 rounded-sm">
                      {app.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* App Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedApp(null)}>
          <div className="raw-panel p-6 max-w-md w-full border border-border-dark bg-background-dark" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-gothic tracking-widest">{selectedApp.guest_name}</h3>
                <p className="text-sm text-text-secondary">{selectedApp.guest_email}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-text-secondary hover:text-white p-1 bg-white/5 rounded-sm"><X size={20}/></button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-border-dark pb-2">
                <span className="text-text-secondary">วันที่</span>
                <span>{selectedApp.preferred_date}</span>
              </div>
              <div className="flex justify-between border-b border-border-dark pb-2">
                <span className="text-text-secondary">ช่างสัก</span>
                <span>{selectedApp.artists?.name || "ไม่ระบุ"}</span>
              </div>
              <div className="flex justify-between border-b border-border-dark pb-2">
                <span className="text-text-secondary">สถานะ</span>
                <span className={`px-2 py-0.5 rounded-sm text-xs font-bold text-white uppercase tracking-wider ${getStatusColor(selectedApp.status)}`}>
                  {selectedApp.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-border-dark pb-2">
                <span className="text-text-secondary">สไตล์/รายละเอียด</span>
                <span className="text-right max-w-[200px] truncate">{selectedApp.style || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-border-dark pb-2">
                <span className="text-text-secondary">มัดจำ</span>
                <span>{selectedApp.deposit_amount ? `฿${selectedApp.deposit_amount}` : "ยังไม่ระบุ"}</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border-dark text-center">
              <p className="text-xs text-text-secondary mb-3">ต้องการจัดการสถานะคิวงานนี้?</p>
              <button 
                onClick={() => {
                  router.push(mode === "admin" ? "/admin/appointments" : "/artist/appointments");
                }}
                className="w-full py-2 bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-accent-silver transition-colors"
              >
                ไปที่หน้า จัดการคิว (Appointments)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
