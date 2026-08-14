import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";
import LinkProfile from "./LinkProfile";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch artist data
  let artist = null;
  let allArtists = [];

  const { data: artistRecord } = await supabase
    .from("artists")
    .select("*")
    .eq("profile_id", user.id)
    .single();
    
  artist = artistRecord;

  if (!artist) {
    const { data: artistsData } = await supabase
      .from("artists")
      .select("*");
    allArtists = artistsData || [];
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">
          ตั้งค่า (Settings)
        </h1>
        <p className="text-text-secondary text-sm mt-1">จัดการข้อมูลส่วนตัวและบัญชีรับเงินของคุณ</p>
      </div>

      {artist ? (
        <SettingsForm artist={artist} />
      ) : (
        <LinkProfile artists={allArtists} />
      )}
    </div>
  );
}
