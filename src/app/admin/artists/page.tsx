"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, X, Edit, Trash2, Save, User, UploadCloud } from "lucide-react";

type Artist = {
  id: string;
  name: string;
  styles: string[];
  bio: string;
  profile_image_url?: string;
};

export default function AdminArtistsPage() {
  const supabase = createClient();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [newStyleInput, setNewStyleInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("artists").select("*").order("created_at", { ascending: true });
    if (data) {
      // Ensure styles is an array
      const mapped = data.map(a => ({
        ...a,
        styles: Array.isArray(a.styles) ? a.styles : (a.styles ? JSON.parse(a.styles as string) : [])
      }));
      setArtists(mapped);
    }
    setIsLoading(false);
  };

  const handleEditClick = (artist: Artist) => {
    setEditingArtist({ ...artist });
    setProfilePreviewUrl(artist.profile_image_url || null);
    setProfileFile(null);
    setIsEditModalOpen(true);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileFile(file);
      setProfilePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddStyle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newStyleInput.trim()) {
      e.preventDefault();
      if (!editingArtist) return;
      
      const newStyle = newStyleInput.trim().toUpperCase();
      if (!editingArtist.styles.includes(newStyle)) {
        setEditingArtist({
          ...editingArtist,
          styles: [...editingArtist.styles, newStyle]
        });
      }
      setNewStyleInput("");
    }
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    if (!editingArtist) return;
    setEditingArtist({
      ...editingArtist,
      styles: editingArtist.styles.filter(s => s !== styleToRemove)
    });
  };

  const handleSaveArtist = async () => {
    if (!editingArtist) return;
    setIsSaving(true);
    
    try {
      let finalProfileUrl = editingArtist.profile_image_url;

      if (profileFile) {
        const fileExt = profileFile.name.split('.').pop();
        const fileName = `${editingArtist.id}_profile_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('portfolio-images')
          .upload(`profiles/${fileName}`, profileFile, { upsert: true });
          
        if (uploadError) throw new Error("Failed to upload Profile Image: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage.from('portfolio-images').getPublicUrl(`profiles/${fileName}`);
        finalProfileUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("artists")
        .update({ 
          name: editingArtist.name,
          styles: editingArtist.styles,
          bio: editingArtist.bio,
          profile_image_url: finalProfileUrl
        })
        .eq("id", editingArtist.id);
        
      if (error) throw error;
      
      await fetchArtists();
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert("Error saving artist: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading artists...</div>;

  return (
    <>
      <div className="space-y-6 animate-fade-in relative z-10">
        <div className="flex justify-between items-center bg-background-dark/80 p-4 border border-border-dark backdrop-blur-md rounded-lg">
          <h1 className="text-xl md:text-2xl font-gothic tracking-widest uppercase">จัดการช่างสัก (Artists)</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <div key={artist.id} className="bg-background-dark/80 border border-border-dark rounded-lg p-6 flex flex-col items-center text-center hover:border-white/20 transition-all">
              <div className="w-20 h-28 bg-white/5 rounded-sm flex items-center justify-center border border-border-dark mb-4 overflow-hidden">
                {artist.profile_image_url ? (
                  <img src={artist.profile_image_url} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-white/50" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{artist.name}</h3>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {artist.styles && artist.styles.length > 0 ? (
                  artist.styles.map(s => (
                    <span key={s} className="px-2 py-1 bg-white/10 text-[10px] uppercase tracking-widest text-white rounded-sm border border-white/10">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-secondary">ไม่มีสไตล์ที่ระบุ</span>
                )}
              </div>

              <button 
                onClick={() => handleEditClick(artist)}
                className="mt-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all border border-white/10 w-full flex justify-center items-center gap-2"
              >
                <Edit size={14} /> แก้ไขข้อมูล (Edit)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal - Moved outside of animate-fade-in to prevent fixed positioning bug */}
      {isEditModalOpen && editingArtist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 md:p-8">
            <div className="bg-[#0f0f0f] border border-border-dark rounded-lg w-full max-w-lg overflow-hidden flex flex-col my-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
              <div className="p-4 border-b border-border-dark flex justify-between items-center bg-black/50 sticky top-0 z-10">
                <h3 className="text-lg font-gothic tracking-widest uppercase text-white">แก้ไขข้อมูลช่าง</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-text-secondary hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                
                {/* Profile Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">รูปโปรไฟล์ (Profile Image)</label>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-32 bg-black border border-border-dark flex items-center justify-center relative overflow-hidden shrink-0">
                      {profilePreviewUrl ? (
                        <img src={profilePreviewUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-white/20" />
                      )}
                    </div>
                    <div 
                      onClick={() => profileInputRef.current?.click()}
                      className="flex-1 border border-border-dark border-dashed p-4 text-center hover:bg-white/5 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[128px]"
                    >
                      <UploadCloud className="text-text-secondary mb-2" size={20} />
                      <p className="text-xs font-bold uppercase text-white mb-1">อัปโหลดรูปใหม่</p>
                      <p className="text-[10px] text-text-secondary">3:4 Ratio</p>
                      <input 
                        type="file" 
                        ref={profileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">ชื่อช่าง (Name)</label>
                  <input 
                    type="text" 
                    value={editingArtist.name}
                    onChange={e => setEditingArtist({...editingArtist, name: e.target.value})}
                    className="w-full bg-black/50 border border-border-dark text-white px-3 py-2 focus:outline-none focus:border-accent-silver/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                    สไตล์งานสัก (Tattoo Styles)
                  </label>
                  <div className="p-3 bg-black/30 border border-border-dark rounded-sm min-h-[100px] flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {editingArtist.styles.map(style => (
                        <span key={style} className="flex items-center gap-1 bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded-sm">
                          {style}
                          <button onClick={() => handleRemoveStyle(style)} className="hover:text-red-400 focus:outline-none">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newStyleInput}
                      onChange={(e) => setNewStyleInput(e.target.value)}
                      onKeyDown={handleAddStyle}
                      placeholder="พิมพ์ชื่อสไตล์แล้วกด Enter..."
                      className="w-full bg-transparent border-none text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-0 mt-2"
                    />
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1">* พิมพ์ชื่อสไตล์แล้วกด Enter เพื่อเพิ่ม</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">ประวัติ (Bio)</label>
                  <textarea 
                    value={editingArtist.bio || ""}
                    onChange={e => setEditingArtist({...editingArtist, bio: e.target.value})}
                    rows={3}
                    className="w-full bg-black/50 border border-border-dark text-white px-3 py-2 focus:outline-none focus:border-accent-silver/50"
                  />
                </div>
              </div>
              
              <div className="p-4 border-t border-border-dark flex justify-end gap-3 bg-black/50">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSaveArtist}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-accent-silver transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : <><Save size={16} /> บันทึก</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
