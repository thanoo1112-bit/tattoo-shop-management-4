"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Info, CheckCircle, Wallet } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function BookingPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slipInputRef = useRef<HTMLInputElement>(null);

  // Data states
  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  
  // Form states
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [placement, setPlacement] = useState("");
  const [sizeW, setSizeW] = useState("");
  const [sizeH, setSizeH] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  // File states
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [slipImage, setSlipImage] = useState<File | null>(null);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Fetch artists
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (data) setArtists(data);
    };
    fetchArtists();
  }, []);

  const handleArtistSelect = (artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    setSelectedArtist(artist);
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtist) return alert("กรุณาเลือกช่างสัก (Please select an artist)");
    if (!slipImage) return alert("กรุณาแนบสลิปมัดจำ (Please attach payment slip)");

    setIsSubmitting(true);
    try {
      // 1. Upload Reference Images
      const refImageUrls = [];
      for (const file of referenceImages) {
        const url = await uploadFile(file, "tattoo-references");
        refImageUrls.push(url);
      }

      // 2. Upload Payment Slip
      const slipUrl = await uploadFile(slipImage, "payment-slips");

      // 3. Insert Appointment
      const { error } = await supabase.from("appointments").insert({
        artist_id: selectedArtist.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail,
        placement,
        size_cm: `${sizeW}x${sizeH}`,
        medical_info: medicalInfo,
        preferred_date: preferredDate || null,
        notes,
        reference_images: refImageUrls,
        slip_image_url: slipUrl,
        status: "pending"
      });

      if (error) throw error;

      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background-dark bg-flash-wall flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background-dark/95 z-0"></div>
        <div className="raw-panel p-8 md:p-12 text-center max-w-md z-10 animate-fade-in">
          <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
          <h2 className="text-2xl font-gothic tracking-widest uppercase mb-4">จองคิวสำเร็จ!</h2>
          <p className="text-text-secondary mb-8 text-sm">
            ระบบได้รับข้อมูลการจองและสลิปมัดจำเรียบร้อยแล้ว ช่างจะทำการตรวจสอบและติดต่อกลับโดยเร็วที่สุด
          </p>
          <Link href="/" className="inline-block bg-white text-black px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-accent-silver transition-colors">
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark bg-flash-wall py-8 md:py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-background-dark/95 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6 text-sm tracking-widest uppercase">
          <ArrowLeft size={16} /> กลับสู่หน้าหลัก
        </Link>
        
        <div className="raw-panel rounded-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-gothic tracking-widest uppercase text-text-primary mb-2">
            REQUEST APPOINTMENT
          </h1>
          <p className="text-sm text-text-secondary mb-8 border-b border-border-dark pb-6">
            กรอกฟอร์มด้านล่างเพื่อ Request คิวสัก หากยังไม่ทราบราคาที่แน่นอน ช่างจะทำการประเมินและติดต่อกลับ
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Guest Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-gothic tracking-widest uppercase text-white/80 border-b border-white/10 pb-2">1. ข้อมูลติดต่อ (Contact Info)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="ชื่อ-นามสกุล (Name)" required className="input-raw w-full" value={guestName} onChange={e => setGuestName(e.target.value)} />
                <input type="tel" placeholder="เบอร์โทรศัพท์ (Phone)" required className="input-raw w-full" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                <input type="email" placeholder="อีเมล (Email - Optional)" className="input-raw w-full md:col-span-2" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
              </div>
            </div>

            {/* Step 2: Artist & Tattoo Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-gothic tracking-widest uppercase text-white/80 border-b border-white/10 pb-2">2. รายละเอียดรอยสัก (Tattoo Details)</h3>
              
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-text-secondary">เลือกช่างสัก (Select Artist)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {artists.map((artist) => (
                    <label key={artist.id} className="cursor-pointer">
                      <input type="radio" name="artist" value={artist.id} onChange={() => handleArtistSelect(artist.id)} className="peer sr-only" required />
                      <div className="p-3 border border-border-dark text-center peer-checked:border-white peer-checked:bg-white/5 transition-all text-sm">
                        <span className="block font-bold">{artist.name}</span>
                        <span className="text-[10px] text-text-secondary uppercase">{artist.style}</span>
                      </div>
                    </label>
                  ))}
                  {artists.length === 0 && <div className="text-xs text-text-secondary p-3 border border-border-dark col-span-3 text-center">กำลังโหลดรายชื่อช่าง... (หากไม่มี ให้เช็กว่ารัน SQL หรือยัง)</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">ตำแหน่งที่จะสัก (Placement)</label>
                  <input type="text" placeholder="เช่น แขนซ้าย, หน้าอก" required className="input-raw w-full" value={placement} onChange={e => setPlacement(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">ขนาด (Size in CM)</label>
                  <div className="flex gap-2 items-center">
                    <input type="number" placeholder="กว้าง" required min="1" className="input-raw w-full" value={sizeW} onChange={e => setSizeW(e.target.value)} />
                    <span className="text-text-secondary text-xs">x</span>
                    <input type="number" placeholder="ยาว" required min="1" className="input-raw w-full" value={sizeH} onChange={e => setSizeH(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs uppercase tracking-wider text-text-secondary">แบบรอยสัก (Reference Images)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-border-dark border-dashed p-6 text-center hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <UploadCloud className="mx-auto text-text-secondary mb-2" size={24} />
                  <p className="text-xs text-text-secondary">คลิกเพื่ออัปโหลด (สูงสุด 3 รูป)</p>
                  {referenceImages.length > 0 && (
                    <p className="text-xs text-white mt-2 font-bold">{referenceImages.length} รูปที่เลือกไว้</p>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={e => {
                      if (e.target.files) {
                        setReferenceImages(Array.from(e.target.files).slice(0, 3));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs uppercase tracking-wider text-text-secondary">ข้อมูลทางการแพทย์ (Medical Info)</label>
                <div className="input-raw p-3 text-xs text-text-secondary flex gap-2 items-start mb-2">
                  <Info className="shrink-0 text-white mt-0.5" size={14} />
                  <p>ระบุโรคประจำตัว โรคติดต่อทางเลือด หรือประวัติการแพ้ หากไม่มีให้พิมพ์ "ไม่มี"</p>
                </div>
                <textarea rows={2} required className="input-raw w-full" value={medicalInfo} onChange={e => setMedicalInfo(e.target.value)} />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="block text-xs uppercase tracking-wider text-text-secondary">วันที่สะดวก (Preferred Date - Optional)</label>
                <input 
                  type="date"
                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                  className="input-raw w-full [color-scheme:dark]"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs uppercase tracking-wider text-text-secondary">รายละเอียดเพิ่มเติม (Notes)</label>
                <textarea rows={2} className="input-raw w-full" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            {/* Step 3: Payment */}
            {selectedArtist && (
              <div className="space-y-4 pt-4 border-t border-border-dark">
                <h3 className="text-sm font-gothic tracking-widest uppercase text-white/80 border-b border-white/10 pb-2">3. ชำระมัดจำ (Deposit Payment)</h3>
                
                <div className="bg-background-dark/50 border border-border-dark p-6 text-center space-y-4">
                  <Wallet className="mx-auto text-text-secondary" size={32} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">โอนเงินเข้าบัญชี: {selectedArtist.name}</p>
                    <p className="text-xs text-text-secondary mt-1">มัดจำ 500 บาท เพื่อล็อกคิว (500 THB Deposit)</p>
                  </div>
                  
                  {selectedArtist.qr_code_url ? (
                    <img src={selectedArtist.qr_code_url} alt="QR Code" className="w-48 h-48 mx-auto bg-white p-2 object-contain" />
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-black border border-border-dark flex items-center justify-center text-xs text-text-secondary">
                      ไม่มี QR Code<br/>(No QR Code Provided)
                    </div>
                  )}

                  <div className="text-sm bg-black/40 p-4 inline-block mx-auto text-left space-y-1">
                    <p><span className="text-text-secondary">พร้อมเพย์ (PromptPay):</span> {selectedArtist.promptpay_number || "-"}</p>
                    <p><span className="text-text-secondary">ธนาคาร (Bank):</span> {selectedArtist.bank_name || "-"}</p>
                    <p><span className="text-text-secondary">ชื่อบัญชี (Account):</span> {selectedArtist.bank_account_name || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">แนบสลิปโอนเงิน (Upload Slip) *</label>
                  <div 
                    onClick={() => slipInputRef.current?.click()}
                    className={`border p-4 text-center cursor-pointer transition-colors ${slipImage ? 'border-green-500/50 bg-green-500/5' : 'border-border-dark border-dashed hover:bg-white/5'}`}
                  >
                    <p className={`text-xs ${slipImage ? 'text-green-400 font-bold' : 'text-text-secondary'}`}>
                      {slipImage ? `อัปโหลดแล้ว: ${slipImage.name}` : 'คลิกเพื่ออัปโหลดสลิป'}
                    </p>
                    <input 
                      type="file" 
                      ref={slipInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSlipImage(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-black font-bold py-4 text-sm uppercase tracking-widest hover:bg-accent-silver transition-all disabled:opacity-50 mt-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isSubmitting ? "กำลังส่งข้อมูล..." : "ยืนยันการจองคิว (SUBMIT REQUEST)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
