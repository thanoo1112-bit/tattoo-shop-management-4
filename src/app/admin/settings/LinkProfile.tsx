"use client";

import { useState } from "react";
import { linkArtistProfile } from "./linkActions";

export default function LinkProfile({ artists }: { artists: any[] }) {
  const [isLinking, setIsLinking] = useState(false);

  const handleLink = async (artistId: string) => {
    setIsLinking(true);
    const result = await linkArtistProfile(artistId);
    if (result.error) {
      alert("Error linking profile: " + result.error);
      setIsLinking(false);
    }
  };

  return (
    <div className="raw-panel p-6 border border-yellow-500/30 bg-yellow-500/5 max-w-2xl">
      <h3 className="text-yellow-400 font-bold mb-2">บัญชีของคุณยังไม่ได้ผูกกับชื่อช่างในระบบ</h3>
      <p className="text-sm text-text-secondary mb-6">
        เพื่อความสะดวก (ไม่ต้องไปทำในฐานข้อมูลเอง) กรุณาเลือกชื่อของคุณจากรายชื่อช่างด้านล่าง เพื่อผูกบัญชีนี้เข้ากับข้อมูลช่างครับ
      </p>

      <div className="space-y-3">
        {artists.map(artist => (
          <div key={artist.id} className="flex items-center justify-between p-4 border border-border-dark bg-black/40 hover:bg-white/5 transition-colors">
            <div>
              <p className="font-bold">{artist.name}</p>
              <p className="text-xs text-text-secondary">{artist.style}</p>
            </div>
            <button 
              onClick={() => handleLink(artist.id)}
              disabled={isLinking}
              className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent-silver disabled:opacity-50"
            >
              {isLinking ? "กำลังผูกบัญชี..." : "เลือกคนนี้ (Link)"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
