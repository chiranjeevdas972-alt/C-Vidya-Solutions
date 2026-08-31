import { Phone, Mail, MapPin, Youtube, Facebook, Instagram, Twitter, Linkedin, ArrowUp } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#071739] text-slate-300 pt-16 pb-12 relative border-t-2 border-blue-600 selection:bg-blue-600 selection:text-white">
      
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-48 opacity-10 bg-radial from-blue-400 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-b border-slate-800 pb-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size={46} showText={false} className="shrink-0" />
              <div>
                <h4 className="font-display font-bold text-xl tracking-tight text-white">C VIDYA</h4>
                <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold -mt-0.5">
                  SOLUTIONS
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              &ldquo;Architecting the future of enterprise logic. Delivering data-driven software suites, autonomous AI agents, and institutional cloud modernization with uncompromising technical precision.&rdquo;
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.youtube.com/@cvidyasolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61591206215743" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/cvidyasolutions/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/CVidyaSolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/cvidyasolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Solutions Directory */}
          <div className="md:col-span-3 space-y-3.5">
            <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              SOLUTIONS DIRECTORY
            </h5>
            <div className="grid grid-cols-1 gap-2 text-xs text-slate-300">
              <button 
                type="button" 
                onClick={() => onNavigate("services")}
                className="hover:text-blue-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Library Automation SaaS
              </button>
              <button 
                type="button" 
                onClick={() => onNavigate("services")}
                className="hover:text-blue-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Fitness Zone Management
              </button>
              <button 
                type="button" 
                onClick={() => onNavigate("services")}
                className="hover:text-blue-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Institutes &amp; Coaching Portals
              </button>
              <button 
                type="button" 
                onClick={() => onNavigate("services")}
                className="hover:text-blue-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Agrifusion Agribusiness
              </button>
              <button 
                type="button" 
                onClick={() => onNavigate("services")}
                className="hover:text-blue-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Autonomous AI Agent Suite
              </button>
              <button 
                type="button" 
                onClick={() => onNavigate("services")}
                className="hover:text-blue-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Enterprise CRM &amp; Analytics
              </button>
            </div>
          </div>

          {/* Column 3: Regional Offices */}
          <div className="md:col-span-4 space-y-3.5">
            <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              REGIONAL OFFICES
            </h5>
            <div className="text-xs space-y-3 text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="flex flex-col gap-1 w-full">
                  <span><strong>HQ:</strong> Surunga, Baliapur, Dhanbad, Jharkhand - 828115</span>
                  <span className="border-t border-slate-800 pt-1">
                    <strong>R&amp;D Center:</strong> STPI Desk, BIT Sindri Campus, Dhanbad
                  </span>
                </span>
              </div>
              
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="flex flex-col gap-0.5">
                  <a href="mailto:cvidyasolutions@gmail.com" className="hover:text-blue-400 transition-colors">
                    cvidyasolutions@gmail.com
                  </a>
                  <a href="mailto:chiranjeev0058@gmail.com" className="hover:text-blue-400 transition-colors text-[11px] text-slate-500">
                    Founder: chiranjeev0058@gmail.com
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+919288517027" className="hover:text-blue-400 transition-colors font-medium">
                  +91 92885 17027
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Compliance Strip */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 font-mono text-[11px]">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
            <span>© 2026 C Vidya Solutions. All rights reserved.</span>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("privacy")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("terms")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("billing")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Billing
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("refund")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Refund Policy
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("cookies")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Cookies
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("disclaimer")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Disclaimer
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onNavigate("portability")}
              className="text-slate-300 hover:text-blue-400 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Data Erasure
            </button>
          </div>

          <button 
            type="button" 
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-300 hover:text-blue-400 transition-colors uppercase font-mono text-[11px] cursor-pointer bg-transparent border-none"
          >
            <span>Scroll to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
