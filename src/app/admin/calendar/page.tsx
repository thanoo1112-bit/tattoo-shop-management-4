import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CalendarView from "@/components/calendar/CalendarView";

export const revalidate = 0;

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const resolvedParams = await searchParams;

  // Determine current month and year from params or use current date
  const today = new Date();
  const year = resolvedParams.year ? parseInt(resolvedParams.year, 10) : today.getFullYear();
  const month = resolvedParams.month ? parseInt(resolvedParams.month, 10) : today.getMonth() + 1;

  // Calculate start and end dates for the database query
  // We want to fetch all appointments that overlap with this month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0); // Last day of the month
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T23:59:59`;

  // Fetch all appointments for the month (Admin sees all)
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, artists(name)")
    .gte("preferred_date", startDate)
    .lte("preferred_date", endDateStr)
    .order("preferred_date", { ascending: true });

  // Fetch all artists for the filter
  const { data: artists } = await supabase
    .from("artists")
    .select("id, name");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">
            ตารางงานร้าน (Master Calendar)
          </h1>
          <p className="text-text-secondary text-sm mt-1">ภาพรวมคิวงานทั้งหมดของช่างทุกคน</p>
        </div>
      </div>

      <CalendarView 
        mode="admin"
        appointments={appointments || []}
        artists={artists || []}
        year={year}
        month={month}
      />
    </div>
  );
}
