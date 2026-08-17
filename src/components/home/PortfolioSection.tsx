"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  image_url: string;
  tattoo_style: string;
  artists?: {
    name: string;
  };
};

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth + 50 : current.offsetWidth - 50;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("portfolios")
        .select("id, title, image_url, tattoo_style, artists(name)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (data) setItems(data as unknown as PortfolioItem[]);
      setIsLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-background-dark relative z-10 border-b border-border-dark overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-10 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-gothic tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Featured Works
            </h2>
            <p className="text-text-secondary mt-2 text-sm md:text-base">ผลงานเด่นจากช่างสักของเรา</p>
          </div>
          <Link 
            href="/portfolio" 
            className="hidden md:flex items-center gap-2 text-white hover:text-accent-silver font-bold tracking-widest uppercase text-sm transition-all"
          >
            ดูผลงานทั้งหมด <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[280px] md:w-1/4 aspect-[3/4] bg-white/5 animate-pulse rounded-sm border border-white/10"></div>
            ))}
          </div>
        ) : (
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0 group">
            
            {/* Scroll Buttons (Mobile Only) */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-white text-white hover:text-black w-10 h-10 rounded-full flex sm:hidden items-center justify-center border border-white/20 transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-white text-white hover:text-black w-10 h-10 rounded-full flex sm:hidden items-center justify-center border border-white/20 transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            >
              <ChevronRight size={24} />
            </button>

            {/* Mobile Snap Scroll, Desktop Grid */}
            <div 
              ref={scrollContainerRef}
              className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory hide-scrollbar pb-8 sm:pb-0 scroll-smooth"
            >
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="snap-center snap-always flex-shrink-0 w-[280px] sm:w-auto relative group/card cursor-pointer overflow-hidden rounded-sm border border-border-dark raw-panel"
                >
                  <div className="aspect-[3/4] w-full relative bg-black">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 opacity-90 group-hover/card:opacity-100"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 sm:opacity-0 sm:group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1">{item.title}</h3>
                      <p className="text-accent-silver text-[10px] uppercase tracking-[0.2em] mb-2">{item.tattoo_style}</p>
                      <p className="text-xs text-white/70">BY {item.artists?.name || 'Artist'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile View All Button */}
            <div className="mt-8 text-center md:hidden px-4">
              <Link 
                href="/portfolio" 
                className="inline-flex justify-center w-full items-center gap-2 bg-white text-black border border-white px-6 py-4 rounded-md font-bold tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors shadow-lg"
              >
                ดูผลงานทั้งหมด <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
