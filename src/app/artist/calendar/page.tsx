import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CalendarView from "@/components/calendar/CalendarView";

export const revalidate = 0;

export default async function ArtistCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const resolvedParams = await searchParams;

  // Fetch artist link
  const { data: artistRecord } = await supabase
    .from("artists")
    .select("id, name")
    .eq("profile_id", user.id)
    .single();

  if (!artistRecord) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <h2 className="text-xl font-gothic tracking-widest text-red-400">Profile Not Linked</h2>
        <p className="text-text-secondary mt-2">ยังไม่ได้เชื่อมโยงบัญชีนี้เข้ากับรายชื่อช่าง</p>
      </div>
    );
  }

  // Determine current month and year from params or use current date
  const today = new Date();
  const year = resolvedParams.year ? parseInt(resolvedParams.year, 10) : today.getFullYear();
  const month = resolvedParams.month ? parseInt(resolvedParams.month, 10) : today.getMonth() + 1;

  // Calculate start and end dates for the database query
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0); // Last day of the month
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T23:59:59`;

  // Fetch only this artist's appointments for the month
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, artists(name)")
    .eq("artist_id", artistRecord.id)
    .gte("preferred_date", startDate)
    .lte("preferred_date", endDateStr)
    .order("preferred_date", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">
            ตารางงานของคุณ (Your Calendar)
          </h1>
          <p className="text-text-secondary text-sm mt-1">คิวงานสักเฉพาะของคุณ (ช่าง {artistRecord.name})</p>
        </div>
      </div>

      <CalendarView 
        mode="artist"
        appointments={appointments || []}
        year={year}
        month={month}
      />
    </div>
  );
}
