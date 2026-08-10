import { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | 157 TATTOO",
  description: "Artist management dashboard for 157 TATTOO.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background-dark text-text-primary">
      {/* Sidebar Component handles both desktop sidebar and mobile drawer */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle background texture for the admin area */}
          <div className="absolute inset-0 bg-ink-smoke opacity-20 pointer-events-none z-0 fixed mix-blend-screen"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
