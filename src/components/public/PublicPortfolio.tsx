"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, ZoomIn } from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  work_type: 'portfolio' | 'flash';
  tattoo_style: string;
  is_available: boolean;
  artists?: {
    name: string;
  };
};

export default function PublicPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'flash'>('portfolio');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("portfolios")
        .select("id, title, description, image_url, work_type, tattoo_style, is_available, artists(name)")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (data) {
        setItems(data as unknown as PortfolioItem[]);
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

  const filteredItems = items.filter(item => item.work_type === activeTab);

  return (
    <section id="portfolio" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative z-10 border-b border-border-dark min-h-[50vh]">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-gothic mb-8 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] uppercase">
          ผลงาน (PORTFOLIO)
        </h3>
        
        <div className="flex justify-center items-center gap-8 md:gap-16 mb-12 border-b border-border-dark/50">
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

        {isLoading ? (
          <div className="text-center py-20 text-text-secondary animate-pulse uppercase tracking-widest font-gothic">
            Loading...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-border-dark border-dashed bg-black/40 backdrop-blur-md rounded-lg max-w-2xl mx-auto">
            <p className="text-text-secondary uppercase tracking-widest font-gothic mb-2">No artworks available yet.</p>
            <p className="text-sm text-text-secondary opacity-70">ยังไม่มีผลงานในหมวดหมู่นี้</p>
          </div>
        ) : (
          /* Masonry Grid Layout */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative overflow-hidden raw-panel bg-black border border-border-dark">
                  {/* ภาพจะไม่ถูกครอป ปล่อยให้ปรับความสูงตามจริง (Masonry) */}
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
                  />
                  
                  {/* Overlay ดำๆ เวลาเอาเมาส์ชี้ */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <ZoomIn className="text-white mb-3" size={32} />
                    <p className="text-white font-bold text-center uppercase tracking-widest mb-1">{item.title}</p>
                    <p className="text-accent-silver text-[10px] uppercase tracking-widest text-center">BY {item.artists?.name || "Unknown Artist"}</p>
                  </div>

                  {/* Availability Badge for Flash (Show default if not hovered) */}
                  {item.work_type === 'flash' && (
                    <div className={`absolute top-3 right-3 backdrop-blur-md border px-3 py-1.5 rounded-sm z-10 transition-opacity duration-300 group-hover:opacity-0 ${item.is_available ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                      <p className="text-[10px] uppercase tracking-widest font-bold">
                        {item.is_available ? "Available" : "Reserved"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Pop-up */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black lg:bg-black/95 lg:p-8 lg:pt-24 lg:backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* กล่องเนื้อหา Modal */}
          <div 
            className="flex w-full h-[100dvh] lg:h-auto lg:max-h-[85vh] lg:max-w-6xl flex-col lg:flex-row relative bg-black lg:bg-background-dark lg:border border-border-dark lg:overflow-hidden lg:shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* รูปภาพ (กดที่รูปเพื่อปิดได้เลย) */}
            <div 
              className="flex-1 relative w-full h-full bg-black flex items-center justify-center z-0 cursor-pointer"
              onClick={() => setSelectedItem(null)}
            >
              <img 
                src={selectedItem.image_url} 
                alt={selectedItem.title} 
                className="w-full h-full lg:max-h-[85vh] object-contain absolute lg:relative inset-0"
              />
            </div>

            {/* ข้อมูลฝั่งขวา (หรือ Overlay ลอยทับด้านล่างบนมือถือ) */}
            <div className="absolute bottom-0 left-0 right-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-24 pb-8 z-10 lg:relative lg:bg-none lg:bg-background-dark lg:w-[400px] lg:p-8 lg:border-l lg:border-border-dark flex flex-col lg:overflow-y-auto">
              
              <div className="mb-4 lg:mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-wider text-white mb-1 lg:mb-2 drop-shadow-md">{selectedItem.title}</h3>
                  <p className="text-accent-silver text-[10px] lg:text-xs uppercase tracking-[0.2em] mb-2 lg:mb-4 drop-shadow-md">{selectedItem.tattoo_style || selectedItem.work_type}</p>
                </div>
                {selectedItem.work_type === 'flash' && (
                  <span className={`px-2 py-1 lg:px-3 lg:py-1 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest border ${selectedItem.is_available ? 'text-green-400 border-green-500/50 bg-green-500/10' : 'text-red-400 border-red-500/50 bg-red-500/10'}`}>
                    {selectedItem.is_available ? "Available" : "Reserved"}
                  </span>
                )}
              </div>

              <div className="mb-4 lg:mb-8">
                <h4 className="text-[8px] lg:text-[10px] text-text-secondary uppercase tracking-widest mb-1 lg:mb-2 lg:border-b border-border-dark lg:pb-2 drop-shadow-md">Artist</h4>
                <p className="text-base lg:text-lg font-gothic tracking-widest text-white drop-shadow-md">{selectedItem.artists?.name || "Unknown Artist"}</p>
              </div>

              {/* Description Desktop */}
              {selectedItem.description && (
                <div className="mb-8 flex-1 hidden lg:block">
                  <h4 className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 border-b border-border-dark pb-2">Description</h4>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>
              )}
              
              {/* Description Mobile (Clamped) */}
              {selectedItem.description && (
                 <p className="lg:hidden text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed drop-shadow-md">
                   {selectedItem.description}
                 </p>
              )}

              <div className="mt-auto pt-2 lg:pt-6 lg:border-t border-border-dark">
                <a 
                  href={`/booking?portfolio=${selectedItem.id}`} 
                  className="block w-full py-3 lg:py-4 bg-white text-black text-center font-bold uppercase tracking-widest hover:bg-accent-silver transition-colors text-xs lg:text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  จองคิว / สอบถาม (Book Now)
                </a>
              </div>
            </div>
            
            {/* ปุ่มปิด (X) - วางไว้ท้ายสุดของ DOM เพื่อให้ทับทุกอย่างบนมือถือ */}
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center text-white hover:text-black hover:bg-white z-[9999] bg-black/60 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-lg cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
              title="ปิด (Close)"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
