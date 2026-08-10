"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Menu, X } from "lucide-react";

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
        
        {/* Desktop Nav (Removed anchor links as requested) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-text-secondary">
          {/* Links removed */}
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
          
          <p className="text-sm md:text-base lg:text-lg text-text-secondary font-light max-w-2xl mx-auto leading-loose drop-shadow-md px-4 mb-10 md:mb-12">
            ศูนย์รวมงานสักหลากหลายสไตล์ รังสรรค์ผลงานศิลปะบนเรือนร่างระดับพรีเมียม <br className="hidden md:block"/> ในบรรยากาศสตูดิโอแบบ Exclusive
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

      {/* Portfolio Section Placeholder */}
      <section id="portfolio" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative z-10 border-b border-border-dark">
        <div className="max-w-7xl mx-auto">
          {/* Portfolio Filter Bar */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12 justify-center items-center">
            {["ทั้งหมด", "Chicano", "Blackwork", "Darkwork", "Demon", "Alien", "Font", "Japan"].map((style, index) => (
              <button 
                key={style} 
                className={`px-4 py-2 rounded-full text-[10px] sm:text-xs md:text-sm uppercase transition-all flex items-center justify-center ${
                  index === 0 
                    ? "bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                    : "border border-border-dark text-text-secondary hover:text-white hover:border-white/50 bg-background-dark/50 backdrop-blur-sm font-medium"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square relative group overflow-hidden border border-border-dark rounded-md raw-panel bg-background-dark/80 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
                  <span className="opacity-50 text-sm tracking-widest font-gothic">Artwork {i}</span>
                </div>
                <div className="absolute inset-0 bg-background-dark opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-gothic text-xl md:text-2xl text-text-primary tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">VIEW</span>
                </div>
              </div>
            ))}
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
