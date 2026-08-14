"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ArtistItem = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  profile_image_url: string;
};

// Component จัดการรูปภาพ เพื่อทำ Fallback ถ้ารูปพังหรือไม่มีรูป
function ArtistImage({ src, name, className }: { src: string; name: string; className: string }) {
  const [hasError, setHasError] = useState(false);

  // ดึงตัวอักษร 2 ตัวแรกมาแสดงถ้ารูปพัง
  const initials = name ? name.substring(0, 2).toUpperCase() : "A";

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-background-dark border border-border-dark ${className}`}>
        <span className="font-gothic text-3xl tracking-widest text-text-secondary opacity-50">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
}

export default function PublicArtists() {
  const [artists, setArtists] = useState<ArtistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        setArtists(data as ArtistItem[]);
      }
      setIsLoading(false);
    };

    fetchArtists();
  }, []);

  return (
    <section id="artists" className="py-16 md:py-24 px-4 md:px-12 bg-background-dark relative z-10 border-b border-border-dark min-h-[40vh]">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-3xl md:text-4xl font-gothic mb-4 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] uppercase">
          ช่างสัก (Artists)
        </h3>
        <p className="text-text-secondary mb-12">
          ทีมช่างสักฝีมือระดับพรีเมียมของเรา
        </p>

        {isLoading ? (
          <div className="text-center py-20 text-text-secondary animate-pulse uppercase tracking-widest font-gothic">
            Loading...
          </div>
        ) : artists.length === 0 ? (
          <div className="raw-panel p-12 text-center text-text-secondary border-dashed max-w-3xl mx-auto bg-black/40 backdrop-blur-md">
            <p className="font-gothic text-xl tracking-widest uppercase mb-2">No Artists Found</p>
            <p className="text-sm">ยังไม่มีข้อมูลช่างสักในระบบ</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            
            {/* --- Mobile View: Horizontal List (Hide on sm and above) --- */}
            <div className="flex flex-col gap-4 sm:hidden text-left">
              {artists.map(artist => (
                <div key={`mobile-${artist.id}`} className="raw-panel p-4 flex items-center gap-4 bg-black/40 border border-border-dark">
                  {/* Avatar Left */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border border-border-dark/50">
                    <ArtistImage 
                      src={artist.profile_image_url} 
                      name={artist.name} 
                      className="w-full h-full"
                    />
                  </div>
                  
                  {/* Info Right */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-gothic tracking-widest uppercase truncate">{artist.name}</h4>
                    <p className="text-accent-silver text-[10px] uppercase tracking-[0.1em] mb-2 truncate">
                      {artist.specialty || 'Tattoo Artist'}
                    </p>
                    <a 
                      href={`/booking?artist=${artist.id}`} 
                      className="inline-block px-4 py-1.5 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-accent-silver transition-colors"
                    >
                      จองคิว
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Desktop View: Grid (Hide on mobile) --- */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {artists.map(artist => (
                <div key={`desktop-${artist.id}`} className="group relative text-center">
                  <div className="aspect-[3/4] relative overflow-hidden raw-panel bg-black border border-border-dark mb-6">
                    {/* Artist Image */}
                    <ArtistImage 
                      src={artist.profile_image_url} 
                      name={artist.name} 
                      className="w-full h-full group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 ease-in-out opacity-80"
                    />
                    
                    {/* Decorative Frame */}
                    <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none transition-transform duration-500 group-hover:scale-95"></div>
                    
                    {/* Hover Overlay Details */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/70 backdrop-blur-sm">
                      <p className="text-text-secondary text-sm leading-relaxed mb-4 text-center line-clamp-4">
                        {artist.bio || 'ช่างสักฝีมือเยี่ยมจาก 157 TATTOO'}
                      </p>
                      <a href={`/booking?artist=${artist.id}`} className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-accent-silver transition-colors">
                        จองคิวช่างคนนี้
                      </a>
                    </div>
                  </div>

                  {/* Artist Info Below Image */}
                  <h4 className="text-2xl font-gothic tracking-widest uppercase mb-1">{artist.name}</h4>
                  <p className="text-accent-silver text-xs uppercase tracking-[0.2em]">{artist.specialty || 'Tattoo Artist'}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
