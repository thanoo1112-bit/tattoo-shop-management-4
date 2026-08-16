"use client";

import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { FaInstagram, FaLine, FaFacebookF } from "react-icons/fa";

export default function FooterSection() {
  return (
    <footer id="contact" className="bg-[#050505] pt-16 md:pt-24 border-t border-border-dark relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <img src="/images/logo.png" alt="157 TATTOO" className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity" />
              <h2 className="text-2xl font-gothic tracking-widest text-text-primary uppercase">157 TATTOO</h2>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-xs">
              RAW UNDERGROUND STUDIO & ART GALLERY. รังสรรค์ผลงานศิลปะบนเรือนร่างระดับพรีเมียม
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/157_tattoo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-all shadow-lg hover:-translate-y-1"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61550501946125" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-all shadow-lg hover:-translate-y-1"
              >
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-gothic tracking-widest uppercase text-white mb-6">Contact Us</h4>
            <ul className="space-y-5 inline-flex flex-col">
              <li className="flex items-start gap-4 text-text-secondary text-sm text-left">
                <Clock className="w-5 h-5 text-accent-silver flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Opening Hours</p>
                  <p>10:00 - 23:30</p>
                </div>
              </li>
              <li className="flex items-center gap-4 text-text-secondary text-sm text-left">
                <Phone className="w-5 h-5 text-accent-silver flex-shrink-0" />
                <p>091-070-2369</p>
              </li>
              <li className="flex items-start gap-4 text-text-secondary text-sm text-left">
                <MapPin className="w-5 h-5 text-accent-silver flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p>151/3 1299, Chiang Rai, Thailand, 57210</p>
                  <p>อำเภอเวียงชัย, จังหวัดเชียงราย</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Location / Map */}
          <div className="flex flex-col items-center md:items-start w-full">
            <h4 className="text-lg font-gothic tracking-widest uppercase text-white mb-6">Location</h4>
            <div className="w-full h-40 bg-neutral-900 border border-neutral-800 rounded-lg mb-4 shadow-lg overflow-hidden relative">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://maps.google.com/maps?q=151/3%201299,%20Wiang%20Chai,%20Chiang%20Rai,%20Thailand,%2057210&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0}
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=151/3+1299,+Wiang+Chai,+Chiang+Rai,+Thailand,+57210" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <MapPin size={14} /> กดนำทางมายังร้าน
            </a>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border-dark py-6 px-4 flex flex-col items-center justify-center">
        <p className="text-xs md:text-sm text-text-secondary uppercase tracking-widest font-gothic">
          © {new Date().getFullYear()} 157 TATTOO. ALL RIGHTS RESERVED.
        </p>
        <Link href="/login" className="mt-2 text-[10px] text-text-secondary/30 hover:text-text-secondary transition-colors uppercase tracking-[0.3em]">
          Admin Portal
        </Link>
      </div>
    </footer>
  );
}
