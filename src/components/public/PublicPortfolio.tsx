"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, ZoomIn, Filter } from "lucide-react";

type PortfolioItem = {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  image_url: string;
  work_type: 'portfolio' | 'flash';
  tattoo_style: string;
  is_available: boolean;
  placement?: string;
  artists?: {
    name: string;
  };
};

export default function PublicPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'flash'>('portfolio');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  
  // Filters
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterArtist, setFilterArtist] = useState<string>('all');
  
  // Unique Lists
  const [stylesList, setStylesList] = useState<string[]>([]);
  const [artistsList, setArtistsList] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("portfolios")
        .select("id, artist_id, title, description, image_url, work_type, tattoo_style, is_available, placement, artists(name)")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (data) {
        const parsedData = data as unknown as PortfolioItem[];
        setItems(parsedData);
        
        // Extract unique styles and artists for filters
        const styles = Array.from(new Set(parsedData.map(i => i.tattoo_style).filter(Boolean)));
        setStylesList(styles);
        
        const artistMap = new Map();
        parsedData.forEach(item => {
          if (item.artist_id && item.artists?.name) {
            artistMap.set(item.artist_id, item.artists.name);
          }
        });
        setArtistsList(Array.from(artistMap.entries()).map(([id, name]) => ({ id, name })));
      }
      setIsLoading(false);
    };

    fetchItems();
  }, []);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedItem]);

  const filteredItems = items.filter(item => {
    return item.work_type === activeTab &&
           (filterStyle === 'all' || item.tattoo_style === filterStyle) &&
           (filterArtist === 'all' || item.artist_id === filterArtist);
  });

  return (
    <section id="portfolio" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative z-10 border-b border-border-dark min-h-[50vh]">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-gothic mb-8 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] uppercase">
          ผลงาน (PORTFOLIO)
        </h3>
        
        <div className="flex justify-center items-center gap-8 md:gap-16 mb-8 border-b border-border-dark/50">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 px-2 text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 relative ${activeTab === 'portfolio' ? 'text-white font-bold' : 'text-text-secondary hover:text-white'}`}
          >
            Tattoos
            {activeTab === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white animate-fade-in shadow-[0_0_10px_rgba(255,255,255,0.5)]"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('flash')}
            className={`pb-4 px-2 text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 relative ${activeTab === 'flash' ? 'text-white font-bold' : 'text-text-secondary hover:text-white'}`}
          >
            Flash Designs
            {activeTab === 'flash' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white animate-fade-in shadow-[0_0_10px_rgba(255,255,255,0.5)]"></span>
            )}
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-10 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-text-secondary" />
            <span className="text-xs uppercase tracking-widest text-text-secondary mr-2">Filter</span>
            <select 
              className="bg-black/50 border border-border-dark text-white text-xs uppercase tracking-widest py-2 px-3 rounded-sm focus:outline-none focus:border-white/50 flex-1 sm:flex-none"
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
            >
              <option value="all">All Styles</option>
              {stylesList.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
            <select 
              className="bg-black/50 border border-border-dark text-white text-xs uppercase tracking-widest py-2 px-3 rounded-sm focus:outline-none focus:border-white/50 flex-1 sm:flex-none"
              value={filterArtist}
              onChange={(e) => setFilterArtist(e.target.value)}
            >
              <option value="all">All Artists</option>
              {artistsList.map(artist => (
                <option key={artist.id} value={artist.id}>{artist.name}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="break-inside-avoid min-h-[300px] bg-neutral-900 animate-pulse rounded-xl border border-neutral-800/80 mb-4 shadow-lg"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-border-dark border-dashed bg-black/40 backdrop-blur-md rounded-xl max-w-2xl mx-auto shadow-lg">
            <p className="text-text-secondary uppercase tracking-widest font-gothic mb-2">No artworks available yet.</p>
            <p className="text-sm text-text-secondary opacity-70">ยังไม่มีผลงานที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          /* Masonry Grid Layout */
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="break-inside-avoid mb-4 bg-neutral-900 border border-neutral-800/80 rounded-xl overflow-hidden group relative shadow-lg"
              >
                {/* ภาพจะไม่ถูกครอป ปล่อยให้ปรับความสูงตามจริง (Masonry) */}
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110" 
                />
                
                {/* Gradient Overlay ขอบล่างภาพ */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-1 line-clamp-1">{item.title}</h4>
                    <p className="text-accent-silver text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2">{item.tattoo_style || item.work_type}</p>
                    <p className="text-[10px] text-white/70">BY {item.artists?.name || "Unknown Artist"}</p>
                  </div>
                </div>

                {/* Availability Badge for Flash */}
                {item.work_type === 'flash' && (
                  <div className={`absolute top-3 right-3 backdrop-blur-md border px-2 py-1 rounded-md z-10 transition-opacity duration-300 group-hover:opacity-0 ${item.is_available ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                    <p className="text-[9px] uppercase tracking-widest font-bold">
                      {item.is_available ? "Available" : "Reserved"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
