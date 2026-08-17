"use client";

import { ShieldCheck, Droplet, Stethoscope } from "lucide-react";

export default function HygieneStandardsSection() {
  const standards = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-white" />,
      title: "เข็มใหม่แกะกล่อง 100%",
      desc: "Single-use Sterilized Needles",
    },
    {
      icon: <Droplet className="w-10 h-10 text-white" />,
      title: "สีสักเกรดนำเข้าพรีเมียม",
      desc: "Premium USA/EU Imported Ink",
    },
    {
      icon: <Stethoscope className="w-10 h-10 text-white" />,
      title: "ฆ่าเชื้อระดับการแพทย์",
      desc: "Medical Grade Sterilization",
    },
  ];

  return (
    <section id="hygiene" className="py-16 md:py-24 px-4 md:px-12 bg-background-dark relative z-10 border-b border-border-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-3xl md:text-5xl font-gothic mb-4 text-white uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Studio Hygiene
          </h3>
          <p className="text-text-secondary uppercase tracking-[0.2em] text-xs md:text-sm">
            มาตรฐานความสะอาดและสิ่งแวดล้อม
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {standards.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors shadow-lg group">
              <div className="w-20 h-20 mb-6 bg-black rounded-full flex items-center justify-center border border-border-dark group-hover:bg-white/5 transition-colors">
                {item.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-text-secondary uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Atmosphere Gallery Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-black border border-neutral-800 rounded-xl overflow-hidden relative group shadow-lg flex flex-col items-center justify-center text-neutral-600">
              <div className="absolute inset-0 bg-neutral-900 opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[10px] uppercase tracking-widest font-gothic">รูปบรรยากาศร้าน {i}</p>
              </div>

              {/* Overlay shadow for gothic look */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
              <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none z-30"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
