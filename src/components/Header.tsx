import React, { useState } from "react";
import { Phone, Mail, Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  activePage?: string;
  onOpenAssistant: () => void;
  onOpenHub: (path: string) => void;
  onOpenConsultation?: () => void;
  onOpenArchitecture?: () => void;
}

export default function Header({ 
  activePage = "home", 
  onOpenAssistant: _onOpenAssistant, 
  onOpenHub, 
  onOpenConsultation,
  onOpenArchitecture: _onOpenArchitecture 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", path: "/", label: "Home" },
    { id: "about", path: "/about/", label: "About" },
    { id: "software", path: "/software/", label: "Software" },
    { id: "ai-agents", path: "/ai-agents/", label: "AI Agents" },
    { id: "services", path: "/services/", label: "Services" },
    { id: "pricing", path: "/pricing/", label: "Pricing" },
    { id: "portfolio", path: "/portfolio/", label: "Portfolio" },
    { id: "blog", path: "/blog/", label: "Blog" },
    { id: "contact", path: "/contact/", label: "Contact Us" }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onOpenHub(path);
  };

  return (
    <div className="sticky top-0 z-50 w-full shadow-xs bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      
      {/* Top Banner (Corporate bar with phone on left, email shifted to right) */}
      <div id="top-bar" className="bg-[#071739] text-xs text-slate-300 py-1.5 px-4 hidden md:block border-b border-blue-900/40 font-mono">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919288517027" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <Phone className="w-3 h-3 text-blue-400" />
              <span>+91 92885 17027</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:cvidyasolutions@gmail.com" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors text-slate-300">
              <Mail className="w-3 h-3 text-blue-400" />
              <span>cvidyasolutions@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header id="main-nav" className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          
          {/* Logo Brand Emblem */}
          <a 
            href="/" 
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-3 group shrink-0"
            title="C Vidya Solutions - Home"
          >
            <Logo size={42} showText={false} className="group-hover:scale-105 transition-all shrink-0" />
            <div>
              <div className="font-display font-bold text-xl md:text-2xl tracking-tight text-slate-950 group-hover:text-blue-600 transition-colors">
                C VIDYA
              </div>
              <div className="text-[10px] font-mono tracking-widest text-blue-600 font-bold -mt-0.5">
                SOLUTIONS
              </div>
            </div>
          </a>

          {/* Desktop Navigation Link Anchors */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-semibold text-slate-700">
            {navItems.map((item) => {
              const isActive = activePage === item.id || 
                (item.id === "software" && activePage.startsWith("software")) ||
                (item.id === "ai-agents" && activePage.startsWith("ai-agent"));
              return (
                <a 
                  key={item.id}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`relative py-1.5 transition-colors ${
                    isActive 
                      ? "text-blue-600 font-bold" 
                      : "hover:text-blue-600 text-slate-700"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-blue-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenConsultation || (() => onOpenHub("/contact/"))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-md text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-nav-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col gap-1 text-slate-800">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <a 
                    key={item.id}
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenConsultation) onOpenConsultation();
                  else onOpenHub("/contact/");
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-xs text-center cursor-pointer"
              >
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </header>

    </div>
  );
}
