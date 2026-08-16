"use client";

import { Calendar, Image as ImageIcon, CreditCard, CheckCircle } from "lucide-react";

export default function BookingStepsSection() {
  const steps = [
    {
      id: "01",
      icon: <Calendar className="w-8 h-8 md:w-12 md:h-12 text-accent-silver" />,
      title: "เลือกช่างและเวลา",
      description: "เลือกช่างสักที่คุณชื่นชอบ และระบุวันเวลาที่สะดวกผ่านระบบปฏิทิน",
    },
    {
      id: "02",
      icon: <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-accent-silver" />,
      title: "แนบ Reference",
      description: "อัปโหลดภาพตัวอย่าง ระบุตำแหน่ง ขนาด และอธิบายไอเดียของคุณ",
    },
    {
      id: "03",
      icon: <CreditCard className="w-8 h-8 md:w-12 md:h-12 text-accent-silver" />,
      title: "โอนมัดจำ",
      description: "โอนเงินมัดจำเพื่อยืนยันคิวผ่านบัญชีทางการของสตูดิโอ",
    },
    {
      id: "04",
      icon: <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-accent-silver" />,
      title: "รออนุมัติคิว",
      description: "ช่างสักตรวจแบบและอนุมัติคิว คุณจะได้รับแจ้งเตือนทันที",
    },
  ];

  return (
    <section id="booking-steps" className="py-16 md:py-24 px-4 md:px-12 bg-background-dark relative z-10 border-b border-border-dark overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h3 className="text-3xl md:text-5xl font-gothic mb-4 text-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] uppercase tracking-widest">
            4 Steps Booking
          </h3>
          <p className="text-text-secondary uppercase tracking-[0.2em] text-xs md:text-sm">ขั้นตอนการจองคิวง่ายๆ</p>
        </div>

        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-border-dark/50 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <div key={step.id} className="relative group p-6 rounded-xl border border-neutral-700 bg-black/40 backdrop-blur-md hover:bg-neutral-900 transition-all duration-300 text-center overflow-hidden">
                
                {/* Background Number */}
                <div className="absolute -bottom-4 -right-4 text-8xl md:text-9xl font-gothic font-black text-white/[0.03] pointer-events-none group-hover:text-white/[0.05] transition-colors duration-300">
                  {step.id}
                </div>

                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 flex items-center justify-center bg-background-dark border border-neutral-700 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)] group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300">
                  {step.icon}
                </div>
                
                <h4 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest mb-3">
                  <span className="text-accent-silver mr-2">{step.id}.</span>{step.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
