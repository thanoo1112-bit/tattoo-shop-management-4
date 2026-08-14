import { Metadata } from "next";
import { redirect } from "next/navigation";
import ArtistSidebar from "@/components/artist/ArtistSidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Artist Dashboard | 157 TATTOO",
  description: "Artist management dashboard for 157 TATTOO.",
};

export default async function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  let role = null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role) {
    role = profile.role;
  }

  if (role !== "artist" && role !== "admin") {
    // If not admin and not artist, it's an invalid role
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Unauthorized Role</h1>
          <p className="text-text-secondary">บัญชีของคุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Role: {role || 'ไม่มี'})</p>
          <form action="/login">
             <button className="px-4 py-2 bg-white text-black font-bold mt-4">กลับไปหน้าล็อกอิน</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background-dark text-text-primary">
      {/* Sidebar Component handles both desktop sidebar and mobile drawer */}
      <ArtistSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle background texture for the artist area */}
          <div className="absolute inset-0 bg-ink-smoke opacity-20 pointer-events-none z-0 fixed mix-blend-screen"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
