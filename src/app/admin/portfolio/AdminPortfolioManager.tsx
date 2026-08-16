"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Eye, EyeOff, Plus, UploadCloud, X } from "lucide-react";

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

  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tattooStyle, setTattooStyle] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (data) {
      setArtistsList(data);
      if (data.length > 0) setSelectedArtistId(data[0].id);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return alert("กรุณาเลือกไฟล์รูปภาพ (Please select an image)");
    if (!selectedArtistId) return alert("กรุณาเลือกช่างสัก (Please select an artist)");

    setIsUploading(true);
    try {
      // 1. Upload to Storage bucket
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${selectedArtistId}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(fileName);

      // 2. Insert into DB
      const { error: dbError } = await supabase.from("portfolios").insert({
        artist_id: selectedArtistId,
        title,
        work_type: 'portfolio',
        tattoo_style: tattooStyle,
        image_url: publicUrlData.publicUrl,
        is_published: true,
        is_available: true
      });

      if (dbError) throw dbError;

      // Success
      setIsModalOpen(false);
      setUploadFile(null);
      setTitle("");
      setTattooStyle("");
      fetchItems();
    } catch (error: any) {
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + error.message);
    } finally {
      setIsUploading(false);
    }
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
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-bold tracking-widest uppercase hover:bg-accent-silver transition-colors"
          >
            <Plus size={16} /> อัปโหลดผลงาน (Upload)
          </button>
        </div>
        
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-border-dark w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border-dark flex justify-between items-center bg-black/50">
              <h3 className="font-gothic tracking-widest uppercase text-white">เพิ่มผลงาน (Add Portfolio)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">เลือกช่างสัก (Artist)</label>
                <select 
                  className="input-raw w-full"
                  value={selectedArtistId}
                  onChange={e => setSelectedArtistId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- เลือกช่าง --</option>
                  {artistsList.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">รูปผลงาน (Image)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-border-dark border-dashed p-6 text-center hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {uploadFile ? (
                    <div className="space-y-2">
                      <div className="w-full aspect-video bg-black/50 relative overflow-hidden flex items-center justify-center border border-border-dark">
                        <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                      <p className="text-xs text-text-secondary truncate">{uploadFile.name}</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="mx-auto text-text-secondary mb-2" size={24} />
                      <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">อัปโหลดไฟล์</p>
                      <p className="text-xs text-text-secondary">คลิกเพื่อเลือกไฟล์รูปภาพ</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={e => e.target.files && setUploadFile(e.target.files[0])}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">ชื่อผลงาน (Title)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-raw w-full"
                  placeholder="เช่น Blackwork Dragon, Chicano Sleeve"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">สไตล์งาน (Style)</label>
                <input 
                  type="text" 
                  value={tattooStyle}
                  onChange={e => setTattooStyle(e.target.value)}
                  className="input-raw w-full"
                  placeholder="เช่น Blackwork, Minimal"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-dark mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-white"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest uppercase hover:bg-accent-silver transition-all disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "บันทึก (Save)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
