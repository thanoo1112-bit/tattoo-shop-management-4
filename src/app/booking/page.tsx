"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Calendar as CalendarIcon, Info } from "lucide-react";

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Booking request submitted successfully! An artist will review your request.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark bg-flash-wall py-8 md:py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Dark overlay for the whole page to make the flash wall faint */}
      <div className="absolute inset-0 bg-background-dark/95 pointer-events-none z-0"></div>

      {/* Subtle ambient light */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6 md:mb-8 text-sm md:text-base">
          <ArrowLeft size={20} /> กลับสู่หน้าหลัก (Back to Home)
        </Link>
        
        <div className="raw-panel rounded-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-gothic text-text-primary drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] mb-3 md:mb-2">
            REQUEST APPOINTMENT
          </h1>
          <p className="text-sm md:text-base text-text-secondary mb-8 md:mb-10 border-b border-border-dark pb-6">
            กรอกฟอร์มด้านล่างเพื่อ Request คิวสัก ช่างของเราจะประเมินจากแบบ ตำแหน่ง และขนาดเพื่อคำนวณราคา (Estimated Price)
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            
            {/* Artist Selection */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider">
                เลือกช่างสัก (Select Artist)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {['Artist 1', 'Artist 2', 'Artist 3'].map((artist, idx) => (
                  <label key={idx} className="cursor-pointer">
                    <input type="radio" name="artist" value={`artist_${idx+1}`} className="peer sr-only" required />
                    <div className="p-3 md:p-4 border border-border-dark rounded-sm text-center peer-checked:border-text-primary peer-checked:bg-white/5 peer-checked:text-text-primary text-text-secondary hover:border-text-primary transition-all text-sm md:text-base bg-background-dark/50">
                      {artist}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Design & Placement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3 md:space-y-4">
                <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider">
                  ตำแหน่งที่จะสัก (Body Placement)
                </label>
                <input 
                  type="text" 
                  placeholder="เช่น แขนซ้าย (Left Forearm)"
                  className="w-full input-raw rounded-sm px-4 py-3 text-sm md:text-base text-text-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-3 md:space-y-4">
                <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider">
                  ขนาดโดยประมาณ (Size in CM)
                </label>
                <div className="flex gap-2 sm:gap-4">
                  <div className="relative flex-1">
                    <input type="number" placeholder="กว้าง (Width)" className="w-full input-raw rounded-sm px-3 md:px-4 py-3 text-sm md:text-base text-text-primary focus:outline-none" required min="1" />
                    <span className="absolute right-2 md:right-3 top-3 text-text-secondary text-xs md:text-sm">cm</span>
                  </div>
                  <div className="flex items-center text-text-secondary text-sm">x</div>
                  <div className="relative flex-1">
                    <input type="number" placeholder="ยาว (Height)" className="w-full input-raw rounded-sm px-3 md:px-4 py-3 text-sm md:text-base text-text-primary focus:outline-none" required min="1" />
                    <span className="absolute right-2 md:right-3 top-3 text-text-secondary text-xs md:text-sm">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Image */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span>รูป Reference (Reference Images)</span>
                <span className="text-xs text-text-secondary normal-case font-normal">(อัปโหลดได้สูงสุด 3 รูป)</span>
              </label>
              <div className="border border-border-dark input-raw rounded-sm p-6 md:p-8 text-center hover:bg-white/5 hover:border-white/50 transition-all cursor-pointer group">
                <UploadCloud className="mx-auto text-text-secondary group-hover:text-white transition-colors mb-3 md:mb-4" size={32} />
                <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                <p className="text-xs text-text-secondary mt-1">PNG, JPG ขนาดไม่เกิน 5MB</p>
                <input type="file" className="hidden" multiple accept="image/*" />
              </div>
            </div>

            {/* Medical Info */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider">
                ข้อมูลทางการแพทย์ (Medical Info & Allergies)
              </label>
              <div className="input-raw rounded-sm p-3 md:p-4 text-xs md:text-sm text-text-secondary flex gap-3 mb-2 items-start">
                <Info className="shrink-0 text-white mt-0.5" size={18} />
                <p>เพื่อความปลอดภัย กรุณาระบุโรคประจำตัว โรคติดต่อทางเลือด หรือประวัติการแพ้ (เช่น แพ้สีหมึก, แพ้ยางลาเท็กซ์)</p>
              </div>
              <textarea 
                rows={3}
                placeholder="ระบุ 'ไม่มี' (None) หากไม่มีประวัติการแพ้หรือโรคประจำตัว"
                className="w-full input-raw rounded-sm px-4 py-3 text-sm md:text-base text-text-primary focus:outline-none resize-none"
                required
              />
            </div>

            {/* Preferred Date */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider">
                วันที่สะดวก (Preferred Date - Optional)
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-3 text-text-secondary" size={20} />
                <input 
                  type="date"
                  className="w-full input-raw rounded-sm pl-12 pr-4 py-3 text-sm md:text-base text-text-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-xs md:text-sm font-medium text-text-primary uppercase tracking-wider">
                รายละเอียดเพิ่มเติม (Additional Notes)
              </label>
              <textarea 
                rows={4}
                placeholder="ระบุความหมายของรอยสัก สไตล์ที่ชอบ หรือความต้องการพิเศษเพิ่มเติม..."
                className="w-full input-raw rounded-sm px-4 py-3 text-sm md:text-base text-text-primary focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 md:pt-6 mt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-text-primary text-background-dark font-bold py-3 md:py-4 text-sm md:text-base rounded-sm hover:bg-text-secondary transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6 shadow-[0_5px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_5px_20px_rgba(255,255,255,0.2)]"
              >
                {isSubmitting ? (
                  <span className="animate-pulse tracking-wider">กำลังส่งข้อมูล (SUBMITTING)...</span>
                ) : (
                  <span className="tracking-wider">ยืนยันการจองคิว (SUBMIT REQUEST)</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
