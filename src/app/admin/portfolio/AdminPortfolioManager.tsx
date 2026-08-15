"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Eye, EyeOff } from "lucide-react";

type PortfolioItem = {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  image_url: string;
  work_type: 'portfolio' | 'flash';
  tattoo_style: string;
  is_available: boolean;
  is_published: boolean;
  created_at: string;
  artists?: {
    name: string;
  };
};

export default function AdminPortfolioManager() {
  const supabase = createClient();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterArtist, setFilterArtist] = useState("all");
  const [artistsList, setArtistsList] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetchItems();
    fetchArtists();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("portfolios")
      .select("*, artists(name)")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching portfolios:", error);
    } else if (data) {
      setItems(data as PortfolioItem[]);
    }
    setIsLoading(false);
  };

  const fetchArtists = async () => {
    const { data, error } = await supabase.from("artists").select("id, name");
    if (data) setArtistsList(data);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("ลบผลงานนี้อย่างถาวร? (Delete permanently?)")) return;
    
    try {
      const urlParts = imageUrl.split("/portfolio-images/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("portfolio-images").remove([filePath]);
      }
      
      const { error } = await supabase.from("portfolios").delete().eq("id", id);
      if (error) throw error;
      
      setItems(items.filter(item => item.id !== id));
    } catch (error: any) {
      alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("portfolios")
      .update({ is_published: !currentStatus })
      .eq("id", id);
      
    if (error) {
      alert("ไม่สามารถเปลี่ยนสถานะได้: " + error.message);
    } else {
      setItems(items.map(item => item.id === id ? { ...item, is_published: !currentStatus } : item));
    }
  };

  const filteredItems = items.filter(item => filterArtist === 'all' || item.artist_id === filterArtist);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <select 
          className="input-raw text-sm py-2 px-4"
          value={filterArtist}
          onChange={e => setFilterArtist(e.target.value)}
        >
          <option value="all">ดูผลงานช่างทุกคน (All Artists)</option>
          {artistsList.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        
        <p className="text-text-secondary text-sm">
          รวม: {filteredItems.length} รายการ
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-text-secondary animate-pulse">กำลังโหลดข้อมูล...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-border-dark border-dashed bg-white/5 rounded-lg">
          <p className="text-text-secondary">ไม่มีผลงานที่ตรงกับตัวกรอง</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="raw-panel overflow-hidden group">
              <div className="relative aspect-square border-b border-border-dark overflow-hidden bg-black/50">
                <img src={item.image_url} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                
                {/* Actions Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleVisibility(item.id, item.is_published)}
                    className="p-1.5 bg-black/80 hover:bg-white/20 rounded-sm text-white border border-border-dark backdrop-blur-md"
                    title={item.is_published ? "ซ่อน (Hide)" : "แสดง (Publish)"}
                  >
                    {item.is_published ? <Eye size={14} /> : <EyeOff size={14} className="text-red-400" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.image_url)}
                    className="p-1.5 bg-black/80 hover:bg-red-500/20 hover:text-red-500 rounded-sm text-white border border-border-dark backdrop-blur-md"
                    title="ลบ (Delete)"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 flex gap-1 flex-col">
                  {!item.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-red-500/80 text-white backdrop-blur-md w-max">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">{item.artists?.name || 'Unknown'}</p>
                <h3 className="font-bold text-sm mb-1 truncate" title={item.title}>{item.title}</h3>
                {item.tattoo_style && <p className="text-[10px] text-text-secondary uppercase tracking-wider">{item.tattoo_style}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
