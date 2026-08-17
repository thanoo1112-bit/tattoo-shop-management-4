import { redirect } from "next/navigation";
import { Image } from "lucide-react";
import Link from "next/link";

export default function ArtistIndexPage() {
  redirect("/artist/dashboard");
}

          <Link href="/artist/portfolio" className="raw-panel p-6 text-center hover:bg-white/5 transition-colors group">
            <div className="w-12 h-12 rounded-full border border-border-dark flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Image size={24} className="text-text-secondary" />
            </div>
            <h3 className="font-bold tracking-widest uppercase mb-1">Portfolio</h3>
            <p className="text-xs text-text-secondary">อัปโหลดและจัดการรูปผลงาน</p>
          </Link>
