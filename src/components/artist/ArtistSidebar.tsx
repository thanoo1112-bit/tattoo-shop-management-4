"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Users, Briefcase, Settings, LogOut, Image as ImageIcon, Menu, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const NAV_LINKS = [
  { name: "ภาพรวม (Overview)", href: "/artist/dashboard", icon: Calendar },
  { name: "คิวงานสัก (Appointments)", href: "/artist/appointments", icon: Calendar },
  { name: "จัดการผลงาน (Portfolio)", href: "/artist/portfolio", icon: ImageIcon },
  { name: "ตั้งค่า (Settings)", href: "/artist/settings", icon: Settings },
];

export default function ArtistSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background-dark/95 border-b border-border-dark sticky top-0 z-40 backdrop-blur-md">
        <Link href="/artist/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-border-dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-white">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>
          <span className="font-gothic text-xl tracking-widest">ARTIST</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-background-dark/95 md:bg-transparent raw-panel border-r border-border-dark border-t-0 border-b-0 border-l-0 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border-dark items-center justify-between hidden md:flex">
          <Link href="/artist/dashboard" className="flex flex-col items-center gap-3 w-full">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-border-dark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-white">
                <path d="M12 2L2 22h20L12 2z" />
                <path d="M12 8l4 10H8l4-10z" stroke="currentColor" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>
            <h1 className="text-xl font-gothic tracking-widest text-center mt-2 border-t border-border-dark pt-4 w-full">
              ARTIST PANEL
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16 md:mt-0">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-all uppercase tracking-wider ${
                  isActive 
                    ? "bg-white/10 text-white border-l-2 border-white" 
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "opacity-100" : "opacity-70"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-dark mt-auto">
          <form onSubmit={handleLogout}>
            <button 
              type="submit"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider w-full text-left"
            >
              <LogOut size={18} className="opacity-70" />
              ออกจากระบบ (LOGOUT)
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
