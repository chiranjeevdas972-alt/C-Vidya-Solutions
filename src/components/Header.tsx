import { useState } from "react";
import { Phone, Mail, MapPin, Menu, X, Bot, ArrowRight } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  onOpenAssistant: () => void;
  onOpenHub: (tab: "home" | "about" | "services" | "portfolio" | "contact" | "careers" | "blog") => void;
}

export default function Header({ onOpenAssistant, onOpenHub }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phoneNum = "8987766981";
  const emailAddr = "cvidyasolutions@gmail.com";
  const officerEmail = "chiranjeev0058@gmail.com";
  const locationText = "Dhanbad, Jharkhand";

  return (
    <div className="sticky top-0 z-50 w-full shadow-sm">
      {/* Top Banner Contact Row */}
      <div id="top-bar" className="bg-brand-navy-900 border-b border-brand-gold-500/20 text-xs text-brand-gold-100 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-mono">
          <div className="flex items-center gap-6">
            <a href={`tel:${phoneNum}`} className="flex items-center gap-1.5 hover:text-brand-gold-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-gold-400" />
              <span>{phoneNum}</span>
            </a>
            <a href={`mailto:${emailAddr}`} className="flex items-center gap-1.5 hover:text-brand-gold-300 transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-gold-400" />
                <span>{emailAddr}</span>
            </a>
            <a href={`mailto:${officerEmail}`} className="flex items-center gap-1.5 hover:text-brand-gold-300 transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-gold-400" />
                <span>{officerEmail} (Director/Founder: Chiranjeev Das)</span>
            </a>
            <div className="flex flex-col xl:flex-row xl:items-center gap-1.5 xl:gap-4 text-brand-gold-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-gold-400 shrink-0" />
                <span>HQ: Surunga, Baliapur, Dhanbad - 828115</span>
              </div>
              <div className="flex items-center gap-1.5 border-l border-brand-gold-500/20 xl:pl-4">
                <MapPin className="w-3.5 h-3.5 text-brand-gold-400 shrink-0" />
                <span>Branch: STPI Sindri, BIT Sindri Campus</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">ESTD: 2025</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header id="main-nav" className="bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Logo Brand Emblem */}
          <a href="#hero" className="flex items-center gap-3 group">
            <Logo size={54} showText={false} className="group-hover:scale-105 transition-all shrink-0" />
            <div>
              <div className="font-display font-bold text-xl md:text-2xl tracking-wider text-brand-navy-900 group-hover:text-brand-gold-700 transition-colors">
                C VIDYA
              </div>
              <div className="text-xs font-mono tracking-widest text-brand-gold-600 font-bold -mt-0.5">
                SOLUTION
              </div>
            </div>
          </a>

          {/* Desktop Navigation Link Anchors */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-brand-navy-900">
            <button 
              onClick={() => onOpenHub("home")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold text-brand-navy-900"
            >
              Home
            </button>
            <button 
              onClick={() => onOpenHub("about")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold text-brand-navy-900"
            >
              About
            </button>
            <button 
              onClick={() => onOpenHub("services")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold"
            >
              Services
            </button>
            <button 
              onClick={() => onOpenHub("portfolio")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold"
            >
              Portfolio / Case Studies
            </button>
            <button 
              onClick={() => onOpenHub("contact")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold"
            >
              Contact with Us
            </button>
            <button 
              onClick={() => onOpenHub("careers")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold"
            >
              Careers
            </button>
            <button 
              onClick={() => onOpenHub("blog")}
              className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all cursor-pointer bg-transparent border-none font-bold"
            >
              Blog
            </button>
          </nav>



          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenAssistant}
              className="p-2 hover:bg-slate-100 rounded-full text-brand-navy-800"
              title="Ask AI Advisor"
            >
              <Bot className="w-5 h-5 text-brand-gold-600" />
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-full text-brand-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Panel */}
        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col gap-2 font-semibold text-brand-navy-800">
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("home"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold bg-transparent border-none"
              >
                Home Overview
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("about"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold bg-transparent border-none"
              >
                About Us
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("services"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold bg-transparent border-none"
              >
                Services Suite
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("portfolio"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold"
              >
                Portfolio / Case Studies
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("contact"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold"
              >
                Contact with Us
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("careers"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold"
              >
                Careers
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenHub("blog"); }}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600 cursor-pointer text-sm font-semibold"
              >
                Blog
              </button>
            </nav>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-navy-900 text-white rounded-lg font-bold text-sm tracking-wide"
              >
                <Bot className="w-4 h-4 text-brand-gold-400" />
                <span>Talk with Vidya AI Advisor</span>
              </button>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-block text-center py-3 bg-brand-gold-500 hover:bg-brand-gold-600 text-white rounded-lg font-bold text-sm shadow-sm"
              >
                Request Callback Demos
              </a>
            </div>
            
            {/* Quick Contact info */}
            <div className="pt-4 text-center text-xs text-slate-500 space-y-1">
              <p>📍 HQ: Surunga, Baliapur, Dhanbad, Jharkhand</p>
              <p>📍 Branch: STPI Sindri, BIT Sindri Campus</p>
              <p>📞 Phone: {phoneNum}</p>
              <p>✉️ {emailAddr}</p>
              <p>✉️ {officerEmail} (Director/Founder: Chiranjeev Das)</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
