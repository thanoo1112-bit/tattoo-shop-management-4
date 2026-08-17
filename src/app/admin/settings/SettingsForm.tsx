"use client";

import { useState, useRef } from "react";
import { updateArtistSettings } from "./actions";
import { UploadCloud, CheckCircle, Wallet, User } from "lucide-react";

export default function SettingsForm({ artist }: { artist: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Profile Info States
  const [name, setName] = useState(artist.name || "");
  const [specialty, setSpecialty] = useState(artist.specialty || "");
  const [bio, setBio] = useState(artist.bio || "");
  const initialStyles = artist.styles ? (typeof artist.styles === 'string' ? JSON.parse(artist.styles) : artist.styles) : [];
  const [styles, setStyles] = useState<string[]>(initialStyles);
  const [newStyle, setNewStyle] = useState("");
  
  // QR Code States
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(artist.qr_code_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Image States
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(artist.profile_image_url || null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setQrFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsSuccess(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileFile(file);
      setProfilePreviewUrl(URL.createObjectURL(file));
      setIsSuccess(false);
    }
  };

  const handleAddStyle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newStyle.trim() !== '') {
      e.preventDefault();
      const styleUpper = newStyle.trim().toUpperCase();
      if (!styles.includes(styleUpper)) {
        setStyles([...styles, styleUpper]);
      }
      setNewStyle('');
    }
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    setStyles(styles.filter(s => s !== styleToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set('styles', JSON.stringify(styles));
    if (qrFile) {
      formData.set('qr_code_file', qrFile);
    }
    if (profileFile) {
      formData.set('profile_image_file', profileFile);
    }

    const result = await updateArtistSettings(formData);
    
    setIsSubmitting(false);
    if (result.error) {
      alert("Error: " + result.error);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <input type="hidden" name="artist_id" value={artist.id} />
      <input type="hidden" name="existing_qr_url" value={artist.qr_code_url || ""} />
      <input type="hidden" name="existing_profile_url" value={artist.profile_image_url || ""} />
      
      <div className="raw-panel p-6 sm:p-8 space-y-6 border border-border-dark mb-6">
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <User className="text-text-secondary" size={24} />
          <div>
            <h2 className="text-lg font-gothic tracking-widest uppercase">รูปโปรไฟล์ช่าง (Profile Image)</h2>
            <p className="text-xs text-text-secondary mt-1">รูปที่จะแสดงในหน้ารายชื่อช่างสักและผลงานของคุณ</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-32 h-32 rounded-full bg-black border border-border-dark flex items-center justify-center relative overflow-hidden shrink-0">
            {profilePreviewUrl ? (
              <img src={profilePreviewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="text-text-secondary w-12 h-12" />
            )}
          </div>

          <div 
            onClick={() => profileInputRef.current?.click()}
            className="flex-1 border border-border-dark border-dashed p-4 text-center hover:bg-white/5 cursor-pointer transition-colors w-full"
          >
            <UploadCloud className="text-text-secondary mx-auto mb-2" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">เปลี่ยนรูปโปรไฟล์</p>
            <p className="text-xs text-text-secondary">ขนาดแนะนำ 500x500px (PNG, JPG)</p>
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

      {/* Profile Info Section */}
      <div className="raw-panel p-6 sm:p-8 space-y-6 border border-border-dark mb-6">
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <User className="text-text-secondary" size={24} />
          <div>
            <h2 className="text-lg font-gothic tracking-widest uppercase">ข้อมูลส่วนตัว (Profile Info)</h2>
            <p className="text-xs text-text-secondary mt-1">ข้อมูลที่จะแสดงให้ลูกค้าเห็นในหน้ารายชื่อช่าง</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">ชื่อช่าง (Name)</label>
            <input 
              type="text" 
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-black/50 border border-border-dark text-white px-3 py-2 focus:outline-none focus:border-accent-silver/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">ความถนัดหลัก (Specialty)</label>
            <input 
              type="text" 
              name="specialty"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="w-full bg-black/50 border border-border-dark text-white px-3 py-2 focus:outline-none focus:border-accent-silver/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
              สไตล์งานสัก (Tattoo Styles)
            </label>
            <div className="p-3 bg-black/30 border border-border-dark rounded-sm min-h-[100px] flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {styles.map(style => (
                  <span key={style} className="flex items-center gap-1 bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded-sm">
                    {style}
                    <button type="button" onClick={() => handleRemoveStyle(style)} className="hover:text-red-400 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                value={newStyle}
                onChange={e => setNewStyle(e.target.value)}
                onKeyDown={handleAddStyle}
                placeholder={styles.length === 0 ? "พิมพ์สไตล์งาน (เช่น JAPAN, MINIMAL) แล้วกด Enter" : "เพิ่มสไตล์อื่นๆ..."}
                className="w-full bg-transparent border-none text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-0 mt-2"
              />
            </div>
            <p className="text-[10px] text-text-secondary mt-1">* พิมพ์ชื่อสไตล์แล้วกด Enter เพื่อเพิ่ม</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">ประวัติ (Bio)</label>
            <textarea 
              name="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-black/50 border border-border-dark text-white px-3 py-2 focus:outline-none focus:border-accent-silver/50"
            />
          </div>
        </div>
      </div>

      <div className="raw-panel p-6 sm:p-8 space-y-6 border border-border-dark">
        
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <Wallet className="text-text-secondary" size={24} />
          <div>
            <h2 className="text-lg font-gothic tracking-widest uppercase">ข้อมูลบัญชีรับเงิน (Payment Info)</h2>
            <p className="text-xs text-text-secondary mt-1">ข้อมูลส่วนนี้จะไปแสดงให้ลูกค้าเห็นตอนจองคิว เพื่อให้โอนเงินมัดจำเข้าบัญชีคุณโดยตรง</p>
          </div>
        </div>

        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-sm flex items-center gap-3 text-sm">
            <CheckCircle size={18} /> อัปเดตข้อมูลสำเร็จ (Settings updated successfully!)
          </div>
        )}

        <div className="space-y-3 pt-2">
          <label className="text-xs uppercase tracking-widest text-text-secondary">อัปโหลด QR Code รับเงิน (Payment QR Code)</label>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Preview Box */}
            <div className="w-full sm:w-56 bg-white/5 border border-border-dark flex items-center justify-center relative overflow-hidden shrink-0 rounded-md py-6 px-4">
              {previewUrl ? (
                <img src={previewUrl} alt="QR Preview" className="w-full max-w-[220px] sm:max-w-full h-auto max-h-[320px] object-contain bg-white p-3 rounded-md shadow-lg" />
              ) : (
                <div className="text-center p-8 min-h-[200px] flex flex-col items-center justify-center">
                  <p className="text-xs text-text-secondary uppercase tracking-widest">No QR Code</p>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border border-border-dark border-dashed p-6 text-center hover:bg-white/5 cursor-pointer transition-colors self-stretch flex flex-col items-center justify-center"
            >
              <UploadCloud className="text-text-secondary mb-3" size={28} />
              <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">เปลี่ยน QR Code</p>
              <p className="text-xs text-text-secondary">คลิกเพื่ออัปโหลดไฟล์ภาพ (PNG, JPG)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>

          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-border-dark">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-white text-black px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-accent-silver transition-all disabled:opacity-50"
          >
            {isSubmitting ? "กำลังบันทึก (SAVING)..." : "บันทึกการตั้งค่า (SAVE SETTINGS)"}
          </button>
        </div>
      </div>
    </form>
  );
}



