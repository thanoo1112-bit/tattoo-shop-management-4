"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Menu, X } from "lucide-react";
import PortfolioSection from "@/components/home/PortfolioSection";
import PublicArtists from "@/components/public/PublicArtists";
import BookingStepsSection from "@/components/home/BookingStepsSection";
import HygieneStandardsSection from "@/components/home/HygieneStandardsSection";
import FooterSection from "@/components/home/FooterSection";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-flash-wall">
      {/* Dark overlay for the whole page to make the background faint */}
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
        <nav className="hidden md:flex gap-6 text-sm font-medium text-text-secondary uppercase tracking-wider">
          <Link href="/" className="hover:text-accent-silver transition-colors">หน้าแรก</Link>
          <Link href="#portfolio" className="hover:text-accent-silver transition-colors">ผลงาน</Link>
          <Link href="#artists" className="hover:text-accent-silver transition-colors">ช่างสัก</Link>
          <Link href="#booking-steps" className="hover:text-accent-silver transition-colors">ขั้นตอนการจอง</Link>
          <Link href="#hygiene" className="hover:text-accent-silver transition-colors">มาตรฐานร้าน</Link>
          <Link href="#contact" className="hover:text-accent-silver transition-colors">ข้อมูลติดต่อ</Link>
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
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 border-b border-border-dark overflow-hidden min-h-[100svh]">
        
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
            ศูนย์รวมงานสักหลากหลายสไตล์ รังสรรค์ผลงานศิลปะบนเรือนร่างระดับพรีเมียม <br className="hidden md:block"/> ในบรรยากาศสตูดิโอแบบ Exclusive
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto sm:max-w-none px-4">
            <Link href="/booking" className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-sm md:text-base font-bold tracking-widest hover:bg-accent-silver transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 duration-300">
              <Calendar size={18} /> จองคิวสัก
            </Link>
            <a 
              href="https://www.facebook.com/profile.php?id=61550501946125" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 text-sm md:text-base font-medium tracking-widest border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/50 transition-all text-white hover:scale-105 duration-300"
            >
              ปรึกษางานสัก
            </a>
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio & Flash Wall Section */}
      <PortfolioSection />

      {/* Artists Section */}
      <PublicArtists />

      {/* Booking Steps Section */}
      <BookingStepsSection />

      {/* Hygiene Standards Section */}
      <HygieneStandardsSection />
      
      {/* Footer Section */}
      <FooterSection />

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col items-center justify-center gap-6 md:hidden px-4">
          
          {/* Close Button inside the overlay */}
          <button 
            className="absolute top-4 right-4 text-text-primary p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={28} />
          </button>

          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">หน้าแรก (Home)</Link>
          <Link href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ผลงาน (Portfolio)</Link>
          <Link href="#artists" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ช่างสัก (Artists)</Link>
          <Link href="#booking-steps" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ขั้นตอนการจอง (Booking)</Link>
          <Link href="#hygiene" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">มาตรฐานร้าน (Hygiene)</Link>
          <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-accent-silver tracking-widest uppercase">ข้อมูลติดต่อ (Contact)</Link>
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
