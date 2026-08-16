"use client";

import { useState, useRef } from "react";
import { updateArtistSettings } from "./actions";
import { UploadCloud, CheckCircle, Wallet, Image as ImageIcon } from "lucide-react";

export default function SettingsForm({ artist }: { artist: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // QR Code State
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(artist.qr_code_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Image State
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    const formData = new FormData(e.currentTarget);
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <input type="hidden" name="artist_id" value={artist.id} />
      <input type="hidden" name="existing_qr_url" value={artist.qr_code_url || ""} />
      <input type="hidden" name="existing_profile_url" value={artist.profile_image_url || ""} />
      
      {/* Profile Image Section */}
      <div className="raw-panel p-6 sm:p-8 space-y-6 border border-border-dark mb-6">
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <ImageIcon className="text-text-secondary" size={24} />
          <div>
            <h2 className="text-lg font-gothic tracking-widest uppercase">รูปโปรไฟล์ (Profile Image)</h2>
            <p className="text-xs text-text-secondary mt-1">รูปภาพที่จะไปแสดงในหน้าหลักของเว็บไซต์</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Profile Preview */}
          <div className="w-32 h-40 bg-black border border-border-dark flex items-center justify-center relative overflow-hidden shrink-0">
            {profilePreviewUrl ? (
              <img src={profilePreviewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <p className="text-xs text-text-secondary uppercase tracking-widest">No Image</p>
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div 
            onClick={() => profileInputRef.current?.click()}
            className="flex-1 w-full border border-border-dark border-dashed p-6 text-center hover:bg-white/5 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[160px]"
          >
            <UploadCloud className="text-text-secondary mb-3" size={28} />
            <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">เปลี่ยนรูปโปรไฟล์</p>
            <p className="text-xs text-text-secondary">ขนาดแนะนำ 3:4 (เช่น 600x800px)</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-text-secondary">ชื่อธนาคาร (Bank Name)</label>
            <input 
              name="bank_name"
              type="text" 
              defaultValue={artist.bank_name || ""}
              placeholder="เช่น กสิกรไทย, SCB" 
              className="input-raw w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-text-secondary">ชื่อบัญชี (Account Name)</label>
            <input 
              name="bank_account_name"
              type="text" 
              defaultValue={artist.bank_account_name || ""}
              placeholder="นาย สมชาย เข็มกลัด" 
              className="input-raw w-full"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-text-secondary">เบอร์พร้อมเพย์ (PromptPay Number)</label>
            <input 
              name="promptpay_number"
              type="text" 
              defaultValue={artist.promptpay_number || ""}
              placeholder="08X-XXX-XXXX หรือ เลขบัตรประชาชน" 
              className="input-raw w-full"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border-dark">
          <label className="text-xs uppercase tracking-widest text-text-secondary">อัปโหลด QR Code รับเงิน (Payment QR Code)</label>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Preview Box */}
            <div className="w-48 h-48 bg-black border border-border-dark flex items-center justify-center relative overflow-hidden shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="QR Preview" className="w-full h-full object-contain bg-white p-2" />
              ) : (
                <div className="text-center p-4">
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
