"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, UploadCloud, X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

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
};

export default function PortfolioManager({ artistId }: { artistId: string }) {
  const supabase = createClient();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tattooStyle, setTattooStyle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching portfolios:", error);
    } else if (data) {
      setItems(data as PortfolioItem[]);
    }
    setIsLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return alert("กรุณาเลือกไฟล์รูปภาพ (Please select an image)");

    setIsUploading(true);
    try {
      // 1. Upload to Storage bucket
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${artistId}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(fileName);

      // 2. Insert into DB
      const { error: dbError } = await supabase.from("portfolios").insert({
        artist_id: artistId,
        title,
        description,
        work_type: 'portfolio',
        tattoo_style: tattooStyle,
        image_url: publicUrlData.publicUrl,
        is_published: true, // Default to published for artist
        is_available: true
      });

      if (dbError) throw dbError;

      // Success
      setIsModalOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setUploadFile(null);
    setTitle("");
    setDescription("");
    setTattooStyle("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผลงานนี้?")) return;
    
    // Attempt to delete from storage as well
    try {
      // imageUrl looks like: https://[project].supabase.co/storage/v1/object/public/portfolio-images/[artistId]/[filename]
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-gothic tracking-widest uppercase">ผลงานของคุณ</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-accent-silver transition-colors rounded-sm"
        >
          <Plus size={16} /> เพิ่มผลงานใหม่
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-text-secondary animate-pulse">กำลังโหลดผลงาน...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-border-dark border-dashed bg-white/5 rounded-lg">
          <p className="text-text-secondary mb-2">ยังไม่มีผลงานในระบบ</p>
          <button onClick={() => setIsModalOpen(true)} className="text-sm text-white underline">เพิ่มผลงานแรกของคุณ</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="raw-panel overflow-hidden group">
              <div className="relative aspect-square border-b border-border-dark overflow-hidden bg-black/50">
                <img src={item.image_url} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                
                {/* Actions Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleVisibility(item.id, item.is_published)}
                    className="p-2 bg-black/80 hover:bg-white/20 rounded-sm text-white border border-border-dark backdrop-blur-md"
                    title={item.is_published ? "ซ่อนผลงาน (Hide)" : "แสดงผลงาน (Publish)"}
                  >
                    {item.is_published ? <Eye size={16} /> : <EyeOff size={16} className="text-red-400" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.image_url)}
                    className="p-2 bg-black/80 hover:bg-red-500/20 hover:text-red-500 rounded-sm text-white border border-border-dark backdrop-blur-md"
                    title="ลบผลงาน (Delete)"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Status Badges */}
                <div className="absolute bottom-2 left-2 flex gap-2">
                  {!item.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-red-500/80 text-white backdrop-blur-md">
                      ซ่อนอยู่ (Hidden)
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate" title={item.title}>{item.title}</h3>
                {item.tattoo_style && <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">{item.tattoo_style}</p>}
                {item.description && <p className="text-sm text-text-secondary line-clamp-2">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="raw-panel w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-border-dark sticky top-0 bg-background-dark z-10">
              <h2 className="text-lg font-gothic tracking-widest uppercase">อัปโหลดผลงานใหม่</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-text-secondary hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-text-secondary">รูปผลงาน (Image) *</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-border-dark border-dashed p-8 text-center cursor-pointer transition-colors ${uploadFile ? 'bg-white/5 border-white/30' : 'hover:bg-white/5'}`}
                >
                  <UploadCloud className="mx-auto text-text-secondary mb-2" size={24} />
                  <p className={`text-xs ${uploadFile ? 'text-white font-bold' : 'text-text-secondary'}`}>
                    {uploadFile ? uploadFile.name : 'คลิกเพื่ออัปโหลดรูปภาพ'}
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    required
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">ชื่อผลงาน (Title) *</label>
                  <input type="text" required className="input-raw w-full" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">สไตล์ (Style)</label>
                  <input type="text" placeholder="เช่น Minimal, Blackwork" className="input-raw w-full" value={tattooStyle} onChange={e => setTattooStyle(e.target.value)} />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">รายละเอียด (Description)</label>
                  <textarea rows={3} className="input-raw w-full" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-white text-black font-bold py-3 text-sm uppercase tracking-widest hover:bg-accent-silver transition-all disabled:opacity-50 mt-4"
              >
                {isUploading ? "กำลังอัปโหลด..." : "ยืนยัน (UPLOAD)"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
