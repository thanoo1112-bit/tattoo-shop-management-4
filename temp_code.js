const fs = require("fs");
const code = `\u0022use client\u0022;

import { useState, useEffect, useRef } from \u0022react\u0022;
import Link from \u0022next/link\u0022;
import { ArrowLeft, UploadCloud, Info, CheckCircle, Wallet, ChevronRight, ChevronLeft, Calendar, X } from \u0022lucide-react\u0022;
import { createClient } from \u0022@/utils/supabase/client\u0022;

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
  const [guestName, setGuestName] = useState(\u0022\u0022);
  const [guestPhone, setGuestPhone] = useState(\u0022\u0022);
  const [guestEmail, setGuestEmail] = useState(\u0022\u0022);
  const [selectedStyle, setSelectedStyle] = useState(\u0022\u0022);
  const [placement, setPlacement] = useState(\u0022\u0022);
  const [sizeW, setSizeW] = useState(\u0022\u0022);
  const [sizeH, setSizeH] = useState(\u0022\u0022);
  const [medicalInfo, setMedicalInfo] = useState(\u0022\u0022);
  const [preferredDate, setPreferredDate] = useState(\u0022\u0022);
  const [notes, setNotes] = useState(\u0022\u0022);

  // File states
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [slipImage, setSlipImage] = useState<File | null>(null);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase.from(\u0022artists\u0022).select(\u0022*\u0022);
      if (data) setArtists(data);
    };
    fetchArtists();
  }, []);

  const handleArtistSelect = (artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
      const parsedStyles = Array.isArray(artist.styles) 
        ? artist.styles 
        : (typeof artist.styles === \u0022string\u0022 ? JSON.parse(artist.styles) : []);
      
      setSelectedArtist({...artist, styles: parsedStyles});
      setSelectedStyle(\u0022\u0022); // reset style when artist changes
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split(\u0022.\u0022).pop();
    const fileName = \`\${Math.random()}.\${fileExt}\`;
    const filePath = \`\${Date.now()}-\${fileName}\`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtist) return alert(\u0022กรุณาเลือกช่างสัก (Please select an artist)\u0022);
    if (!slipImage) return alert(\u0022กรุณาแนบสลิปมัดจำ (Please attach payment slip)\u0022);

    setIsSubmitting(true);
    try {
      const refImageUrls = [];
      for (const file of referenceImages) {
        const url = await uploadFile(file, \u0022tattoo-references\u0022);
        refImageUrls.push(url);
      }

      const slipUrl = await uploadFile(slipImage, \u0022payment-slips\u0022);
      
      const { error } = await supabase.from(\u0022appointments\u0022).insert({
        artist_id: selectedArtist.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail,
        style: selectedStyle,
        placement,
        size_cm: \`\${sizeW}x\${sizeH}\`,
        medical_info: medicalInfo,
        preferred_date: preferredDate || null,
        notes,
        reference_images: refImageUrls,
        slip_image_url: slipUrl,
        status: \u0022pending\u0022
      });

      if (error) throw error;

      try {
        await fetch(\u0022/api/web-push/send\u0022, {
          method: \u0022POST\u0022,
          headers: { \u0022Content-Type\u0022: \u0022application/json\u0022 },
          body: JSON.stringify({
            title: \u0022มีคิวจองใหม่! (New Booking)\u0022,
            message: \`ลูกค้า \${guestName} จองคิวงาน \${selectedStyle}\`,
            guestName: guestName
          })
        });
      } catch (pushErr) {
        console.error(\u0022Failed to trigger push notification\u0022, pushErr);
      }

      setIsSuccess(true);
    } catch (err: any) {
      alert(\u0022เกิดข้อผิดพลาด: \u0022 + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validation before moving to next step
    if (step === 1 && !selectedArtist) return alert(\u0022กรุณาเลือกช่างสัก\u0022);
    if (step === 2) {
      if (!selectedStyle) return alert(\u0022กรุณาเลือกสไตล์งาน\u0022);
      if (!placement) return alert(\u0022กรุณาระบุตำแหน่งที่สัก\u0022);
      if (!sizeW || !sizeH) return alert(\u0022กรุณาระบุขนาด\u0022);
    }
    if (step === 3) {
      if (!guestName || !guestPhone || !medicalInfo) return alert(\u0022กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน\u0022);
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
      <div className=\u0022min-h-screen flex items-center justify-center bg-ink-smoke px-4\u0022>
        <div className=\u0022raw-panel p-12 max-w-md w-full text-center space-y-6 animate-fade-in\u0022>
          <CheckCircle className=\u0022mx-auto text-white\u0022 size={64} />
          <div>
            <h2 className=\u0022text-2xl font-gothic tracking-widest uppercase mb-2\u0022>จองคิวสำเร็จ!</h2>
            <p className=\u0022text-text-secondary text-sm\u0022>
              เราได้รับข้อมูลและหลักฐานการโอนเงินของคุณแล้ว<br/>ทีมงานจะติดต่อกลับเพื่อยืนยันวันและเวลาโดยเร็วที่สุด
            </p>
          </div>
          <Link href=\u0022/\u0022 className=\u0022inline-block border border-border-dark px-8 py-3 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors mt-4\u0022>
            กลับสู่หน้าหลัก (BACK TO HOME)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=\u0022min-h-screen bg-ink-smoke py-12 px-4 md:py-20 relative\u0022>
      <div className=\u0022absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none\u0022></div>
      
      <div className=\u0022max-w-3xl mx-auto relative z-10\u0022>
        <Link href=\u0022/\u0022 className=\u0022inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 text-sm tracking-widest uppercase\u0022>
          <ArrowLeft size={16} /> กลับหน้าหลัก (Back)
        </Link>

        <div className=\u0022raw-panel overflow-hidden\u0022>
          {/* Header */}
          <div className=\u0022p-6 md:p-10 border-b border-border-dark bg-background-dark/50\u0022>
            <h1 className=\u0022text-3xl md:text-4xl font-gothic tracking-widest uppercase mb-2\u0022>จองคิวสัก (BOOKING)</h1>
            <p className=\u0022text-sm text-text-secondary\u0022>กรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการประเมินราคาและล็อกคิว</p>
            
            {/* Progress Bar */}
            <div className=\u0022mt-8 flex items-center justify-between relative\u0022>
              <div className=\u0022absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-dark -z-10\u0022></div>
              <div 
                className=\u0022absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-white transition-all duration-500 ease-in-out -z-10\u0022
                style={{ width: \`\${((step - 1) / (totalSteps - 1)) * 100}%\` }}
              ></div>
              
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 \${
                  step >= s ? \u0022bg-white text-black\u0022 : \u0022bg-background-dark border border-border-dark text-text-secondary\u0022
                }\`}>
                  {s}
                </div>
              ))}
            </div>
            <div className=\u0022flex justify-between mt-2 text-[10px] uppercase tracking-widest text-text-secondary\u0022>
              <span className={step >= 1 ? \u0022text-white\u0022 : \u0022\u0022}>ช่างสัก</span>
              <span className={step >= 2 ? \u0022text-white\u0022 : \u0022\u0022}>รายละเอียด</span>
              <span className={step >= 3 ? \u0022text-white\u0022 : \u0022\u0022}>ข้อมูลลูกค้า</span>
              <span className={step >= 4 ? \u0022text-white\u0022 : \u0022\u0022}>ยืนยัน</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className=\u0022p-6 md:p-10\u0022>
            
            {/* STEP 1: Select Artist */}
            <div className={step === 1 ? \u0022block animate-fade-in\u0022 : \u0022hidden\u0022}>
              <h2 className=\u0022text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2\u0022>
                <span className=\u0022w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs\u0022>1</span> 
                เลือกช่างสัก (SELECT ARTIST)
              </h2>
              
              <div className=\u0022grid grid-cols-2 sm:grid-cols-3 gap-4\u0022>
                {artists.map((artist) => (
                  <div 
                    key={artist.id} 
                    onClick={() => handleArtistSelect(artist.id)}
                    className={\`border cursor-pointer transition-all duration-300 relative overflow-hidden group \${
                      selectedArtist?.id === artist.id ? \u0022border-white ring-1 ring-white\u0022 : \u0022border-border-dark hover:border-text-secondary\u0022
                    }\`}
                  >
                    <div className=\u0022aspect-square bg-border-dark relative\u0022>
                      {artist.image_url ? (
                        <img src={artist.image_url} alt={artist.name} className=\u0022w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500\u0022 />
                      ) : (
                        <div className=\u0022w-full h-full flex items-center justify-center\u0022><span className=\u0022text-text-secondary text-xs\u0022>NO IMAGE</span></div>
                      )}
                      <div className=\u0022absolute inset-0 bg-gradient-to-t from-black/80 to-transparent\u0022></div>
                      <div className=\u0022absolute bottom-3 left-3\u0022>
                        <p className=\u0022font-bold tracking-wider\u0022>{artist.name}</p>
                      </div>
                      {selectedArtist?.id === artist.id && (
                        <div className=\u0022absolute top-2 right-2 bg-white text-black rounded-full p-1\u0022>
                          <CheckCircle size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: Tattoo Details */}
            <div className={step === 2 ? \u0022block animate-fade-in\u0022 : \u0022hidden\u0022}>
              <h2 className=\u0022text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2\u0022>
                <span className=\u0022w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs\u0022>2</span> 
                รายละเอียดรอยสัก (TATTOO DETAILS)
              </h2>

              <div className=\u0022space-y-6\u0022>
                {selectedArtist && selectedArtist.styles && selectedArtist.styles.length > 0 && (
                  <div className=\u0022space-y-2\u0022>
                    <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>สไตล์งาน (Style) *</label>
                    <div className=\u0022flex flex-wrap gap-2\u0022>
                      {selectedArtist.styles.map((style: string) => (
                        <button
                          key={style}
                          type=\u0022button\u0022
                          onClick={() => setSelectedStyle(style)}
                          className={\`px-4 py-2 border text-sm transition-all \${
                            selectedStyle === style 
                              ? \u0022bg-white text-black border-white font-bold\u0022 
                              : \u0022border-border-dark text-text-secondary hover:border-text-secondary\u0022
                          }\`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className=\u0022grid grid-cols-1 md:grid-cols-2 gap-4\u0022>
                  <div className=\u0022space-y-2\u0022>
                    <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>ตำแหน่ง (Placement) *</label>
                    <input 
                      type=\u0022text\u0022 
                      placeholder=\u0022เช่น ท้องแขน, น่อง, กลางหลัง\u0022 
                      className=\u0022input-raw w-full\u0022 
                      value={placement}
                      onChange={e => setPlacement(e.target.value)}
                    />
                  </div>
                  <div className=\u0022space-y-2\u0022>
                    <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>ขนาดโดยประมาณ (Size in CM) *</label>
                    <div className=\u0022flex items-center gap-2\u0022>
                      <input type=\u0022number\u0022 placeholder=\u0022กว้าง\u0022 className=\u0022input-raw w-full\u0022 value={sizeW} onChange={e => setSizeW(e.target.value)} />
                      <span className=\u0022text-text-secondary\u0022>x</span>
                      <input type=\u0022number\u0022 placeholder=\u0022ยาว\u0022 className=\u0022input-raw w-full\u0022 value={sizeH} onChange={e => setSizeH(e.target.value)} />
                      <span className=\u0022text-text-secondary text-xs\u0022>cm</span>
                    </div>
                  </div>
                </div>

                <div className=\u0022space-y-2\u0022>
                  <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>รูปตัวอย่าง (Reference Images)</label>
                  <div className=\u0022grid grid-cols-1 md:grid-cols-2 gap-4\u0022>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className=\u0022border border-border-dark border-dashed p-6 text-center cursor-pointer hover:bg-white/5 transition-colors\u0022
                    >
                      <UploadCloud className=\u0022mx-auto text-text-secondary mb-2\u0022 size={24} />
                      <p className=\u0022text-xs text-text-secondary\u0022>คลิกเพื่ออัปโหลดรูป (อัปได้หลายรูป)</p>
                      <input 
                        type=\u0022file\u0022 
                        ref={fileInputRef} 
                        className=\u0022hidden\u0022 
                        multiple 
                        accept=\u0022image/*\u0022 
                        onChange={e => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files);
                            setReferenceImages(prev => [...prev, ...newFiles]);
                            if (e.target) e.target.value = \u0022\u0022;
                          }
                        }}
                      />
                    </div>
                    {referenceImages.length > 0 && (
                      <div className=\u0022grid grid-cols-3 gap-2 h-fit\u0022>
                        {referenceImages.map((file, index) => (
                          <div key={index} className=\u0022relative aspect-square bg-border-dark rounded overflow-hidden\u0022>
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={\`preview-\${index}\`} 
                              className=\u0022object-cover w-full h-full\u0022
                            />
                            <button
                              type=\u0022button\u0022
                              onClick={(e) => {
                                e.stopPropagation();
                                setReferenceImages(prev => prev.filter((_, i) => i !== index));
                              }}
                              className=\u0022absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10 flex items-center justify-center\u0022
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className=\u0022space-y-2\u0022>
                  <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>รายละเอียดเพิ่มเติม (Notes)</label>
                  <textarea rows={3} className=\u0022input-raw w-full\u0022 placeholder=\u0022อธิบายรายละเอียดจุดที่ต้องการเน้น เช่น ขอเส้นบางๆ แรเงาจางๆ เป็นต้น\u0022 value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>
            </div>

            {/* STEP 3: Personal Info */}
            <div className={step === 3 ? \u0022block animate-fade-in\u0022 : \u0022hidden\u0022}>
              <h2 className=\u0022text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2\u0022>
                <span className=\u0022w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs\u0022>3</span> 
                ข้อมูลลูกค้า (PERSONAL INFO)
              </h2>

              <div className=\u0022space-y-6\u0022>
                <div className=\u0022grid grid-cols-1 md:grid-cols-2 gap-4\u0022>
                  <div className=\u0022space-y-2\u0022>
                    <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>ชื่อ-นามสกุล หรือ ชื่อเล่น (Name) *</label>
                    <input type=\u0022text\u0022 className=\u0022input-raw w-full\u0022 value={guestName} onChange={e => setGuestName(e.target.value)} />
                  </div>
                  <div className=\u0022space-y-2\u0022>
                    <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>เบอร์โทรศัพท์ (Phone) *</label>
                    <input type=\u0022tel\u0022 className=\u0022input-raw w-full\u0022 value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                  </div>
                </div>

                <div className=\u0022space-y-2\u0022>
                  <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>ช่องทางติดต่อสำรอง (Line ID / IG) - Optional</label>
                  <input type=\u0022text\u0022 className=\u0022input-raw w-full\u0022 value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                </div>

                <div className=\u0022space-y-2\u0022>
                  <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>ข้อมูลทางการแพทย์ (Medical Info) *</label>
                  <div className=\u0022input-raw p-3 text-xs text-text-secondary flex gap-2 items-start mb-2\u0022>
                    <Info className=\u0022shrink-0 text-white mt-0.5\u0022 size={14} />
                    <p>ระบุโรคประจำตัว โรคติดต่อทางเลือด หรือประวัติการแพ้ หากไม่มีให้พิมพ์ \u0022ไม่มี\u0022</p>
                  </div>
                  <textarea rows={2} className=\u0022input-raw w-full\u0022 placeholder=\u0022ไม่มี / แพ้ยา... / เป็นโรค...\u0022 value={medicalInfo} onChange={e => setMedicalInfo(e.target.value)} />
                </div>
                
                <div className=\u0022space-y-2\u0022>
                  <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>วันที่สะดวก (Preferred Date) - Optional</label>
                  <input 
                    type=\u0022date\u0022
                    min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split(\u0022T\u0022)[0]}
                    className=\u0022input-raw w-full [color-scheme:dark]\u0022
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                  />
                  <p className=\u0022text-xs text-text-secondary mt-1\u0022>* วันที่คิวว่างจริงจะขึ้นอยู่กับการตกลงกับช่างอีกครั้ง</p>
                </div>
              </div>
            </div>

            {/* STEP 4: Confirm & Payment */}
            <div className={step === 4 ? \u0022block animate-fade-in\u0022 : \u0022hidden\u0022}>
              <h2 className=\u0022text-lg font-gothic tracking-widest uppercase mb-6 flex items-center gap-2\u0022>
                <span className=\u0022w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm text-xs\u0022>4</span> 
                ชำระมัดจำ (DEPOSIT & CONFIRM)
              </h2>

              <div className=\u0022grid grid-cols-1 md:grid-cols-2 gap-8\u0022>
                {/* Summary */}
                <div className=\u0022space-y-4\u0022>
                  <h3 className=\u0022text-sm font-bold tracking-widest uppercase border-b border-border-dark pb-2\u0022>สรุปข้อมูล (Summary)</h3>
                  
                  <div className=\u0022space-y-3 text-sm\u0022>
                    <div className=\u0022flex justify-between border-b border-white/5 pb-2\u0022>
                      <span className=\u0022text-text-secondary\u0022>ช่างสัก:</span>
                      <span className=\u0022font-bold\u0022>{selectedArtist?.name}</span>
                    </div>
                    <div className=\u0022flex justify-between border-b border-white/5 pb-2\u0022>
                      <span className=\u0022text-text-secondary\u0022>สไตล์/ตำแหน่ง:</span>
                      <span className=\u0022text-right\u0022>{selectedStyle} / {placement}</span>
                    </div>
                    <div className=\u0022flex justify-between border-b border-white/5 pb-2\u0022>
                      <span className=\u0022text-text-secondary\u0022>ขนาด:</span>
                      <span>{sizeW} x {sizeH} cm</span>
                    </div>
                    <div className=\u0022flex justify-between border-b border-white/5 pb-2\u0022>
                      <span className=\u0022text-text-secondary\u0022>ชื่อ/เบอร์โทร:</span>
                      <span className=\u0022text-right\u0022>{guestName} ({guestPhone})</span>
                    </div>
                    {preferredDate && (
                      <div className=\u0022flex justify-between border-b border-white/5 pb-2\u0022>
                        <span className=\u0022text-text-secondary\u0022>วันที่สะดวก:</span>
                        <span>{new Date(preferredDate).toLocaleDateString(\u0022th-TH\u0022)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment */}
                <div className=\u0022space-y-4\u0022>
                  {(() => {
                    const paymentArtist = artists.find(a => a.name.includes(\u0022บอม\u0022)) || selectedArtist;
                    return (
                      <div className=\u0022bg-background-dark/80 border border-border-dark p-6 text-center space-y-4\u0022>
                        <div>
                          <p className=\u0022text-sm font-bold uppercase tracking-widest text-green-400\u0022>มัดจำ 500 บาท</p>
                          <p className=\u0022text-xs text-text-secondary mt-1\u0022>เพื่อล็อกคิวและเริ่มออกแบบลาย (Deposit)</p>
                        </div>
                        
                        {paymentArtist?.qr_code_url ? (
                          <div className=\u0022bg-white p-3 inline-block mx-auto\u0022>
                            <img src={paymentArtist.qr_code_url} alt=\u0022QR Code\u0022 className=\u0022w-40 h-40 object-contain\u0022 />
                          </div>
                        ) : (
                          <div className=\u0022w-40 h-40 mx-auto bg-black border border-border-dark flex items-center justify-center text-xs text-text-secondary\u0022>
                            ไม่มี QR Code
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className=\u0022space-y-2\u0022>
                    <label className=\u0022block text-xs uppercase tracking-wider text-text-secondary\u0022>แนบสลิปโอนเงิน *</label>
                    <div 
                      onClick={() => slipInputRef.current?.click()}
                      className={\`border p-4 text-center cursor-pointer transition-colors \${slipImage ? \u0022border-green-500/50 bg-green-500/5\u0022 : \u0022border-border-dark border-dashed hover:bg-white/5\u0022}\`}
                    >
                      <p className={\`text-xs \${slipImage ? \u0022text-green-400 font-bold\u0022 : \u0022text-text-secondary\u0022}\`}>
                        {slipImage ? \`อัปโหลดแล้ว: \${slipImage.name}\` : \u0022คลิกเพื่ออัปโหลดสลิป\u0022}
                      </p>
                      <input 
                        type=\u0022file\u0022 
                        ref={slipInputRef} 
                        className=\u0022hidden\u0022 
                        accept=\u0022image/*\u0022 
                        onChange={e => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSlipImage(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className=\u0022mt-10 pt-6 border-t border-border-dark flex gap-4\u0022>
              {step > 1 && (
                <button 
                  type=\u0022button\u0022 
                  onClick={prevStep}
                  className=\u0022px-6 py-4 border border-border-dark flex items-center gap-2 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors\u0022
                >
                  <ChevronLeft size={18} /> ย้อนกลับ
                </button>
              )}
              
              {step < totalSteps ? (
                <button 
                  type=\u0022button\u0022 
                  onClick={nextStep}
                  className=\u0022flex-1 bg-white text-black font-bold py-4 text-sm uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-accent-silver transition-all\u0022
                >
                  ถัดไป <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  type=\u0022submit\u0022 
                  disabled={isSubmitting}
                  className=\u0022flex-1 bg-white text-black font-bold py-4 text-sm uppercase tracking-widest hover:bg-accent-silver transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]\u0022
                >
                  {isSubmitting ? \u0022กำลังส่งข้อมูล...\u0022 : \u0022ยืนยันการจองคิว (SUBMIT)\u0022}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
\`;

fs.writeFileSync("src/app/booking/page.tsx", code);

