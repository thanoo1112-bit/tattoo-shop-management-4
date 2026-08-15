import PublicPortfolio from "@/components/public/PublicPortfolio";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "ผลงานทั้งหมด (Portfolio) | 157 TATTOO",
  description: "รวมผลงานสักทั้งหมดจากช่างสักของเรา",
};

export default function PortfolioPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background-dark">
      {/* Navbar อย่างง่ายสำหรับหน้า Portfolio */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-sm border-b border-border-dark py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium tracking-widest uppercase">กลับหน้าแรก</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 group">
          <h1 className="text-lg md:text-xl font-gothic tracking-widest text-text-primary drop-shadow-md">
            157 TATTOO
          </h1>
        </Link>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </header>
      
      <div className="pt-8">
        <PublicPortfolio />
      </div>
    </main>
  );
}
