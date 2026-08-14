"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Menu, X } from "lucide-react";
import PublicPortfolio from "@/components/public/PublicPortfolio";
import PublicArtists from "@/components/public/PublicArtists";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-flash-wall">
      {/* Dark overlay for the whole page to make the flash wall faint */}
      <div className="fixed inset-0 bg-background-dark/90 pointer-events-none z-[-1]"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 raw-panel bg-background-dark/95 border-b-0 py-3 px-4 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/images/logo.png" alt="157 Logo" className="h-8 md:h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-gothic tracking-widest text-text-primary z-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            157 TATTOO
          </h1>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-text-secondary">
          <Link href="#portfolio" className="hover:text-accent-silver transition-colors">ผลงาน (Portfolio)</Link>
          <Link href="#artists" className="hover:text-accent-silver transition-colors">ช่างสัก (Artists)</Link>
          <Link href="#aftercare" className="hover:text-accent-silver transition-colors">ดูแลรอยสัก (Aftercare)</Link>
        </nav>
        
        <div className="hidden md:flex gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-accent-silver transition-colors flex items-center gap-2">
            <User size={16} /> ล็อกอิน
          </Link>
          <Link href="/booking" className="flex items-center gap-2 bg-text-primary text-background-dark px-4 py-2 text-sm font-bold rounded-sm hover:bg-accent-silver transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            จองคิว (Book Now) <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-text-primary z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Button is kept here */}
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 border-b border-border-dark bg-ink-smoke overflow-hidden min-h-[100svh]">
        
        {/* Dark overlay to make the content pop */}
        <div className="absolute inset-0 bg-background-dark/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-dark/95"></div>

        {/* Subtle studio lighting centered behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 max-w-4xl w-full flex flex-col items-center justify-center mt-12 md:mt-16 relative">
          {/* Main Logo */}
          <img 
            src="/images/logo.png" 
            alt="157 Tattoo Emblem" 
            className="w-48 sm:w-64 md:w-80 lg:w-[28rem] h-auto opacity-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-6 md:mb-10 animate-pulse-slow" 
          />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-gothic tracking-[0.3em] text-text-primary drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] uppercase mb-8 md:mb-10">
            157 TATTOO
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs text-accent-silver uppercase tracking-[0.2em] font-medium opacity-90 mb-8 md:mb-10 max-w-2xl">
            {["Chicano", "Blackwork", "Darkwork", "Demon", "Alien", "Font", "Thai", "Japan"].map((style, index, arr) => (
              <span key={style} className="whitespace-nowrap flex items-center gap-4">
                <span>{style}</span>
                {index < arr.length - 1 && <span className="opacity-50">•</span>}
              </span>
            ))}
          </div>
          
          <p className="text-sm md:text-base lg:text-lg text-text-secondary font-light max-w-2xl mx-auto leading-loose drop-shadow-md px-4 mb-10 md:mb-12">
            เปลี่ยนจินตนาการให้เป็นศิลปะบนเรือนร่าง ถ่ายทอดตัวตนของคุณผ่านลายสักแบบ Custom Design <br className="hidden md:block"/> ในพื้นที่ Private Studio ของเรา
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto sm:max-w-none px-4">
            <Link href="/booking" className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-sm md:text-base font-bold tracking-widest hover:bg-accent-silver transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 duration-300">
              <Calendar size={18} /> จองคิวสัก
            </Link>
            <Link href="#portfolio" className="flex items-center justify-center gap-2 px-8 py-4 text-sm md:text-base font-medium tracking-widest border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/50 transition-all text-white hover:scale-105 duration-300">
              ดูผลงาน
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio & Flash Wall Section */}
      <PublicPortfolio />

      {/* Dynamic Artists Section */}
      <PublicArtists />

      {/* Aftercare Section Placeholder */}
      <section id="aftercare" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-gothic mb-4 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] uppercase">ดูแลรอยสัก (Aftercare)</h3>
          <p className="text-text-secondary mb-12">คู่มือการดูแลรอยสักเพื่อให้สีสวยคมชัดและแผลหายไว</p>
          <div className="raw-panel p-12 text-center text-text-secondary border-dashed max-w-3xl mx-auto">
            <p className="font-gothic text-xl tracking-widest uppercase">Coming Soon</p>
            <p className="text-sm mt-2">ส่วนนี้กำลังอยู่ระหว่างการพัฒนา</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 md:py-12 border-t border-border-dark text-center text-xs md:text-sm text-text-secondary px-4">
        <p className="tracking-widest uppercase font-gothic">© 2026 157 TATTOO. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 text-text-secondary/50">RAW UNDERGROUND STUDIO & ART GALLERY</p>
      </footer>

      {/* Mobile Nav Overlay (Moved outside header to fix z-index and fixed positioning) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col items-center justify-center gap-6 md:hidden px-4">
          
          {/* Close Button inside the overlay */}
          <button 
            className="absolute top-4 right-4 text-text-primary p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={28} />
          </button>

          <Link href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ผลงาน (Portfolio)</Link>
          <Link href="#artists" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ช่างสัก (Artists)</Link>
          <Link href="#aftercare" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ดูแลรอยสัก (Aftercare)</Link>
          <div className="flex flex-col gap-4 mt-6 items-center w-full max-w-xs">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-text-secondary hover:text-accent-silver flex items-center gap-2">
              <User size={18} /> ล็อกอิน
            </Link>
            <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="flex w-full justify-center items-center gap-2 bg-text-primary text-background-dark px-6 py-3 text-base font-bold rounded-sm hover:bg-accent-silver transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              จองคิว (Book Now) <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
