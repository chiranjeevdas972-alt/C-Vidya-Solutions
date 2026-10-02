import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Youtube, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  ArrowUp,
  ArrowRight
} from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenArchitecture?: (tab?: "prd" | "trd" | "flow" | "uiux" | "schema" | "plan") => void;
  isAdminAuthenticated?: boolean;
  onAdminLoginSuccess?: () => void;
  onAdminLogout?: () => void;
  onOpenAdminModal?: () => void;
}

export default function Footer({ 
  onNavigate, 
  onOpenArchitecture: _onOpenArchitecture,
  isAdminAuthenticated: _isAdminAuthenticated,
  onAdminLoginSuccess: _onAdminLoginSuccess,
  onAdminLogout: _onAdminLogout,
  onOpenAdminModal: _onOpenAdminModal
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-[#071739] text-slate-300 pt-16 pb-12 relative border-t-2 border-blue-600 selection:bg-blue-600 selection:text-white">
      
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-48 opacity-10 bg-radial from-blue-400 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Column SEO Information Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start border-b border-slate-800 pb-12">
          
          {/* Column 1: Brand & Headquarters (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size={46} showText={false} className="shrink-0" />
              <div>
                <div className="font-display font-bold text-xl tracking-tight text-white">C VIDYA</div>
                <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold -mt-0.5">
                  SOLUTIONS
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              &ldquo;Architecting the future of enterprise logic. Delivering data-driven software suites, autonomous AI agents, and institutional cloud modernization with uncompromising technical precision.&rdquo;
            </p>

            {/* Official Contact Info */}
            <div className="text-xs space-y-2 text-slate-400 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Surunga, Baliapur, Dhanbad, Jharkhand - 828115, IN</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="tel:+919288517027" className="hover:text-blue-400 transition-colors font-medium">
                  +91 92885 17027
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="mailto:cvidyasolutions@gmail.com" className="hover:text-blue-400 transition-colors">
                  cvidyasolutions@gmail.com
                </a>
              </div>
            </div>

            {/* Verified Social Media Profiles */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href="https://www.youtube.com/@cvidyasolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="C Vidya Solutions YouTube Channel"
                aria-label="C Vidya Solutions YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61591206215743" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="C Vidya Solutions Facebook Page"
                aria-label="C Vidya Solutions Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/cvidyasolutions/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="C Vidya Solutions Instagram Profile"
                aria-label="C Vidya Solutions Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/CVidyaSolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="C Vidya Solutions Twitter / X"
                aria-label="C Vidya Solutions Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/cvidyasolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors" 
                title="C Vidya Solutions LinkedIn Page"
                aria-label="C Vidya Solutions LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Software Products (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                SOFTWARE SUITES
              </h5>
              <a 
                href="/software/"
                onClick={(e) => handleLink(e, "/software/")}
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>Directory</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
            </div>

            <nav className="grid grid-cols-1 gap-2 text-xs text-slate-300" aria-label="Software Suites">
              <a href="/software/library-management/" onClick={(e) => handleLink(e, "/software/library-management/")} className="hover:text-blue-400 transition-colors">
                Library Management Software
              </a>
              <a href="/software/fitness-zone/" onClick={(e) => handleLink(e, "/software/fitness-zone/")} className="hover:text-blue-400 transition-colors">
                Fitness Zone Management Software
              </a>
              <a href="/software/institutes-management/" onClick={(e) => handleLink(e, "/software/institutes-management/")} className="hover:text-blue-400 transition-colors">
                Institutes Management ERP
              </a>
              <a href="/software/coaching-management/" onClick={(e) => handleLink(e, "/software/coaching-management/")} className="hover:text-blue-400 transition-colors">
                Coaching Management Software
              </a>
              <a href="/software/enterprise-crm/" onClick={(e) => handleLink(e, "/software/enterprise-crm/")} className="hover:text-blue-400 transition-colors">
                Enterprise CRM Software
              </a>
              <a href="/software/petrol-pump-management/" onClick={(e) => handleLink(e, "/software/petrol-pump-management/")} className="hover:text-blue-400 transition-colors">
                Petrol Pump Fuel Suite
              </a>
              <a href="/software/agriculture-management/" onClick={(e) => handleLink(e, "/software/agriculture-management/")} className="hover:text-blue-400 transition-colors">
                AgriFusion Agribusiness
              </a>
              <a href="/software/jewellers-management/" onClick={(e) => handleLink(e, "/software/jewellers-management/")} className="hover:text-blue-400 transition-colors">
                Jewellers Management Software
              </a>
              <a href="/software/healthcare-management/" onClick={(e) => handleLink(e, "/software/healthcare-management/")} className="hover:text-blue-400 transition-colors">
                Care Plus Healthcare System
              </a>
              <a href="/software/pdf-media-tools/" onClick={(e) => handleLink(e, "/software/pdf-media-tools/")} className="hover:text-blue-400 transition-colors">
                PDF &amp; Media Tools SaaS
              </a>
            </nav>
          </div>

          {/* Column 3: Autonomous AI Agents (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                AUTONOMOUS AI AGENTS
              </h5>
              <a 
                href="/ai-agents/"
                onClick={(e) => handleLink(e, "/ai-agents/")}
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>All Agents</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
            </div>

            <nav className="grid grid-cols-1 gap-2 text-xs text-slate-300" aria-label="Autonomous AI Agents">
              <a href="/ai-agents/customer-support/" onClick={(e) => handleLink(e, "/ai-agents/customer-support/")} className="hover:text-blue-400 transition-colors">
                AI Customer Support Agent (24/7 RAG)
              </a>
              <a href="/ai-agents/sales-flow/" onClick={(e) => handleLink(e, "/ai-agents/sales-flow/")} className="hover:text-blue-400 transition-colors">
                SalesFlow AI Outbound SDR
              </a>
              <a href="/ai-agents/social-media/" onClick={(e) => handleLink(e, "/ai-agents/social-media/")} className="hover:text-blue-400 transition-colors">
                AI Social Media Marketing Agent
              </a>
              <a href="/ai-agents/b2b-marketing/" onClick={(e) => handleLink(e, "/ai-agents/b2b-marketing/")} className="hover:text-blue-400 transition-colors">
                B2B SaaS Growth Marketing AI
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                COMPANY &amp; SERVICES
              </h5>
              <nav className="grid grid-cols-2 gap-1.5 text-xs text-slate-300" aria-label="Company Links">
                <a href="/about/" onClick={(e) => handleLink(e, "/about/")} className="hover:text-blue-400 transition-colors">About Us</a>
                <a href="/services/" onClick={(e) => handleLink(e, "/services/")} className="hover:text-blue-400 transition-colors">Services</a>
                <a href="/pricing/" onClick={(e) => handleLink(e, "/pricing/")} className="hover:text-blue-400 transition-colors">Pricing</a>
                <a href="/contact/" onClick={(e) => handleLink(e, "/contact/")} className="hover:text-blue-400 transition-colors">Contact</a>
                <a href="/portfolio/" onClick={(e) => handleLink(e, "/portfolio/")} className="hover:text-blue-400 transition-colors">Portfolio</a>
                <a href="/careers/" onClick={(e) => handleLink(e, "/careers/")} className="hover:text-blue-400 transition-colors">Careers</a>
              </nav>
            </div>
          </div>

          {/* Column 4: Regional Hubs & Knowledge (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              RESOURCES &amp; HUB
            </h5>
            <nav className="grid grid-cols-1 gap-2 text-xs text-slate-300" aria-label="Resources">
              <a href="/blog/" onClick={(e) => handleLink(e, "/blog/")} className="hover:text-blue-400 transition-colors">
                Technology Blog
              </a>
              <a href="/faq/" onClick={(e) => handleLink(e, "/faq/")} className="hover:text-blue-400 transition-colors">
                Frequently Asked Questions
              </a>
              <a href="/pricing/" onClick={(e) => handleLink(e, "/pricing/")} className="hover:text-blue-400 transition-colors">
                Software Pricing Plans
              </a>
              <a href="/contact/" onClick={(e) => handleLink(e, "/contact/")} className="hover:text-blue-400 transition-colors">
                Book Architecture Demo
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-normal">
              <div className="font-semibold text-slate-300">R&amp;D Center:</div>
              <div>STPI Desk, BIT Sindri Campus, Dhanbad, Jharkhand</div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Compliance Strip */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 font-mono text-[11px] pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
            <span>© 2026 C Vidya Solutions. All rights reserved.</span>
            <span>•</span>
            <a 
              href="/privacy/"
              onClick={(e) => handleLink(e, "/privacy/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a 
              href="/terms/"
              onClick={(e) => handleLink(e, "/terms/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a 
              href="/billing/"
              onClick={(e) => handleLink(e, "/billing/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Billing
            </a>
            <span>•</span>
            <a 
              href="/refund/"
              onClick={(e) => handleLink(e, "/refund/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Refund Policy
            </a>
            <span>•</span>
            <a 
              href="/cookies/"
              onClick={(e) => handleLink(e, "/cookies/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Cookies
            </a>
            <span>•</span>
            <a 
              href="/disclaimer/"
              onClick={(e) => handleLink(e, "/disclaimer/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Disclaimer
            </a>
            <span>•</span>
            <a 
              href="/portability/"
              onClick={(e) => handleLink(e, "/portability/")}
              className="text-slate-300 hover:text-blue-400 transition-colors underline"
            >
              Data Erasure
            </a>
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
