import Link from "next/link";
import { ArrowLeft, LogIn } from "lucide-react";
import { login } from "./actions";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-smoke px-4 relative overflow-hidden">
      {/* Background Overlays */}
      <div className="absolute inset-0 bg-background-dark/80"></div>
      
      {/* Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-white transition-colors z-20 text-sm tracking-widest uppercase"
      >
        <ArrowLeft size={16} /> กลับหน้าหลัก
      </Link>

      {/* Login Card */}
      <div className="raw-panel p-8 md:p-12 w-full max-w-md z-10 animate-fade-in relative">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="157 Logo" 
            className="w-24 h-auto opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4" 
          />
          <h1 className="text-2xl font-gothic tracking-widest uppercase text-center">เข้าสู่ระบบ (Sign In)</h1>
          <p className="text-sm text-text-secondary mt-2 text-center">สำหรับช่างสักและผู้ดูแลระบบเท่านั้น</p>
        </div>

        <form className="space-y-6" action={login}>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-text-secondary">อีเมล (Email)</label>
            <input 
              name="email"
              type="email" 
              placeholder="artist@157tattoo.com" 
              className="input-raw w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-text-secondary">รหัสผ่าน (Password)</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              className="input-raw w-full"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-accent-silver transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] mt-8"
          >
            <LogIn size={18} /> ล็อกอินเข้าสู่ระบบ
          </button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-red-500/10 text-red-400 text-center text-sm border border-red-500/20">
              {searchParams.message}
            </p>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-border-dark text-center">
          <p className="text-xs text-text-secondary/50">
            Secure Authentication via Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
