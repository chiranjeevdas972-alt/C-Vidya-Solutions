import { useState, useEffect } from "react";
import { Sparkles, Building2, Eye } from "lucide-react";

export default function SkyscraperMockup() {
  const [reflectionX, setReflectionX] = useState(0);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);

  // Simple automated sliding light-reflection on glass effect
  useEffect(() => {
    const interval = setInterval(() => {
      setReflectionX((prev) => (prev > 160 ? -60 : prev + 1.5));
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-brand-navy-900/10 group bg-slate-950">
      
      {/* Background gradient night/twilight sky */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-800 via-brand-navy-900 to-indigo-950 z-0">
        {/* Sky stars representation */}
        <div className="absolute inset-4 opacity-30 grid grid-cols-6 grid-rows-6 gap-2">
          {Array.from({ length: 36 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 bg-white rounded-full ${i % 3 === 0 ? 'animate-pulse' : ''}`}
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        {/* Distant skyline gold outline background vector */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 opacity-30 bg-[linear-gradient(90deg,transparent_10%,#d69e2e_11%,#d69e2e_13%,transparent_14%,transparent_20%,#d69e2e_21%,#d69e2e_25%,transparent_26%),linear-gradient(t,transparent,rgba(0,0,0,0.8))] select-none" />
      </div>

      {/* Skyscraper Shape */}
      <div className="absolute bottom-0 right-4 sm:right-10 left-4 sm:left-10 top-8 bg-gradient-to-b from-brand-navy-900/90 to-brand-navy-950/95 border-x border-t border-brand-gold-500/20 rounded-t-2xl overflow-hidden z-10 flex flex-col justify-between">
        
        {/* Glass panes matrix decoration */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-16 gap-[2px] p-4 opacity-80 pointer-events-none select-none">
          {Array.from({ length: 192 }).map((_, i) => {
            const isLit = (i % 17 === 0 && i > 30) || activeWindow === i;
            return (
              <div 
                key={i} 
                className={`transition-all duration-700 rounded-[1px] ${
                  isLit 
                    ? "bg-brand-gold-400/40 shadow-[0_0_8px_rgba(244,207,92,0.6)] border border-brand-gold-300/50" 
                    : "bg-brand-navy-800/40 border border-brand-navy-700/20"
                }`}
              />
            );
          })}
        </div>

        {/* Diagonal moving reflections shimmer */}
        <div 
          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-80 pointer-events-none"
          style={{ transform: `translateX(${reflectionX}%)`, transition: 'none' }}
        />

        {/* Corporate Golden Plaque Imprinted on Skyscraper Glass */}
        <div className="absolute inset-x-0 top-1/4 flex flex-col items-center justify-center p-6 z-20 pointer-events-auto bg-brand-navy-950/70 py-10 border-y border-brand-gold-500/10 backdrop-blur-sm text-center">
          
          {/* Logo Emblem Symbol in Gold */}
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center bg-gradient-to-b from-brand-gold-200 to-brand-gold-500 p-0.5 rounded-full shadow-[0_0_30px_rgba(214,158,46,0.3)] border border-brand-gold-400 animate-pulse-slow">
            <div className="w-full h-full bg-brand-navy-950 rounded-full flex items-center justify-center">
              {/* Gold book/architecture vector mockup */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 fill-brand-gold-400">
                <path d="M20,25 C20,25 45,15 50,22 C55,15 80,25 80,25 L80,75 C80,75 55,65 50,70 C45,65 20,75 20,75 Z" className="opacity-45" />
                <path d="M50,22 L50,70" stroke="#f4cf5c" strokeWidth="2" />
                {/* Rising pillars of software graph inside the book */}
                <rect x="32" y="48" width="6" height="15" rx="1" fill="#f4cf5c" />
                <rect x="42" y="38" width="6" height="25" rx="1" fill="#f4cf5c" />
                <rect x="52" y="34" width="6" height="29" rx="1" fill="#f4cf5c" />
                <rect x="62" y="44" width="6" height="19" rx="1" fill="#f4cf5c" />
              </svg>
            </div>
            {/* Shimmer light */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full skew-x-12 animate-shimmer" />
          </div>

          <h2 className="font-display font-extrabold text-2xl tracking-widest text-[#f5d77f] drop-shadow-md">
            C VIDYA
          </h2>
          <div className="text-xs font-mono font-bold tracking-widest text-brand-gold-300 uppercase">
            S O L U T I O N
          </div>
          
          <div className="mt-3 text-[10px] font-mono bg-brand-gold-500/10 text-brand-gold-400 py-1 px-2.5 rounded-full border border-brand-gold-500/20 backdrop-blur-md">
            Headquarters Dhanbad
          </div>
        </div>

        {/* Floating status metadata to appear premium and responsive */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end font-mono text-[10px] text-brand-gold-200 bg-brand-navy-950/80 p-3.5 rounded-xl border border-brand-gold-500/10 backdrop-blur-md">
          <div className="space-y-1">
            <div className="text-gray-400">BUILDING SCHEMATIC</div>
            <div className="flex items-center gap-1.5 font-bold">
              <Building2 className="w-3.5 h-3.5 text-brand-gold-400" />
              <span>Block C-1, Vidya Tower</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveWindow(Math.floor(Math.random() * 190))}
            className="flex items-center gap-1 px-2 py-1.5 bg-brand-gold-500/20 hover:bg-brand-gold-500/40 text-brand-gold-300 rounded-md border border-brand-gold-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-brand-gold-400 animate-spin" />
            <span>Illuminate</span>
          </button>
        </div>

        {/* Subtle decorative grid borders */}
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-gold-500 z-20" />
      </div>

      {/* Decorative Golden circular wave line overlays matching Image 1 aesthetics */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-brand-gold-500/30 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-brand-gold-500/10 pointer-events-none" />
      
      {/* Immovable hover frame overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/40 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity z-15 pointer-events-none" />
    </div>
  );
}
