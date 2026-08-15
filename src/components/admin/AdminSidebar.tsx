"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

const NAV_LINKS = [
  { name: "ภาพรวม (Overview)", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "คิวงานสัก (Appointments)", href: "/admin/appointments", icon: Calendar },
  { name: "รายชื่อลูกค้า (Clients)", href: "/admin/clients", icon: Users },
  { name: "จัดการช่างสัก (Artists)", href: "/admin/artists", icon: Users },
  { name: "จัดการผลงาน (Portfolio)", href: "/admin/portfolio", icon: ImageIcon },
  { name: "ตารางงาน (Calendar)", href: "/admin/calendar", icon: Calendar },
  { name: "รายงาน (Reports)", href: "/admin/reports", icon: LayoutDashboard },
  { name: "ตั้งค่า (Settings)", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ role = "artist" }: { role?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background-dark/95 border-b border-border-dark sticky top-0 z-40 backdrop-blur-md">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="157 Logo" className="h-8 w-auto mix-blend-screen" />
          <span className="font-gothic text-xl tracking-widest">DASHBOARD</span>
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
        <div className="p-6 border-b border-border-dark flex items-center justify-between hidden md:flex">
          <Link href="/admin/dashboard" className="flex flex-col items-center gap-3 w-full">
            <img src="/images/logo.png" alt="157 Logo" className="h-16 w-auto mix-blend-screen opacity-90" />
            <h1 className="text-xl font-gothic tracking-widest text-center mt-2 border-t border-border-dark pt-4 w-full">
              {role === 'admin' ? 'ADMIN PANEL' : 'ARTIST PANEL'}
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16 md:mt-0">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
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

        <div className="p-4 border-t border-border-dark">
          <form action="/auth/signout" method="post">
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
