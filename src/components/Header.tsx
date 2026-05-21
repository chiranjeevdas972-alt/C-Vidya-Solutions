import { useState } from "react";
import { Phone, Mail, MapPin, Menu, X, Bot, ArrowRight } from "lucide-react";

interface HeaderProps {
  onOpenAssistant: () => void;
}

export default function Header({ onOpenAssistant }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phoneNum = "8987766981";
  const emailAddr = "cvidya32@gmail.com";
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
                <span>{officerEmail} (Officer)</span>
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
            <div className="relative w-10 h-10 flex items-center justify-center bg-radial from-brand-gold-100 to-brand-gold-300 rounded-full border border-brand-gold-500 shadow-sm group-hover:scale-105 transition-all">
              {/* Gold abstract book emblem icon overlay */}
              <div className="w-5 h-5 border-y-2 border-brand-gold-800 rounded-xs transform rotate-12 flex flex-col justify-between p-[2px]">
                <div className="h-[2px] bg-brand-gold-800 w-full" />
                <div className="h-[2px] bg-brand-gold-800 w-2/3" />
              </div>
              <div className="absolute inset-0 bg-brand-gold-500/10 rounded-full animate-ping group-hover:block hidden" />
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-wider text-brand-navy-900 group-hover:text-brand-gold-700 transition-colors">
                C VIDYA
              </div>
              <div className="text-[10px] font-mono tracking-widest text-brand-gold-600 font-bold -mt-0.5">
                SOLUTION
              </div>
            </div>
          </a>

          {/* Desktop Navigation Link Anchors */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-brand-navy-800">
            <a href="#about" className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all">
              About Us
            </a>
            <a href="#mission" className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all">
              Our Mission
            </a>
            <a href="#services" className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all">
              Integrated Suite
            </a>
            <a href="#contact" className="hover:text-brand-gold-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-gold-500 after:transition-all">
              Inquire Demo
            </a>
          </nav>

          {/* Action Call to Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="ai-assistant-shortcut"
              onClick={onOpenAssistant}
              className="flex items-center gap-2 px-4 py-2 bg-brand-navy-50 text-brand-navy-700 hover:bg-brand-navy-100 text-xs font-bold rounded-lg border border-brand-navy-200 transition-all active:scale-95"
            >
              <Bot className="w-4 h-4 text-brand-gold-600 animate-pulse" />
              <span>Ask Vidya AI</span>
            </button>
            <a
              id="header-cta-demo"
              href="#contact"
              className="group flex items-center gap-1.5 px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <span>Request Callback</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

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
            <nav className="flex flex-col gap-3 font-semibold text-brand-navy-800">
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600"
              >
                About Us
              </a>
              <a 
                href="#mission" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600"
              >
                Our Mission
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600"
              >
                Integrated Suite (01-08)
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-brand-gold-600"
              >
                Contact & Demo request
              </a>
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
              <p>✉️ {officerEmail} (Officer)</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
