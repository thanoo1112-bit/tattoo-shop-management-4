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
          <img src="/images/logo.png" alt="157 Logo" className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
          <h1 className="text-xl md:text-2xl font-gothic tracking-widest text-text-primary z-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] hidden sm:block">
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

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background-dark/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8 md:hidden pt-16">
            <Link href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-text-primary hover:text-accent-silver">ผลงาน (Portfolio)</Link>
            <Link href="#artists" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-text-primary hover:text-accent-silver">ช่างสัก (Artists)</Link>
            <Link href="#aftercare" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-text-primary hover:text-accent-silver">ดูแลรอยสัก (Aftercare)</Link>
            <div className="flex flex-col gap-6 mt-8 items-center w-full px-8">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-text-secondary hover:text-accent-silver flex items-center gap-2">
                <User size={20} /> ล็อกอิน
              </Link>
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="flex w-full justify-center items-center gap-2 bg-text-primary text-background-dark px-6 py-4 text-lg font-bold rounded-sm hover:bg-accent-silver transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                จองคิว (Book Now) <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-start justify-end text-left px-5 sm:px-8 py-16 md:py-32 md:px-16 lg:px-24 border-b border-border-dark bg-ink-smoke overflow-hidden min-h-[90svh] md:min-h-[85vh]">
        
        {/* Mobile: Strong Bottom Gradient so text is readable against the background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/90 to-transparent md:via-background-dark/40"></div>
        
        {/* Desktop: Split-screen left gradient */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>

        {/* Subtle studio lighting */}
        <div className="absolute top-0 right-0 md:w-[800px] md:h-[600px] w-full h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="z-10 max-w-3xl w-full flex flex-col items-start justify-end space-y-5 md:space-y-6 mt-auto relative pt-12">
          <div className="flex flex-col items-start">
            <img src="/images/logo.png" alt="157 Tattoo Emblem" className="w-28 sm:w-40 md:w-56 h-auto opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-3 md:mb-6 animate-pulse-slow" />
            <h2 className="text-[3.25rem] leading-[0.9] sm:text-7xl md:text-8xl lg:text-[10rem] font-gothic font-black tracking-widest text-text-primary drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] uppercase">
              157<br/>TATTOO
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] sm:text-xs md:text-sm text-accent-silver uppercase tracking-[0.15em] font-medium opacity-90 backdrop-blur-sm bg-black/40 px-4 py-2.5 md:px-6 md:py-3 rounded-none border-l-2 border-white/50 max-w-[90%] md:max-w-none">
            <span>Chicano</span> <span className="opacity-50">•</span> 
            <span>Blackwork</span> <span className="opacity-50">•</span> 
            <span>Darkwork</span> <span className="opacity-50">•</span> 
            <span>Demon</span> <span className="opacity-50">•</span> 
            <span>Alien</span> <span className="opacity-50">•</span> 
            <span>Font</span> <span className="opacity-50">•</span> 
            <span>Thai</span> <span className="opacity-50">•</span> 
            <span>Japan</span>
          </div>
          
          <p className="text-xs sm:text-sm md:text-lg text-text-secondary font-light max-w-xl leading-relaxed drop-shadow-md pr-4">
            ศูนย์รวมงานสักหลากหลายสไตล์ รังสรรค์ผลงานศิลปะบนเรือนร่างระดับพรีเมียม ในบรรยากาศสตูดิโอแบบ Exclusive
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2 md:pt-4 w-full sm:max-w-none">
            <Link href="/booking" className="flex items-center justify-center gap-2 md:gap-3 bg-white text-black px-6 py-3.5 md:px-8 md:py-4 text-xs md:text-base font-bold uppercase tracking-widest hover:bg-accent-silver transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:translate-x-2 duration-300">
              <Calendar size={16} className="md:w-[18px] md:h-[18px]" /> Book Now
            </Link>
            <Link href="#portfolio" className="flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 text-xs md:text-base font-medium tracking-widest uppercase border border-white/20 bg-transparent hover:bg-white/5 hover:border-white/50 transition-all text-white hover:translate-x-2 duration-300">
              Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section Placeholder */}
      <section id="portfolio" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-gothic mb-8 md:mb-12 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">FEATURED WORK</h3>
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
        <p className="font-cinzel tracking-widest mb-2 text-text-primary">157 TATTOO</p>
        <p>&copy; {new Date().getFullYear()} All rights reserved. Designed for optimal experience on all devices.</p>
      </footer>
    </main>
  );
}
