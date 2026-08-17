"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Info, CheckCircle, Wallet, ChevronRight, ChevronLeft, Calendar, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function calculatePricing(w: string, h: string) {
  const width = parseFloat(w) || 0;
  const height = parseFloat(h) || 0;
  const max = Math.max(width, height);

  if (max <= 0) return null;
  
  if (max <= 5) {
    return { tier: "Size S", price: "500 – 1,500 บาท", helper: "เทียบเท่าเหรียญ 10 บาท หรือ กล่องไม้ขีดไฟ" };
  } else if (max <= 10) {
    return { tier: "Size M", price: "1,500 – 4,000 บาท", helper: "เทียบเท่านามบัตร หรือ ซองบุหรี่" };
  } else if (max <= 15) {
    return { tier: "Size L", price: "4,000 – 10,000 บาท", helper: "เทียบเท่าหน้าจอสมาร์ทโฟน หรือ 1 ฝ่ามือ" };
  } else if (max <= 25) {
    return { tier: "Size XL", price: "10,000 – 20,000 บาท", helper: "เทียบเท่ากระดาษ A5 หรือ หน้าจอ iPad" };
  } else {
    return { tier: "Size XXL", price: "20,000 – 30,000 บาท", helper: "ขนาดกระดาษ A4 ขึ้นไป (งานเต็มแขน/เต็มหลัง)" };
  }
}

export default function BookingPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slipInputRef = useRef<HTMLInputElement>(null);

  // Data states
  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  
  // Step state
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form states
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
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

  const pricingInfo = calculatePricing(sizeW, sizeH);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase.from("artists").select("*");
      if (data) {
        setArtists(data);
        
        // Auto-select artist if URL has ?artist=id
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          const artistId = searchParams.get('artist');
          if (artistId) {
            const matchedArtist = data.find((a: any) => a.id === artistId);
            if (matchedArtist) {
              const parsedStyles = Array.isArray(matchedArtist.styles) 
                ? matchedArtist.styles 
                : (typeof matchedArtist.styles === 'string' ? JSON.parse(matchedArtist.styles) : []);
              
              setSelectedArtist({...matchedArtist, styles: parsedStyles});
              setStep(2); // Skip Step 1 and go directly to Step 2
            }
          }
        }
      }
    };
    fetchArtists();
  }, []);

  const handleArtistSelect = (artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
      const parsedStyles = Array.isArray(artist.styles) 
        ? artist.styles 
        : (typeof artist.styles === 'string' ? JSON.parse(artist.styles) : []);
      
      setSelectedArtist({...artist, styles: parsedStyles});
      setSelectedStyle("");
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${Date.now()}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtist) return alert("กรุณาเลือกช่างสัก (Please select an artist)");
    if (!slipImage) return alert("กรุณาแนบสลิปมัดจำ (Please attach payment slip)");

    setIsSubmitting(true);
    try {
      const refImageUrls = [];
      for (const file of referenceImages) {
        const url = await uploadFile(file, "tattoo-references");
        refImageUrls.push(url);
      }

      const slipUrl = await uploadFile(slipImage, "payment-slips");
      
      const { error } = await supabase.from("appointments").insert({
        artist_id: selectedArtist.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail,
        style: selectedStyle,
        placement,
        size_cm: `${sizeW}x${sizeH}`,
        size_w: parseFloat(sizeW) || null,
        size_h: parseFloat(sizeH) || null,
        size_tier: pricingInfo?.tier || null,
        estimated_price_range: pricingInfo?.price || null,
        medical_info: medicalInfo,
        preferred_date: preferredDate || null,
        notes,
        reference_images: refImageUrls,
        slip_image_url: slipUrl,
        status: "pending"
      });

      if (error) throw error;

      try {
        await fetch('/api/web-push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: "มีคิวจองใหม่! (New Booking)",
            message: `ลูกค้า ${guestName} จองคิวงาน ${selectedStyle}`,
            guestName: guestName
          })
        });
      } catch (pushErr) {
        console.error("Failed to trigger push notification", pushErr);
      }

      setIsSuccess(true);
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedArtist) return alert("กรุณาเลือกช่างสัก");
    if (step === 2) {
      if (!selectedStyle) return alert("กรุณาเลือกสไตล์งาน");
      if (!placement) return alert("กรุณาระบุตำแหน่งที่จะสัก");
      if (!sizeW || !sizeH) return alert("กรุณาระบุขนาดงาน");
    }
    if (step === 3) {
      if (!guestName || !guestPhone || !medicalInfo) return alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-flash-wall px-4 relative z-0">
        <div className="fixed inset-0 bg-background-dark/70 pointer-events-none z-[-1]"></div>
        <div className="raw-panel p-12 max-w-md w-full text-center space-y-6 animate-fade-in relative z-10">
          <CheckCircle className="mx-auto text-white" size={64} />
          <div>
            <h2 className="text-2xl font-gothic tracking-widest uppercase mb-2">จองคิวสำเร็จ!</h2>
            <p className="text-text-secondary text-sm">
              เราได้รับข้อมูลและหลักฐานการโอนเงินของคุณแล้ว<br/>ทีมงานจะติดต่อกลับเพื่อยืนยันวันและเวลาโดยเร็วที่สุด
            </p>
          </div>
          <Link href="/" className="inline-block border border-border-dark px-8 py-3 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors mt-4">
            กลับสู่หน้าหลัก (BACK TO HOME)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flash-wall py-12 px-4 md:py-20 relative z-0">
      <div className="fixed inset-0 bg-background-dark/70 pointer-events-none z-[-1]"></div>
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 text-sm tracking-widest uppercase">
          <ArrowLeft size={16} /> กลับหน้าหลัก (Back)
        </Link>

        <div className="raw-panel overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-10 border-b border-border-dark bg-background-dark/50">
            <h1 className="text-3xl md:text-4xl font-gothic tracking-widest uppercase mb-2">จองคิวสัก (BOOKING)</h1>
            <p className="text-sm text-text-secondary">กรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการประเมินราคาและล็อกคิว</p>
            
            {/* Progress Bar */}
            <div className="mt-8 flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-dark -z-10"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-white transition-all duration-500 ease-in-out -z-10"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
              
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  step >= s ? 'bg-white text-black' : 'bg-background-dark border border-border-dark text-text-secondary'
                }`}>
                  {s}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] uppercase tracking-widest text-text-secondary">
              <span className={step >= 1 ? 'text-white' : ''}>ช่างสัก</span>
              <span className={step >= 2 ? 'text-white' : ''}>รายละเอียด</span>
              <span className={step >= 3 ? 'text-white' : ''}>ข้อมูลลูกค้า</span>
              <span className={step >= 4 ? 'text-white' : ''}>ยืนยัน</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10">
            
            {/* STEP 1: Select Artist */}
            <div className={step === 1 ? 'block animate-fade-in' : 'hidden'}>
              <h2 className="text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs">1</span> 
                เลือกช่างสัก (SELECT ARTIST)
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {artists.map((artist) => (
                  <div 
                    key={artist.id} 
                    onClick={() => handleArtistSelect(artist.id)}
                    className={`border cursor-pointer transition-all duration-300 relative overflow-hidden group flex sm:block items-center ${
                      selectedArtist?.id === artist.id ? 'border-white ring-1 ring-white bg-white/5' : 'border-border-dark hover:border-text-secondary bg-background-dark/50'
                    }`}
                  >
                    {/* Image Container */}
                    <div className="w-24 h-24 sm:w-full sm:h-auto sm:aspect-square bg-border-dark relative shrink-0">
                      {artist.image_url ? (
                        <img src={artist.image_url} alt={artist.name} className="w-full h-full object-cover grayscale sm:group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="text-text-secondary text-[10px]">NO IMAGE</span></div>
                      )}
                      
                      {/* Gradient & Name for PC */}
                      <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="hidden sm:block absolute bottom-3 left-3">
                        <p className="font-bold tracking-wider">{artist.name}</p>
                      </div>
                    </div>

                    {/* Name & Checkmark for Mobile */}
                    <div className="p-4 sm:hidden flex-1 flex items-center justify-between">
                      <p className="font-bold tracking-wider text-sm">{artist.name}</p>
                      {selectedArtist?.id === artist.id && (
                        <div className="text-green-400">
                          <CheckCircle size={20} />
                        </div>
                      )}
                    </div>

                    {/* Checkmark for PC */}
                    {selectedArtist?.id === artist.id && (
                      <div className="hidden sm:flex absolute top-2 right-2 bg-white text-black rounded-full p-1 items-center justify-center">
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: Tattoo Details */}
            <div className={step === 2 ? 'block animate-fade-in' : 'hidden'}>
              <h2 className="text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs">2</span> 
                รายละเอียดรอยสัก (TATTOO DETAILS)
              </h2>

              <div className="space-y-6">
                {selectedArtist && selectedArtist.styles && selectedArtist.styles.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-text-secondary">สไตล์งาน (Style) *</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist.styles.map((style: string) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setSelectedStyle(style)}
                          className={`px-4 py-2 border text-sm transition-all ${
                            selectedStyle === style 
                              ? 'bg-white text-black border-white font-bold' 
                              : 'border-border-dark text-text-secondary hover:border-text-secondary'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-text-secondary">ตำแหน่ง (Placement) *</label>
                    <input 
                      type="text" 
                      placeholder="เช่น ท้องแขน, น่อง, กลางหลัง"
                      className="input-raw w-full" 
                      value={placement}
                      onChange={e => setPlacement(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-text-secondary">ขนาดโดยประมาณ (Size in CM) *</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="กว้าง" className="input-raw w-full" value={sizeW} onChange={e => setSizeW(e.target.value)} />
                      <span className="text-text-secondary">x</span>
                      <input type="number" placeholder="ยาว" className="input-raw w-full" value={sizeH} onChange={e => setSizeH(e.target.value)} />
                      <span className="text-text-secondary text-xs">cm</span>
                    </div>
                    {pricingInfo && (
                      <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold uppercase tracking-widest text-text-primary">[{pricingInfo.tier}] ราคาประเมิน:</span>
                          <span className="text-sm font-bold text-accent-silver">{pricingInfo.price}</span>
                        </div>
                        <p className="text-xs text-text-secondary mb-2">{pricingInfo.helper}</p>
                        {pricingInfo.tier === "Size XXL" && (
                          <div className="text-[10px] text-yellow-500 bg-yellow-500/10 p-2 border border-yellow-500/20 rounded-sm">
                            *ราคาจริงขึ้นอยู่กับรายละเอียดความยากและจำนวนรอบที่ใช้สัก
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">รูปตัวอย่าง (Reference Images)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-border-dark border-dashed p-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <UploadCloud className="mx-auto text-text-secondary mb-2" size={24} />
                      <p className="text-xs text-text-secondary">คลิกเพื่ออัปโหลดรูป (อัปได้หลายรูป)</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        accept="image/*" 
                        onChange={e => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files);
                            setReferenceImages(prev => [...prev, ...newFiles]);
                            if (e.target) e.target.value = '';
                          }
                        }}
                      />
                    </div>
                    {referenceImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 h-fit">
                        {referenceImages.map((file, index) => (
                          <div key={index} className="relative aspect-square bg-border-dark rounded overflow-hidden">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`preview-${index}`} 
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReferenceImages(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10 flex items-center justify-center"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">รายละเอียดเพิ่มเติม (Notes)</label>
                  <textarea rows={3} className="input-raw w-full" placeholder="อธิบายรายละเอียดจุดที่ต้องการเน้น เช่น ขอเส้นบางๆ..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>
            </div>

            {/* STEP 3: Personal Info */}
            <div className={step === 3 ? 'block animate-fade-in' : 'hidden'}>
              <h2 className="text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs">3</span> 
                ข้อมูลลูกค้า (PERSONAL INFO)
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-text-secondary">ชื่อ-นามสกุล หรือ ชื่อเล่น (Name) *</label>
                    <input type="text" className="input-raw w-full" value={guestName} onChange={e => setGuestName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-text-secondary">เบอร์โทรศัพท์ (Phone) *</label>
                    <input type="tel" className="input-raw w-full" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">อีเมล (Email) - Optional</label>
                  <input type="email" className="input-raw w-full" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">ข้อมูลทางการแพทย์ (Medical Info) *</label>
                  <div className="input-raw p-3 text-xs text-text-secondary flex gap-2 items-start mb-2">
                    <Info className="shrink-0 text-white mt-0.5" size={14} />
                    <p>ระบุโรคประจำตัว โรคติดต่อทางเลือด หรือประวัติการแพ้ หากไม่มีให้พิมพ์ "ไม่มี"</p>
                  </div>
                  <textarea rows={2} className="input-raw w-full" placeholder="ไม่มี / แพ้ยา... / เป็นโรค..." value={medicalInfo} onChange={e => setMedicalInfo(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-text-secondary">วันที่สะดวก (Preferred Date) - Optional</label>
                  <input 
                    type="date"
                    min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                    className="input-raw w-full [color-scheme:dark]"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                  />
                  <p className="text-xs text-text-secondary mt-1">* วันที่คิวว่างจริงจะขึ้นอยู่กับการตกลงกับช่างอีกครั้ง</p>
                </div>
              </div>
            </div>

            {/* STEP 4: Confirm & Payment */}
            <div className={step === 4 ? 'block animate-fade-in' : 'hidden'}>
              <h2 className="text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs">4</span> 
                ชำระมัดจำ (DEPOSIT & CONFIRM)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest uppercase border-b border-border-dark pb-2">สรุปข้อมูล (Summary)</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-text-secondary">ช่างสัก:</span>
                      <span className="font-bold">{selectedArtist?.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-text-secondary">สไตล์/ตำแหน่ง:</span>
                      <span className="text-right">{selectedStyle} / {placement}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-text-secondary">ขนาด:</span>
                      <span>{sizeW} x {sizeH} cm</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-text-secondary">ชื่อ/เบอร์โทร:</span>
                      <span className="text-right">{guestName} ({guestPhone})</span>
                    </div>
                    {preferredDate && (
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-text-secondary">วันที่สะดวก:</span>
                        <span>{new Date(preferredDate).toLocaleDateString('Th-th')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-6">
                  {(() => {
                    const paymentArtist = artists.find(a => a.name.includes("บอม")) || selectedArtist;
                    return (
                      <div className="bg-background-dark/80 border border-border-dark rounded-xl p-6 text-center space-y-4 shadow-lg">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest text-green-400">มัดจำ 500 บาท</p>
                          <p className="text-xs text-text-secondary mt-1">สแกน QR Code เพื่อล็อกคิว (Deposit)</p>
                        </div>
                        
                        <div className="w-full max-w-[280px] mx-auto bg-white/5 border border-border-dark flex items-center justify-center relative overflow-hidden shrink-0 rounded-md py-6 px-4 shadow-lg">
                          {paymentArtist?.qr_code_url ? (
                            <img src={paymentArtist.qr_code_url} alt="QR Code" className="w-full max-w-[220px] sm:max-w-full h-auto max-h-[320px] object-contain bg-white p-3 rounded-md shadow-lg" />
                          ) : (
                            <div className="text-center p-8 min-h-[200px] flex flex-col items-center justify-center">
                              <p className="text-xs text-text-secondary uppercase tracking-widest">No QR Code</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold uppercase tracking-wider text-white">แนบสลิปโอนเงิน *</label>
                      {slipImage && (
                        <button type="button" onClick={() => setSlipImage(null)} className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1 rounded-full">
                          ลบรูป (Remove)
                        </button>
                      )}
                    </div>
                    
                    {slipImage ? (
                      <div className="border-2 border-green-500/50 bg-green-500/5 p-6 rounded-xl flex items-center gap-4 text-left transition-all">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle size={24} className="text-green-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-green-400 mb-1">อัปโหลดสำเร็จ (Uploaded)</p>
                          <p className="text-xs text-text-secondary truncate">{slipImage.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => slipInputRef.current?.click()}
                        className="border-2 border-white/20 border-dashed p-10 text-center cursor-pointer hover:bg-white/5 hover:border-white/50 transition-all rounded-xl group bg-background-dark/40"
                      >
                        <UploadCloud className="mx-auto text-text-secondary group-hover:text-white transition-colors mb-3" size={36} />
                        <p className="text-sm font-bold text-text-secondary group-hover:text-white transition-colors">
                          คลิกเพื่ออัปโหลดสลิป
                        </p>
                      </div>
                    )}

                    <input 
                      type="file" 
                      ref={slipInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSlipImage(e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-border-dark flex gap-4">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-6 py-4 border border-border-dark flex items-center gap-2 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft size={18} /> ย้อนกลับ
                </button>
              )}
              
              {step < totalSteps ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex-1 bg-white text-black font-bold py-4 text-sm uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-accent-silver transition-all"
                >
                  ถัดไป <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-white text-black font-bold py-4 text-sm uppercase tracking-widest hover:bg-accent-silver transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  {isSubmitting ? "กำลังส่งข้อมูล..." : "ยืนยันการจองคิว (SUBMIT)"}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
