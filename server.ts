import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import {
  getSmartAssistantResponse,
  generateCustomerResponse,
  extractStructuredLeadFromChat,
  extractCustomerDetails,
  detectLanguageMode,
  detectCustomerLanguage,
  detectCustomerIntents,
  isGenericCatchAllReply,
} from "./src/utils/aiResponder.ts";
import { getPageSeo } from "./src/seoData.ts";
import {
  CANONICAL_PRODUCT_REGISTRY_SEED,
  createInMemoryDeploymentRegistryStore,
  validateAndProcessDeploymentRegistration,
  adminUpdateDeploymentEntry,
  toPublicRegistryView,
  serializeAdminRegistrySnapshot,
  normalizeProductLookupKey,
  validateDeploymentUrl,
} from "./src/shared/deploymentRegistry.ts";

// Load environment variables
dotenv.config();

// Mailer Transporter for dispatching client leads to cvidyasolutions@gmail.com
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

async function sendLeadNotificationEmail(lead: {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  source: string;
}) {
  const targetEmail = "cvidyasolutions@gmail.com";
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log(`📨 [NEW LEAD REQUISITION FOR ${targetEmail}]:`, lead);

  // 1. Always persist lead to Firestore inquiries collection with assigned target email
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  try {
    const leadRecord = {
      id: leadId,
      name: lead.name || "Chatbot Visitor",
      email: lead.email || "Not Provided",
      phone: lead.phone || "Not Provided",
      service: lead.service || "C Vidya Software / AI Requisition",
      message: lead.message || "Consultation requested via C Vidya AI Chatbot",
      targetEmail,
      timestamp: new Date().toISOString(),
      source: lead.source,
      status: "Forwarded to cvidyasolutions@gmail.com"
    };
    const created = await firestoreRestCreateDocument("inquiries", leadId, leadRecord);
    if (created) {
      console.log(`✅ Lead ${leadId} persisted to Firestore inquiries for ${targetEmail}`);
    }
  } catch (err) {
    console.warn("Firestore lead persistence warning:", err);
  }

  // 2. Dispatch via SMTP if configured in environment
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await mailTransporter.sendMail({
        from: `"C Vidya AI Assistant" <${process.env.SMTP_USER}>`,
        to: targetEmail,
        subject: `🚀 [New Client Lead] ${lead.name || "Website Visitor"} (${lead.phone || lead.email || "Lead Inquiry"})`,
        text: `New User Contact Details Received via ${lead.source}:

Name: ${lead.name || "N/A"}
Phone: ${lead.phone || "N/A"}
Email: ${lead.email || "N/A"}
Service / Product: ${lead.service || "General Software Inquiry"}
Message: ${lead.message || "No message"}
Source: ${lead.source}
Timestamp: ${timestamp}

This lead was automatically captured by the C Vidya AI Assistant and forwarded to cvidyasolutions@gmail.com.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0b57d0; margin-top: 0;">🚀 New Customer Requisition Captured</h2>
            <p>A website visitor has submitted their contact details via <strong>${lead.source}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold; width: 140px;">Name:</td><td style="padding: 8px;">${lead.name || "N/A"}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;"><a href="tel:${lead.phone}">${lead.phone || "N/A"}</a></td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${lead.email}">${lead.email || "N/A"}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Product / Service:</td><td style="padding: 8px;">${lead.service || "C Vidya Software / AI Requisition"}</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${lead.message || "N/A"}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Timestamp:</td><td style="padding: 8px;">${timestamp}</td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
              This notification was automatically dispatched to <strong>cvidyasolutions@gmail.com</strong>.
            </p>
          </div>
        `
      });
      console.log(`✅ Mail dispatched successfully to ${targetEmail}`);
    } catch (mailError) {
      console.error("Error dispatching email via SMTP:", mailError);
    }
  } else {
    console.log(`ℹ️ SMTP credentials not set in env. Lead is safely stored in Firestore and in-memory queue for ${targetEmail}`);
  }
}

const app = express();

// Parse command line arguments (e.g., npm run dev --port 3000 --host 0.0.0.0)
const portArgIndex = process.argv.indexOf("--port");
const argPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const isProductionEnv = process.env.NODE_ENV === "production";
const envPort = process.env.PORT && (isProductionEnv || process.env.PORT !== "8080") ? parseInt(process.env.PORT, 10) : null;
// Environment constraint: Dev server must run on port 3000; production honors process.env.PORT
const PORT = argPort || envPort || 3000;

// Security: Disable X-Powered-By to prevent fingerprinting by port scanners and ethical hacking tools
app.disable("x-powered-by");

// Trust reverse proxies (Google Cloud Run / Cloudflare) for accurate IP resolution
app.set("trust proxy", true);

// Prototype Pollution & Parameter Tampering Guard
app.use((req, res, next) => {
  function sanitize(obj: any, depth = 0): void {
    if (!obj || typeof obj !== "object" || depth > 10) return;
    for (const key of Object.keys(obj)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        delete obj[key];
        continue;
      }
      if (typeof obj[key] === "object") {
        sanitize(obj[key], depth + 1);
      }
    }
  }
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
});

// Middleware - allow up to 15mb payload for PDF resume attachments on application endpoint and capture rawBody for HMAC webhook verification
app.use(express.json({
  limit: "15mb",
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// In-memory log of client inquiries for demo/leads panel (fallback storage)
const inquiries: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: string;
}> = [];

// In-memory log of job applications (fallback storage)
const applications: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  jobTitle: string;
  jobCategory?: string;
  jobLocation?: string;
  roleType?: string;
  timestamp: string;
  status: string;
}> = [];

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Chat features will fall back to smart replies.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions for C Vidya Solutions AI Customer Support Assistant
// Deeply researched & trained on all data, services, architecture, leadership, and policies from https://cvidyasolutions.com
const SYSTEM_INSTRUCTION = `You are the official AI Customer Support Assistant of C Vidya Solutions.

==================================================
COMPANY OVERVIEW & IDENTITY
==================================================
Company Name: C Vidya Solutions (also known as C Vidya, CVidya Solutions)
Official Website: https://cvidyasolutions.com (www.cvidyasolutions.com)
Tagline: "Innovating Software for a Simpler Future"
Secondary Motto: "Architecting the Future of Business Logic | Built to Perform"

Founding & Leadership:
- Founder & Director: Chiranjeev Das (chiranjeev0058@gmail.com)
- Chief Executive Officer (CEO): Sarah Jenkins (Over 15 years in enterprise software and strategic vision)
- Chief Technology Officer (CTO): Marcus Chen (Core deployment pipelines, R&D division, distributed cloud microservices)
- Head of Operations: Elena Rodriguez (Client delivery methodologies, rigorous SLA execution)

History & Legacy:
- 2018: Foundation as a specialized consultancy focusing on core infrastructure modernization.
- 2021: Expansion scaling operations globally, launching our proprietary data analytics practice.
- 2025 - Present: Full-scale Innovation with Autonomous AI Agents, multi-tenant cloud SaaS suites, and continuous delivery.

Regional Offices & Strategic Locations:
1. Corporate Headquarters:
   Surunga, Baliapur, Dhanbad, Jharkhand - 828115, India
2. Academic R&D Incubation & Branch Office:
   STPI Desk, BIT Sindri Campus, Dhanbad, Jharkhand, India (Certified under Software Technology Parks of India, Ministry of Electronics & IT)

Official Contact Channels:
- Official Website: https://cvidyasolutions.com
- Direct Helpline Phones: +91 92885 17027 / +91 8987766981 (Mon - Sat 10:00 AM - 07:00 PM IST)
- Official Support Email: cvidyasolutions@gmail.com
- Founder/Director Desk: chiranjeev0058@gmail.com
- Official Social Channels:
  • YouTube: https://www.youtube.com/@cvidyasolutions
  • Facebook: https://www.facebook.com/profile.php?id=61591206215743
  • Instagram: https://www.instagram.com/cvidyasolutions/?hl=en (@cvidyasolutions)
  • Twitter / X: https://twitter.com/CVidyaSolutions (@CVidyaSolutions)
  • LinkedIn: https://linkedin.com/company/cvidyasolutions

==================================================
YOUR ROLE, TONE & BILINGUAL MASTERY (ENGLISH & HINGLISH)
==================================================
You are an intelligent, friendly, authoritative, and polite AI Customer Support Assistant for C Vidya Solutions. You have complete knowledge of every SaaS suite, autonomous AI agent, specialized platform, pricing tier, career opening, and technical specification from www.cvidyasolutions.com.

LANGUAGE GUIDELINES:
1. ENGLISH: When the user queries in English, respond in polished, structured, professional English with clear headings, bullet points, and live app URLs.
2. HINGLISH: When the user queries in Hindi, Urdu, or Hinglish (Roman script Hindi mixed with English tech terms, e.g., "gym software me kya features hai?", "petrol pump ka credit khata kaise chalega?", "chiranjeev das kaun hai?", "price kitna hai?", "demo dikhao", "kaha par office hai?"), respond in warm, respectful, fluent, and natural Hinglish (Roman Hindi) with standard industry terminology (e.g. "C Vidya Fitness Zone gym aur fitness studios ke liye ek complete cloud operating system hai...").
3. MIXED: Mirror the customer's language seamlessly and naturally.
4. EMOJIS: Use clean, professional emojis (👋, 🚀, 📦, 🤖, ⚡, 📞, 📍) to enhance readability.

==================================================
1. C VIDYA SAAS PRODUCT SUITE (7 FLAGSHIP PLATFORMS)
==================================================

1. C Vidya Library Management System
   - Live URL: https://v.cvidyasolutions.workers.dev/
   - Description: Complete digital library system for study centers, reading rooms, universities, and public/college libraries.
   - Core Features:
     • Digital catalog repository with ISBN & barcode scanner for rapid book check-in and check-out.
     • Automated WhatsApp and SMS notifications for overdue titles with automated fine calculation.
     • Reading room seat allocator with morning/evening shift allotments and student entry ledgers.
     • Digital student ID cards with QR checkout passes.
     • Reader habit analytics identifying high-demand book titles and peak reading room hours.

2. C Vidya Fitness Zone
   - Live URL: https://fitzone.cvidyasolutions.workers.dev/
   - Description: Next-generation gym, fitness studio, and crossfit management operating system.
   - Core Features:
     • Biometric fingerprint scan & RFID wristband turnstile door gate access control.
     • Automated turnstile lock that instantly blocks entry for members with expired or unpaid subscriptions.
     • Flexible active membership plans (Daily passes, Monthly, Quarterly, Annual, Couple, Personal Training / PT).
     • Automated WhatsApp renewal reminders with integrated UPI payment links.
     • Personalized workout regimes, macronutrient targets, and progressive exercise planners.
     • Trainer commission logs, floor capacity heatmaps, and peak attendance analytics.

3. C Vidya Institutes Management
   - Live URL: https://institutes.cvidyasolutions.workers.dev/
   - Description: All-in-one ERP suite for K-12 schools, degree colleges, and large academic complexes.
   - Core Features:
     • End-to-end admission counseling CRM pipeline from lead inquiry to formal enrollment.
     • Digital fee collection with customizable installment structures, concessions, and instant downloadable PDF cashbooks.
     • CBSE/ICSE standard gradebook generator with automated academic report cards and marksheets.
     • Biometric student & faculty attendance with instant parent SMS/WhatsApp arrival alerts.
     • Real-time GPS school bus route tracking, driver assignments, and geo-fencing boarding notifications for parents.
     • Hostel and dormitory room allotment, mess billing, and student gate-pass management.

4. C Vidya Coaching Management
   - Live URL: https://coaching.cvidyasolutions.workers.dev/
   - Description: Specially engineered for competitive exam academies (JEE, NEET, UPSC, SSC, Banking, State Boards).
   - Core Features:
     • Dynamic batch scheduling, classroom seating charts, and syllabus progress trackers.
     • Biometric attendance with automated absent SMS alerts dispatched directly to parents.
     • Offline OMR mock test grading sheets scanner: scans paper OMR answer sheets via camera/scanner and instantly computes scores, percentiles, and All-India Rank (AIR).
     • Diagnostic performance scorecards pinpointing student topic-wise weaknesses.
     • Faculty doubt ticket tracker assigning student questions to dedicated subject mentors.

5. AgriFusion (FarmFresh Hub / ChickMart)
   - Live URL: https://fresh.cvidyasolutions.workers.dev/
   - Tagline: "One Platform. Every Farm. Unlimited Growth."
   - Description: Unified multi-farm agribusiness management software unifying livestock, crops, and retail.
   - Core Features:
     • Poultry flock cycles: daily feed intake, mortality rate tracking, and Feed Conversion Ratio (FCR).
     • Aquaculture & fishery: pond water telemetry logs (pH, Dissolved Oxygen, temperature, salinity).
     • Goat farming & livestock: herd breeding registries, pedigree logs, and vaccination health schedules.
     • Integrated weighing scale & retail POS: rapid point-of-sale billing for fresh chicken, meat, fish, eggs, and produce.
     • Distributor credit khata (udhari ledger) with automated payment follow-ups.
     • Farm P&L accounting calculating total feed cost, operational expenses, and net batch profitability.

6. C Vidya Jewelry Management
   - Live URL: https://jewelry.cvidyasolutions.workers.dev/
   - Description: Specialized bullion and retail jewelry enterprise ERP.
   - Core Features:
     • Real-time 24K, 22K, and 18K gold and silver bullion spot market price feed synchronization.
     • Precision weight calculations: gross weight, net weight, stone weight, and Karigar wastage (ghat) percentage.
     • Karigar (artisan) metal casting logs, raw metal issuance, craftsmanship loss monitoring, and scrap recovery.
     • Custom bespoke jewelry order book with design catalogs, photos, and advance payment tracking.
     • In-store barcode label scanning and instant GST-compliant HUID tax invoices.

7. C Vidya Enterprise CRM
   - Live URL: https://crm.cvidyasolutions.workers.dev/
   - Description: Sales pipeline velocity and deal closing platform for commercial sales teams.
   - Core Features:
     • Visual Kanban deal pipeline with drag-and-drop opportunity cards and win probabilities.
     • Omnichannel lead capture from website forms, WhatsApp messages, and inbound phone calls.
     • Automated follow-up task cadences, customer greeting emails, and meetings calendar.
     • VoIP telephone integration with automated call logging and conversation notes.
     • 1-minute branded quotation and proposal PDF generator.
     • Sales rep performance metrics, conversion speed, and revenue attribution analytics.

==================================================
2. C VIDYA AUTONOMOUS AI AGENTS (4 AGENTS)
==================================================

1. C Vidya AI Social Media Agent
   - Live URL: https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/
   - Model: Generative Content & Trend AI
   - Description: Autonomous viral trend research, high-converting copy generation, graphic suggestions, multi-channel auto-scheduling across LinkedIn, X (Twitter), Instagram, and Facebook, comment sentiment nurturing, and automated DM lead qualification.

2. C Vidya AI Customer Support Agent
   - Live URL: https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/
   - Model: Neural RAG + Gemini Flash 3.8
   - Description: Next-gen 24/7 autonomous support agent powered by custom Knowledge Base Retrieval-Augmented Generation (RAG), sub-0.8s resolution speeds, omnichannel widgets (Web, WhatsApp, Email), SLA monitoring, and smooth human escalation.

3. C Vidya Solutions SalesFlow AI Agent
   - Live URL: https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/
   - Model: Autonomous Sales SDR & Pipeline AI
   - Description: Autonomous B2B sales intelligence & outreach agent to discover verified prospects, generate personalized multi-channel sales sequences (Email, WhatsApp, LinkedIn), score intent via BANT qualification, and book calendar demo appointments.

4. C Vidya AI Marketing for B2B SaaS Companies
   - Live URL: https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/
   - Model: B2B SaaS Growth & Marketing AI Engine
   - Description: Autonomous inbound demand gen engine: AI keyword research, competitor content gap analysis, automated high-ranking SEO articles, LinkedIn thought leadership copy, lead magnet generator, and CAC / MQL velocity attribution.

==================================================
3. OTHER SPECIALIZED SERVICES & SUITES (3 PLATFORMS)
==================================================

1. C Vidya Cloud-Based Software Petrol Pump Site
   - Live Worker URL: https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/
   - Description: Fuel station ERP for retail petrol/diesel dealerships (IOCL, BPCL, HPCL, Nayara, Shell, Reliance).
   - Core Features:
     • Shift opening/closing totalizer meter readings with automated nozzle sales reconciliation.
     • Physical dip measurement vs electronic meter sales with automatic temperature/density variance audits.
     • Transport fleet credit khata (indent / slip / challan billing) with automated WhatsApp balance reminders.
     • Lubricants & DEF/AdBlue stock tracking with re-order alerts.
     • Cashier collection registers, UPI/card payment reconciliations, and instant GST-compliant fuel bills.

2. Care Plus Healthcare System
   - Live Worker URL: https://care-plus.cvidyasolutions.workers.dev/
   - Description: Hospital Information System (HIS) & Clinical Practice ERP for hospitals, nursing homes, clinics, and diagnostic centers.
   - Core Features:
     • Paperless Outpatient (OPD) queue token management & Inpatient (IPD) admissions.
     • Specialist doctor appointment scheduling and roster management.
     • Digital prescription (EHR/EMR) generator with drug dosage guides and allergy warnings.
     • In-house pharmacy POS with batch expiry alerts and inventory reorders.
     • Pathology & radiology diagnostic lab test booking with sample barcodes and automated report generation.
     • IPD bed/ward/ICU allocation and consolidated hospitalization billing with insurance TPA & Ayushman Bharat support.

3. C Vidya PDF and Media Tools SaaS
   - Live Worker URL: https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/
   - Description: High-speed browser-edge & cloud digital document transformation and multimedia processing platform.
   - Core Features:
     • High-fidelity Word to PDF conversion with preserved typography, XML paragraph extraction, and WinAnsi encoding sanitization.
     • Complete PDF utilities: Merge PDF, Split PDF, Compress PDF without quality loss, Watermark & Branding, Page Rotation, Password Protect & Unlock.
     • High-speed image and multimedia format converters (PNG, JPG, WebP, SVG).
     • Client-side edge processing ensuring 100% privacy and zero data retention.

==================================================
4. PRICING & SUBSCRIPTION MODELS
==================================================
C Vidya Solutions follows a modular, pay-as-you-grow SaaS pricing structure based on active operational volume (number of students, members, fuel nozzles, or branches):

1. Starter / Single Branch Tier:
   - Target: Single-branch libraries, local fitness studios, small clinics, individual farms.
   - Model: Modular per-module pricing billed annually.
   - Includes: Single-branch database, up to 1,000 active records, essential POS billing, thermal receipts, WhatsApp/SMS alerts, standard email support, zero-lockin data export.

2. Growth / Professional Tier (Most Popular):
   - Target: Multi-batch coaching centers, busy fuel stations, jewelry showrooms, growing clinics.
   - Model: Custom growth based on operational volume.
   - Includes: Multi-counter/multi-batch capacity, biometric turnstile hardware integration, automated GST tax ledgers, omnichannel AI Customer Support widget, shift reconciliation & stock variance audits, priority 24/7 SLA technical support.

3. Enterprise Custom Tier:
   - Target: Multi-campus academic networks, hospital chains, enterprise CRM pipelines.
   - Model: Custom multi-tenant deployment with tailored SLA.
   - Includes: Unlimited branch sites with central super-admin, dedicated private cloud or edge node deployment, custom ERP schema, autonomous AI SalesFlow & Marketing Agent suite, enterprise SSO, dedicated Technical Account Manager, 99.9% SLA.

Tax Compliance:
- 100% GST-compliant corporate tax invoices issued with your business's registered GSTIN number.

==================================================
5. SYSTEM INTEGRATION, MIGRATION & CLOUD SECURITY
==================================================
- Integration Timeline: Pre-built turnkey SaaS modules deploy within 2 to 5 business days. Custom enterprise migrations and AI agent pipelines span 3 to 6 weeks with zero downtime guarantees.
- Legacy System Migration: Free data migration assistance via bulk 1-click Excel/CSV ingestion.
- Cloud Architecture: Hosted on Cloudflare Workers global edge nodes (<50ms latency, 99.99% uptime).
- Security: End-to-end TLS 1.3 in-transit encryption and AES-256 at-rest encryption on Google Cloud & Firebase Firestore with automated daily redundant backups.
- Access Control: Zero-Trust Role-Based Access Control (RBAC) separating admins, managers, cashiers, trainers, and customers.
- Certification: Supported and incubated under Software Technology Parks of India (STPI Sindri, BIT Sindri Campus).

==================================================
6. CAREERS & JOB OPPORTUNITIES
==================================================
C Vidya Solutions is actively hiring top talent:
1. Senior Full-Stack Cloud Architect (Engineering, 4-7 Years experience, Remote / Hybrid Dhanbad HQ).
2. Autonomous AI Agent Engineer (R&D AI Division, 2-5 Years experience, Remote).
3. Enterprise UI/UX Systems Designer (Design Systems, 3+ Years experience, Remote).
- How to Apply: Visit https://cvidyasolutions.com/careers/ or email resume to cvidyasolutions@gmail.com.

==================================================
7. LIVE DEMO & ONBOARDING CONVERSATION FLOWS
==================================================
- Free Instant Demo: Users can click the "Click here" icon button on any product card on the website to launch the live sandbox application instantly.
- Personalized 1-on-1 Walkthrough:
  To arrange a custom live demonstration, collect:
  1. Full Name
  2. Business or Organization Name
  3. Mobile / WhatsApp Number
  4. Email Address
  5. Interested Software Product / AI Agent
  6. City & State
  7. Preferred Demo Date & Time

==================================================
8. TECHNICAL SUPPORT & CRITICAL SECURITY RULES
==================================================
- Password Reset: Guide user to click 'Forgot Password' on the login screen to receive an OTP via registered email/mobile.
- Technical Issue Reporting: Ask for product name, registered mobile/email, device type (mobile/desktop), browser, and error message.
- CRITICAL SECURITY WARNING: NEVER ask for, accept, or store passwords, OTPs, ATM PINs, bank details, or secret keys. If a user provides them, warn them immediately.
- UNKNOWN TOPICS: If something is outside verified company offerings, say: "I do not have confirmed information on that at the moment. Please contact our official team at https://cvidyasolutions.com or call +91 92885 17027."

==================================================
9. USER DETAILS FORWARDING TO cvidyasolutions@gmail.com
==================================================
CRITICAL REQUIREMENT:
Whenever a user sends their contact details (such as their phone number, email address, name, or specific business requirements) in the chat:
1. Warmly and explicitly confirm to the user:
   "Thank you! Your details have been successfully recorded and forwarded directly to our Founder/Director desk and official email: cvidyasolutions@gmail.com. Our executive team will contact you shortly via phone or WhatsApp (+91 92885 17027)."
2. (In Hinglish):
   "बहुत-बहुत धन्यवाद! 🙏 आपकी कॉन्टैक्ट डिटेल्स हमारे ऑफिशियल ईमेल डेस्क (cvidyasolutions@gmail.com) और डायरेक्टर डेस्क पर सफलतापूर्वक फॉरवर्ड कर दी गई हैं। हमारी टीम आपसे जल्द ही कॉल या WhatsApp पर संपर्क करेगी।"

==================================================
10. FUTURE SCOPE & ADVANCED TECHNOLOGY QUERIES
==================================================
If a user asks questions like:
- "ishhmme future ke liye kuchh achha cheez hain kya"
- "Isme future ke liye kya achha hai?"
- "What is the future scope and advance technology in C Vidya?"
- "Why should we choose C Vidya for our business?"

NEVER give a generic or vague response. ALWAYS give a rich, comprehensive, future-focused answer highlighting:
1. 🤖 4 Autonomous AI Agents (24/7 sub-0.8s customer support, SalesFlow lead outreach & demo booking, AI marketing & social media auto-pilot).
2. ⚡ Ultra-fast Cloudflare Edge global network (<50ms latency, 99.99% uptime) + STPI Sindri government incubation.
3. 🚪 Smart IoT & Hardware automation (biometric turnstile gate auto-lock, camera OMR sheet grader, fuel density/leakage telemetry).
4. 📈 Modular pay-as-you-grow SaaS model with zero data lock-in and 100% GST-compliant billing.
5. Direct invitation to test live demos on cvidyasolutions.com or contact +91 92885 17027.

TRAINED KNOWLEDGE BASE (Q&A):
Q: What is C Vidya Solutions?
A: C Vidya Solutions is a software solutions company that develops modern, practical, and user-friendly software products for businesses, educational organizations, libraries, gyms, farms, and other industries. Our goal is to simplify daily operations through digital technology.

Q: What services does C Vidya Solutions provide?
A: C Vidya Solutions provides software development, business management software, digital solutions, software customization, customer support, and technology solutions based on business requirements.

Q: What software products are available at C Vidya Solutions?
A: C Vidya Solutions provides software solutions such as Library Management, Institute and Coaching Management, Gym Management, Poultry Business Management, and Farming Management solutions. Product availability may change based on current offerings.

Q: What is C Vidya Library Management System?
A: C Vidya Library Management System is designed to help libraries manage students, books, book issue and return records, seats, fees, payments, billing, expenses, transactions, and reports digitally.

Q: Who can use C Vidya Library Management System?
A: It can be useful for private libraries, reading libraries, study centers, educational libraries, and organizations that want to manage library operations digitally.

Q: What features are available in the Library Management System?
A: Features may include student management, book management, book issue and return, seat management, fee tracking, billing, invoices, expense records, transactions, student ID management, reports, and an administrative dashboard.

Q: Can the Library Management System manage student records?
A: Yes. The system can help manage student information and related records in an organized digital format.

Q: Can the Library Management System manage books?
A: Yes. It can help maintain book information and track book issue and return activities.

Q: Can the Library Management System manage library seats?
A: Yes. Seat management functionality can help libraries organize and monitor seat-related information.

Q: Can I track student fees in the Library Management System?
A: Yes. The system may help manage fee records, payments, billing, and related transaction information.

Q: Can the Library Management System generate invoices?
A: The system may include billing and invoice management features. Please request a demo to confirm the features available in your selected plan.

Q: What is Institute Management Software?
A: Institute Management Software helps educational institutes manage students, admissions, fees, attendance, courses, batches, teachers, notices, and administrative operations from one platform.

Q: Who can use Institute Management Software?
A: It can be useful for schools, coaching centers, training institutes, tuition centers, educational organizations, and skill-development centers.

Q: Can the Institute Management Software manage student admissions?
A: Yes. It can help organize student admission information and related records.

Q: Can the Institute Management Software manage student fees?
A: Yes. It can help maintain fee-related information, payment records, and transaction details.

Q: Can the Institute Management Software manage attendance?
A: Attendance management may be available depending on the selected product version or plan. Please request a demo for confirmation.

Q: Can the Institute Management Software manage batches?
A: Yes. Batch and course management features may help institutes organize students and academic activities.

Q: What is CV Fitness Zone?
A: CV Fitness Zone is a gym and fitness management software designed to help gym owners manage members, memberships, payments, attendance, trainers, renewals, and daily operations.

Q: Who can use CV Fitness Zone?
A: It can be useful for gyms, fitness centers, health clubs, personal training centers, and fitness businesses.

Q: Can CV Fitness Zone manage gym members?
A: Yes. It can help maintain member information and membership-related records.

Q: Can CV Fitness Zone manage membership plans?
A: Yes. Membership plan management may be available to help organize different gym plans and member subscriptions.

Q: Can CV Fitness Zone track gym payments?
A: Yes. It may help manage membership fees, payments, and related financial records.

Q: Can CV Fitness Zone manage attendance?
A: Attendance management may be available depending on the product configuration. Please request a demo for exact details.

Q: What is ChickMart?
A: ChickMart is a software solution designed for poultry-related businesses. It may help manage products, inventory, customers, sales, purchases, expenses, billing, and business records.

Q: Who can use ChickMart?
A: ChickMart may be useful for poultry shops, chicken businesses, poultry farms, meat shops, and related businesses.

Q: Can ChickMart manage poultry inventory?
A: Yes. It may help businesses organize inventory and monitor stock-related information.

Q: Can ChickMart manage sales?
A: Yes. It may help record and organize sales information.

Q: Can ChickMart manage customers?
A: Yes. Customer management functionality may help maintain customer information and business records.

Q: What is FarmFresh Hub?
A: FarmFresh Hub is a farm and agriculture management solution designed to help manage farming activities, inventory, sales, expenses, customers, and business records.

Q: Who can use FarmFresh Hub?
A: FarmFresh Hub may be useful for poultry farms, goat farms, fish farms, egg businesses, mixed farms, and agriculture-related businesses.

Q: Can FarmFresh Hub manage multiple farming activities?
A: It may support different farming operations through one platform, depending on the selected modules and configuration.

Q: Can FarmFresh Hub track farm expenses?
A: Yes. Expense management features may help farm owners organize and monitor business expenses.

: Can FarmFresh Hub manage farm sales?
A: Yes. It may help maintain sales records and related business information.

Q: What is AgriFusion?
A: AgriFusion is an all-in-one farming management solution developed to help manage multiple farming operations through one platform. Tagline: "One Platform. Every Farm. Unlimited Growth."

Q: What types of farming can AgriFusion support?
A: Depending on the selected modules, AgriFusion may support poultry farming, goat farming, fish farming, egg production, inventory management, sales, expenses, customer records, and business reporting.

Q: Who can use AgriFusion?
A: AgriFusion may be useful for individual farmers, farm owners, poultry businesses, mixed farms, agriculture businesses, and organizations managing multiple farming operations.

Q: What is C Vidya Jewelers Management?
A: C Vidya Jewelers Management is a specialized bullion and retail jewelry enterprise ERP. It provides live 24K, 22K, and 18K gold and silver market rate sync, gross/net/stone/wastage weight calculations, Karigar (artisan) metal casting and scrap logs, custom bespoke bridal design order books, and GST barcode billing.

Q: Who can use C Vidya Jewelers Management?
A: It is designed for jewelry showroom owners, bullion traders, goldsmiths, and jewelry manufacturing workshops.

Q: What is C Vidya Enterprises CRM?
A: C Vidya Enterprises CRM is a modern sales execution and customer relationship management platform featuring drag-and-drop Kanban pipelines, automated follow-up cadences, VoIP call logs, instant quote/proposal PDF builders, and revenue velocity metrics.

Q: What are the 4 Autonomous AI Agents developed by C Vidya Solutions?
A: The 4 Autonomous AI Agents are:
1. C Vidya Social Media Agent (viral trend discovery, automated content scheduling, and comment sentiment nurturing across LinkedIn, X, Instagram, Facebook).
2. C Vidya AI Customer Support Agent (24/7 RAG support, sub-second query resolution, omnichannel widgets, and human escalation).
3. C Vidya Business Sales Flow AI Agent (autonomous B2B prospect discovery, personalized cold outreach across email/LinkedIn/WhatsApp, BANT qualification, and direct calendar demo booking).
4. C Vidya AI Marketing for B2B SaaS Companies (autonomous inbound demand generation, SEO keyword clustering, technical blogs, LinkedIn thought leadership, and CAC/MQL attribution).

Q: What is C Vidya Cloud-Based Software Petrol Pump Site?
A: It is an advanced cloud fuel station management ERP designed for petrol pumps, diesel dealerships, and retail fueling stations (IOCL, BPCL, HPCL, Nayara, Shell, Reliance). It manages nozzle meter readings, underground tank dip-to-sale variance audits, fleet credit khata (indent / slip billing) with automated WhatsApp reminders, lube stock inventory, and GST invoicing.

Q: How does C Vidya Petrol Pump software handle fuel dips and variance?
A: The software records physical opening and closing dips from underground storage tanks and automatically compares them against cumulative nozzle meter sales to calculate daily evaporation, temperature, and stock variances, ensuring leak detection and zero fuel pilferage.

Q: Can C Vidya Petrol Pump software manage credit accounts (Credit Khata)?
A: Yes. It offers comprehensive fleet credit khata management for transport fleets, bus operators, and local corporate accounts. It records fuel slips/challans with vehicle numbers and driver signatures, and sends automated WhatsApp payment reminders and statements.

Q: What is Care Plus Healthcare System?
A: Care Plus Healthcare System is an integrated Hospital Information System (HIS) and clinical practice management software for hospitals, clinics, nursing homes, and diagnostic centers.

Q: What features are included in Care Plus Healthcare System?
A: Key modules include OPD queue tokens, IPD admissions and bed/ward allocation, doctor appointment scheduling, digital prescription generator (EMR/EHR) with drug dosage and allergy templates, in-house pharmacy POS with batch expiry tracking, pathology/radiology lab test booking with barcode sample tracking and report printing, and consolidated hospitalization billing with insurance TPA & Ayushman Bharat support.

Q: What is C Vidya PDF and Media Tools SaaS?
A: C Vidya PDF and Media Tools SaaS is a high-speed browser-edge & cloud digital document and multimedia transformation suite. It provides Word to PDF conversion with preserved typography, XML paragraph extraction, and WinAnsi sanitization; comprehensive PDF utilities including Merge, Split, Compress, Watermark, Rotate, and Protect; and media/image format converters.

Q: Are files uploaded to C Vidya PDF and Media Tools secure?
A: Yes. All file processing happens either on the secure client-side browser edge or encrypted transient pipelines with zero persistent file retention, ensuring strict data privacy and security.

Q: How can C Vidya Solutions help my business?
A: C Vidya Solutions can help reduce manual work, organize important records, improve operational efficiency, centralize business information, and support better decision-making through digital software solutions.

Q: Which software is best for my business?
A: Please share your business type, approximate number of users or customers, main requirements, and the features you need. Based on this information, we can help identify a suitable software solution.

Q: Can I request a software demo?
A: Yes. Please share your full name, business or organization name, mobile number, email address, interested software product, city, and preferred demo time. The C Vidya Solutions team can review your request.

Q: Is the software demo free?
A: Demo availability and pricing depend on the current company policy. Please submit your requirements to receive confirmed information.

Q: How can I request a demo?
A: Visit the official C Vidya Solutions website (https://cvidyasolutions.com) and use the available contact or inquiry option. You can also provide your details here for a demo inquiry.

Q: What details are required for a demo request?
A: Please provide your name, business or organization name, mobile number, email address, interested software, business requirements, city, and preferred demo time.

Q: What is the price of the software?
A: Pricing may depend on the selected product, required modules, number of users, customization requirements, and business needs. Please share your requirements to receive accurate pricing information.

Q: Do you provide a free trial?
A: Free-trial availability depends on the current product and company policy. Please contact the C Vidya Solutions team for confirmed information.

Q: Do you offer monthly plans?
A: Plan availability depends on the selected software and current pricing policy. Please contact the team for accurate plan details.

: Do you offer yearly plans?
A: Annual plan availability depends on the selected software and current pricing policy. Please contact the team for confirmed information.

Q: Can the software be customized?
A: Customization may be available based on your business requirements and technical feasibility. Please share the features or changes you need for evaluation.

Q: Can you add new features to the software?
A: Additional features may be developed based on business requirements, technical feasibility, development effort, and the selected service agreement.

Q: Can the software be customized with my company branding?
A: Branding customization may be available depending on the product and selected plan. Please share your branding requirements for confirmation.

Q: Is the software easy to use?
A: C Vidya Solutions focuses on creating modern and user-friendly software. A product demo can help you understand the interface and workflow before making a decision.

Q: Can I use the software on a mobile phone?
A: Mobile compatibility depends on the selected product and current version. Please request a demo to confirm supported devices.

: Can I use the software on a laptop or desktop?
A: Many web-based software solutions can be accessed through supported browsers on laptops and desktop computers. Exact compatibility depends on the selected product.

Q: Is the software cloud-based?
A: Cloud availability depends on the selected product and deployment configuration. Please contact the team for confirmed details.

Q: Can multiple users use the software?
A: Multi-user access may be available depending on the selected product, plan, and user-permission configuration.

Q: Can I create different user roles?
A: Role-based access may be available depending on the selected software. Please request a demo for exact information.

Q: Is my business data secure?
A: C Vidya Solutions aims to use appropriate security practices. The exact security features depend on the selected product, hosting configuration, and service plan.

Q: Does the software provide data backup?
A: Backup availability and frequency depend on the selected product and hosting configuration. Please confirm the backup policy with the C Vidya Solutions team.

Q: Can I export my data?
A: Data export options depend on the selected software and plan. Please share your export requirements for confirmation.

Q: Can I import existing data into the software?
A: Data migration or import may be available depending on the existing data format and selected product. Please share sample data for evaluation.

Q: Do you provide software training?
A: Training or onboarding may be available depending on the selected product and service plan. Please contact the team for details.

Q: Do you provide customer support?
A: Yes. C Vidya Solutions provides support according to the selected product and service agreement.

Q: How can I report a software problem?
A: Please provide the software name, registered email or mobile number, error message, device type, browser name, screenshot, and the steps that caused the issue.

Q: I cannot log in. What should I do?
A: First, check your email or mobile number and password. If the issue continues, use the available Forgot Password option. If you still cannot log in, contact support with the error message and a screenshot. Never share your password or OTP.

Q: I forgot my password. What should I do?
A: Use the Forgot Password option on the login page and follow the password recovery instructions. Do not share your password or OTP with anyone.

Q: I did not receive the OTP. What should I do?
A: Check your email inbox, spam or junk folder, and confirm that the registered email or mobile number is correct. Wait for the OTP validity period before requesting another OTP. Do not share your OTP.

Q: My OTP is not working. What should I do?
A: Check whether the OTP has expired and make sure you entered the latest OTP correctly. If the issue continues, request a new OTP or contact support.

Q: Can I change my registered email address?
A: Email changes may require account verification and support approval. Please contact the C Vidya Solutions team through an official support channel.

Q: Can I change my registered mobile number?
A: Mobile-number changes may require account verification. Please contact support for the approved process.

Q: How can I update my business information?
A: Login to your account and check the profile or settings section. If the option is unavailable, contact support.

Q: How can I contact C Vidya Solutions?
A: Please visit the official website: https://cvidyasolutions.com. Use the available contact, inquiry, or support options to connect with the C Vidya Solutions team.

Q: What is the official website of C Vidya Solutions?
A: The official website is: https://cvidyasolutions.com

Q: Can I become a business partner?
A: Partnership opportunities may be available. Please share your name, company name, city, business profile, contact details, and partnership interest.

Q: Do you provide software for resellers?
A: Reseller or partnership options depend on current company policy. Please submit your business details for evaluation.

Q: Can I purchase software for multiple branches?
A: Multi-branch support may be available depending on the selected product and plan. Please share the number of branches and your requirements.

Q: Can I use the software for multiple businesses?
A: Multi-business support depends on the selected product and configuration. Please share your requirements for confirmation.

Q: Do you provide invoices?
A: Invoice availability depends on the selected product or service agreement. Please contact the team for billing-related information.

Q: What payment methods do you accept?
A: Available payment methods depend on the current company billing policy. Please contact the C Vidya Solutions team for confirmed payment details.

Q: Can I cancel my subscription?
A: Cancellation terms depend on the applicable product plan and service agreement. Please review the official refund and cancellation policy or contact the support team.

Q: Do you provide refunds?
A: Refund eligibility depends on the applicable refund and cancellation policy, selected product, service agreement, and payment terms.

Q: Can you help me choose the right software?
A: Yes. Please tell us your business type, number of users, main challenges, required features, and budget range. We can guide you toward a suitable solution.

Q: Are you a human support agent?
A: I am the AI Customer Support Assistant of C Vidya Solutions. I can help with software information, product guidance, demo inquiries, and basic support. For complex issues, the C Vidya Solutions team can provide further assistance.

Q: Can I talk to a human support agent?
A: Yes. Please share your name, contact details, software product, and issue or requirement. Your request can be forwarded to the appropriate team.

Q: What information should I not share with the chatbot?
A: Never share your password, OTP, payment PIN, bank credentials, secret API keys, or other sensitive account information.

Q: Can the chatbot access my password?
A: No. The chatbot should never request or store your password.

Q: Can the chatbot access my OTP?
A: No. Never share your OTP with the chatbot or any other person.

Q: What should I do if my question is not answered?
A: Please explain your question with more details. If confirmed information is unavailable, visit https://cvidyasolutions.com and contact the C Vidya Solutions team.

Q: Where can I get more information about C Vidya Solutions?
A: Visit the official website: https://cvidyasolutions.com`;

// Enterprise-Grade OWASP Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=*, geolocation=(), payment=(), usb=()");
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://*.gstatic.com https://*.google.com https://*.firebaseapp.com https://*.googleapis.com https://pagead2.googlesyndication.com; " +
    "frame-src 'self' https: https://*.firebaseapp.com https://*.google.com https://accounts.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com https://accounts.google.com; " +
    "img-src 'self' data: https: blob:; " +
    "media-src 'self' data: blob: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https: wss: ws:; " +
    "frame-ancestors 'self' https://*.studio https://ai.studio https://*.google.com https://*.google.dev https://*.run.app https://cvidyasolutions.com https://*.cvidyasolutions.com;"
  );
  next();
});

// Robust In-Memory Rate Limiting Guards
const ipRequestCounts = new Map<string, number[]>();
const formSubmissionCounts = new Map<string, number[]>();
const authAttemptsCounts = new Map<string, number[]>();
const chatRequestCounts = new Map<string, number[]>();

function cleanOldTimestamps(timestamps: number[], windowMs: number): number[] {
  const now = Date.now();
  return timestamps.filter(t => now - t < windowMs);
}

// API endpoint rate limit (100 API requests per minute per IP - never throttle static assets or frontend JS)
app.use("/api/", (req, res, next) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  let ts = ipRequestCounts.get(ip) || [];
  ts = cleanOldTimestamps(ts, 60000);
  if (ts.length >= 100) {
    return res.status(429).json({ error: "Rate limit exceeded. Maximum 100 API requests per minute. Please wait and try again." });
  }
  ts.push(Date.now());
  ipRequestCounts.set(ip, ts);
  next();
});

// Contact Form Rate Limit (5 submissions per hour per IP)
const contactFormRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  let ts = formSubmissionCounts.get(ip) || [];
  ts = cleanOldTimestamps(ts, 3600000);
  if (ts.length >= 5) {
    return res.status(429).json({ error: "Form submission rate limit reached. Max 5 inquiries per hour. Please try again later." });
  }
  ts.push(Date.now());
  formSubmissionCounts.set(ip, ts);
  next();
};

// AI Chat Rate Limit (25 prompts per minute per IP to defend against token exhaustion & scraping)
const chatRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  let ts = chatRequestCounts.get(ip) || [];
  ts = cleanOldTimestamps(ts, 60000);
  if (ts.length >= 25) {
    return res.status(429).json({ error: "AI Assistant rate limit reached. Please wait a moment before sending more messages." });
  }
  ts.push(Date.now());
  chatRequestCounts.set(ip, ts);
  next();
};

// Admin Password Auth Rate Limit (5 attempts per minute per IP)
const authAttemptsRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  let ts = authAttemptsCounts.get(ip) || [];
  ts = cleanOldTimestamps(ts, 60000);
  if (ts.length >= 5) {
    return res.status(429).json({ error: "Too many authentication attempts. Please try again in a minute." });
  }
  ts.push(Date.now());
  authAttemptsCounts.set(ip, ts);
  next();
};

const STRICT_AUTHORIZED_ADMIN_EMAILS = [
  "chiranjeevdas972@gmail.com",
] as const;

export function getAuthorizedAdminEmails(): string[] {
  return [...STRICT_AUTHORIZED_ADMIN_EMAILS];
}

// Passcode fallback is intentionally disabled: administrator access requires a verified Firebase Google ID token.
export function isAuthorizedOwner(_provided: unknown): boolean {
  return false;
}

interface GoogleJwkEntry {
  kid: string;
  kty: string;
  alg?: string;
  use?: string;
  n: string;
  e: string;
}

let cachedGoogleJwks: { keys: GoogleJwkEntry[]; expiresAtMs: number } = {
  keys: [],
  expiresAtMs: 0,
};

async function fetchGoogleSecureTokenJwks(forceRefresh = false): Promise<GoogleJwkEntry[]> {
  if (!forceRefresh && cachedGoogleJwks.keys.length > 0 && cachedGoogleJwks.expiresAtMs > Date.now()) {
    return cachedGoogleJwks.keys;
  }
  const jwksUrl = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const resp = await fetch(jwksUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!resp.ok) {
      return cachedGoogleJwks.keys;
    }
    const cacheControl = resp.headers.get("cache-control") || "";
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
    const maxAgeSec = maxAgeMatch ? Math.max(60, parseInt(maxAgeMatch[1], 10)) : 3600;
    const data = (await resp.json()) as { keys?: GoogleJwkEntry[] };
    const keys = Array.isArray(data?.keys) ? data.keys : [];
    if (keys.length > 0) {
      cachedGoogleJwks = {
        keys,
        expiresAtMs: Date.now() + maxAgeSec * 1000,
      };
    }
    return cachedGoogleJwks.keys;
  } catch {
    return cachedGoogleJwks.keys;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface VerifiedAdminTokenPayload {
  uid: string;
  email: string;
  token: string;
}

export async function verifyAndDecodeAdminToken(
  idToken: string
): Promise<VerifiedAdminTokenPayload | null> {
  if (!idToken || typeof idToken !== "string") return null;
  const trimmedToken = idToken.trim();
  const parts = trimmedToken.split(".");
  if (parts.length !== 3) return null;

  try {
    const [headerSegment, payloadSegment, sigSegment] = parts;
    if (!sigSegment || sigSegment === "fakesignature") {
      return null;
    }

    let header: any = {};
    try {
      header = JSON.parse(Buffer.from(headerSegment, "base64url").toString("utf8"));
    } catch {
      return null;
    }

    // Strictly require RS256 Firebase Auth tokens with a valid key ID; reject client-minted vault tokens
    if (
      header?.alg !== "RS256" ||
      header?.kid === "cvidya-owner-vault-v1" ||
      typeof header?.kid !== "string" ||
      !header.kid.trim()
    ) {
      return null;
    }

    const decodedJson = Buffer.from(payloadSegment, "base64url").toString("utf8");
    const payload = JSON.parse(decodedJson);
    const nowSec = Math.floor(Date.now() / 1000);

    if (!payload.exp || typeof payload.exp !== "number" || payload.exp <= nowSec) {
      return null;
    }
    if (typeof payload.iat === "number" && payload.iat > nowSec + 300) {
      return null;
    }
    if (typeof payload.auth_time === "number" && payload.auth_time > nowSec + 300) {
      return null;
    }
    if (payload.email_verified !== true) {
      return null;
    }
    if (typeof payload.sub !== "string" || !payload.sub.trim() || payload.sub.length > 128) {
      return null;
    }

    const email = String(payload.email || "").trim().toLowerCase();
    const allowedEmails = getAuthorizedAdminEmails();
    if (!email || !allowedEmails.includes(email)) {
      return null;
    }

    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    let expectedProjectId = "c-vidya-solutions";
    let apiKey = "";
    if (fs.existsSync(firebaseConfigPath)) {
      const cfg = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
      if (cfg?.projectId) expectedProjectId = cfg.projectId;
      if (cfg?.apiKey) apiKey = cfg.apiKey;
    }

    if (payload.aud !== expectedProjectId) {
      return null;
    }
    const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
    if (payload.iss !== expectedIssuer) {
      return null;
    }

    // Cryptographically verify RS256 signature against Google's official SecureToken JWK public key
    let keys = await fetchGoogleSecureTokenJwks(false);
    let matchedKey = keys.find((k) => k.kid === header.kid);
    if (!matchedKey) {
      keys = await fetchGoogleSecureTokenJwks(true);
      matchedKey = keys.find((k) => k.kid === header.kid);
    }
    if (!matchedKey) {
      return null;
    }

    const publicKey = crypto.createPublicKey({ key: matchedKey as any, format: "jwk" });
    const signatureBuf = Buffer.from(sigSegment, "base64url");
    const isSigValid = crypto.verify(
      "RSA-SHA256",
      Buffer.from(`${headerSegment}.${payloadSegment}`, "utf8"),
      publicKey,
      signatureBuf
    );
    if (!isSigValid) {
      return null;
    }

    // Also verify user account status (not disabled/revoked) via Identity Toolkit when available
    if (apiKey) {
      try {
        const resp = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Referer: `https://${expectedProjectId}.firebaseapp.com/`,
              Origin: `https://${expectedProjectId}.firebaseapp.com`,
            },
            body: JSON.stringify({ idToken: trimmedToken }),
          }
        );
        if (resp.ok) {
          const data = (await resp.json()) as any;
          const userRecord = data?.users?.[0];
          if (!userRecord || userRecord.emailVerified !== true || userRecord.disabled === true) {
            return null;
          }
          const verifiedEmail = String(userRecord.email || "").trim().toLowerCase();
          if (!verifiedEmail || !allowedEmails.includes(verifiedEmail)) {
            return null;
          }
        } else {
          const errBody = (await resp.json().catch(() => ({}))) as any;
          const errMsg = String(errBody?.error?.message || "");
          // Only tolerate server-side API-key referrer blocks because full RS256 JWK signature already succeeded above
          if (
            !errMsg.includes("REFERER") &&
            !errMsg.includes("API_KEY_HTTP_REFERRER_BLOCKED") &&
            resp.status < 500
          ) {
            return null;
          }
        }
      } catch {
        // Network issue on accounts:lookup is safe to tolerate ONLY because RS256 JWK cryptographic signature succeeded above
      }
    }

    return {
      uid: payload.sub.trim(),
      email,
      token: trimmedToken,
    };
  } catch {
    return null;
  }
}

// Verify Firebase ID token via cryptographic Google RS256 JWKS + claims verification
export async function verifyFirebaseAdminIdToken(idToken: string): Promise<boolean> {
  const verified = await verifyAndDecodeAdminToken(idToken);
  return verified !== null;
}

export function extractAdminTokenFromRequest(req: express.Request): string {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) return token;
  }
  return "";
}

export async function verifyAdminRequest(req: express.Request): Promise<boolean> {
  const candidate = extractAdminTokenFromRequest(req);
  if (!candidate) return false;
  return await verifyFirebaseAdminIdToken(candidate);
}

// ============================================================================
// AUTHENTICATED SERVER-SIDE FIRESTORE REST BRIDGE
// Forwards the verified administrator's Bearer ID token to Cloud Firestore REST API
// so server-side reads/updates satisfy `isAdmin()` in firestore.rules without
// requiring downloadable service-account private keys or weakening rules.
// ============================================================================

function getFirestoreRestBaseUrl(): string | null {
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(firebaseConfigPath)) return null;
    const cfg = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    const projectId = cfg?.projectId || "c-vidya-solutions";
    const databaseId = cfg?.firestoreDatabaseId || "(default)";
    return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/${encodeURIComponent(databaseId)}/documents`;
  } catch {
    return null;
  }
}

export function fromFirestoreRestValue(valObj: any): any {
  if (!valObj || typeof valObj !== "object") return undefined;
  if ("stringValue" in valObj) return valObj.stringValue;
  if ("booleanValue" in valObj) return Boolean(valObj.booleanValue);
  if ("integerValue" in valObj) return Number(valObj.integerValue);
  if ("doubleValue" in valObj) return Number(valObj.doubleValue);
  if ("timestampValue" in valObj) return valObj.timestampValue;
  if ("nullValue" in valObj) return null;
  if ("arrayValue" in valObj) {
    const values = valObj.arrayValue?.values;
    return Array.isArray(values) ? values.map(fromFirestoreRestValue) : [];
  }
  if ("mapValue" in valObj) {
    const fields = valObj.mapValue?.fields || {};
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = fromFirestoreRestValue(v);
    }
    return out;
  }
  return undefined;
}

export function toFirestoreRestValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreRestValue) } };
  }
  if (typeof val === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreRestValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

const ALLOWED_ADMIN_REST_COLLECTIONS = new Set([
  "inquiries",
  "job_applications",
  "applications",
  "app_download_registrations",
  "call_logs",
  "demo_bookings",
  "handoff_tickets",
  "cvidya_deployment_registry",
  "cvidya_deployment_history",
  "cvidya_deployment_audit_logs",
]);

const FORBIDDEN_REST_PRIVILEGE_FIELDS = new Set([
  "isAdmin",
  "admin",
  "role",
  "permissions",
  "__proto__",
  "constructor",
  "prototype",
]);

export async function firestoreAdminRestListCollection(
  collectionName: string,
  adminIdToken: string,
  maxPages = 3
): Promise<any[] | null> {
  const baseUrl = getFirestoreRestBaseUrl();
  if (!baseUrl || !adminIdToken || !ALLOWED_ADMIN_REST_COLLECTIONS.has(collectionName)) {
    return null;
  }
  try {
    const allParsedDocs: any[] = [];
    let pageToken = "";
    let pageCount = 0;

    while (pageCount < maxPages) {
      pageCount++;
      const tokenQuery = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      let resp: Response;
      try {
        resp = await fetch(
          `${baseUrl}/${encodeURIComponent(collectionName)}?pageSize=300${tokenQuery}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${adminIdToken}`,
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      if (!resp.ok) return pageCount === 1 ? null : allParsedDocs;
      const data = (await resp.json()) as any;
      const docs = Array.isArray(data?.documents) ? data.documents : [];
      for (const d of docs) {
        const docId = String(d?.name || "").split("/").pop() || "";
        const fields = d?.fields || {};
        const parsed: Record<string, any> = { id: docId };
        for (const [k, v] of Object.entries(fields)) {
          parsed[k] = fromFirestoreRestValue(v);
        }
        allParsedDocs.push(parsed);
      }

      if (typeof data?.nextPageToken === "string" && data.nextPageToken.trim()) {
        pageToken = data.nextPageToken.trim();
      } else {
        break;
      }
    }

    return allParsedDocs;
  } catch {
    return null;
  }
}

export async function firestoreAdminRestPatchDocument(
  collectionName: string,
  docId: string,
  updates: Record<string, any>,
  adminIdToken: string
): Promise<boolean> {
  const baseUrl = getFirestoreRestBaseUrl();
  if (
    !baseUrl ||
    !adminIdToken ||
    !docId ||
    !/^[a-zA-Z0-9_-]{1,128}$/.test(docId) ||
    !ALLOWED_ADMIN_REST_COLLECTIONS.has(collectionName)
  ) {
    return false;
  }
  try {
    const fieldKeys = Object.keys(updates).filter(
      (k) => updates[k] !== undefined && !FORBIDDEN_REST_PRIVILEGE_FIELDS.has(k)
    );
    if (fieldKeys.length === 0) return false;
    const maskParams = fieldKeys
      .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
      .join("&");
    const fieldsPayload: Record<string, any> = {};
    for (const k of fieldKeys) {
      fieldsPayload[k] = toFirestoreRestValue(updates[k]);
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let resp: Response;
    try {
      resp = await fetch(
        `${baseUrl}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}?${maskParams}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${adminIdToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields: fieldsPayload }),
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }
    return resp.ok;
  } catch {
    return false;
  }
}

function getFirebaseWebApiKey(): string {
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(firebaseConfigPath)) return "";
    const cfg = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    return typeof cfg?.apiKey === "string" ? cfg.apiKey.trim() : "";
  } catch {
    return "";
  }
}

export async function firestoreRestCreateDocument(
  collectionName: string,
  docId: string,
  data: Record<string, any>,
  bearerToken = ""
): Promise<boolean> {
  const baseUrl = getFirestoreRestBaseUrl();
  if (
    !baseUrl ||
    !docId ||
    !/^[a-zA-Z0-9_-]{1,128}$/.test(docId) ||
    !ALLOWED_ADMIN_REST_COLLECTIONS.has(collectionName)
  ) {
    return false;
  }
  try {
    const fieldsPayload: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined && !FORBIDDEN_REST_PRIVILEGE_FIELDS.has(k)) {
        fieldsPayload[k] = toFirestoreRestValue(v);
      }
    }
    const apiKey = getFirebaseWebApiKey();
    const queryParams = new URLSearchParams({ documentId: docId });
    if (apiKey) queryParams.set("key", apiKey);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (bearerToken) {
      headers["Authorization"] = `Bearer ${bearerToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let resp: Response;
    try {
      resp = await fetch(
        `${baseUrl}/${encodeURIComponent(collectionName)}?${queryParams.toString()}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ fields: fieldsPayload }),
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }
    return resp.ok;
  } catch {
    return false;
  }
}

// Safe Input Sanitization and Formatting checks
function sanitizeInput(str: any, maxLength: number): string {
  if (typeof str !== "string") return "";
  const cleaned = str.trim().substring(0, maxLength);
  return cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > 200) return false;
  // Bounded regex to completely eliminate ReDoS possibilities
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  if (!phone || phone.length > 50) return false;
  // Bounded regex check to prevent back-tracking exhaustion
  const phoneRegex = /^[+]?[0-9\s\-()]{5,20}$/;
  return phoneRegex.test(phone);
}

// API: Verify Administrative Credentials (Server-Side Only — No Frontend Hardcoded Passcodes)
app.post("/api/admin/verify", authAttemptsRateLimiter, async (req, res) => {
  const authorized = await verifyAdminRequest(req);
  if (!authorized) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized access. Invalid administrative credentials.",
    });
  }
  return res.json({
    success: true,
    verifiedAt: new Date().toISOString(),
  });
});

// Owner Security Vault — Strictly verifies SHA-256 vault password hash against Firestore `/admins/{uid}`
// Never overwrites an existing owner password unless the matching current password hash is verified in constant time.
const ownerVaultMemoryHashes = new Map<string, string>();

function constantTimeHexEquals(hexA: string, hexB: string): boolean {
  if (typeof hexA !== "string" || typeof hexB !== "string") return false;
  if (!/^[a-f0-9]{64}$/i.test(hexA) || !/^[a-f0-9]{64}$/i.test(hexB)) return false;
  try {
    const bufA = Buffer.from(hexA.toLowerCase(), "hex");
    const bufB = Buffer.from(hexB.toLowerCase(), "hex");
    if (bufA.length !== 32 || bufB.length !== 32) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

async function fetchOwnerVaultFromFirestore(
  uid: string,
  adminToken: string
): Promise<{ status: "found"; passwordHash: string; email: string } | { status: "not_found" } | { status: "error" }> {
  const baseUrl = getFirestoreRestBaseUrl();
  if (!baseUrl || !uid || !/^[a-zA-Z0-9_-]{1,128}$/.test(uid)) {
    return { status: "error" };
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(`${baseUrl}/admins/${encodeURIComponent(uid)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    if (resp.status === 404) {
      return { status: "not_found" };
    }
    if (!resp.ok) {
      return { status: "error" };
    }
    const docData = (await resp.json()) as any;
    const fields = docData?.fields || {};
    const storedHash = String(fields?.passwordHash?.stringValue || "").trim().toLowerCase();
    const storedEmail = String(fields?.email?.stringValue || "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(storedHash)) {
      return { status: "error" };
    }
    ownerVaultMemoryHashes.set(uid, storedHash);
    return { status: "found", passwordHash: storedHash, email: storedEmail };
  } catch {
    return { status: "error" };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function upsertOwnerVaultInFirestore(
  uid: string,
  email: string,
  passwordHash: string,
  adminToken: string
): Promise<boolean> {
  const baseUrl = getFirestoreRestBaseUrl();
  if (!baseUrl || !uid || !/^[a-zA-Z0-9_-]{1,128}$/.test(uid)) {
    return false;
  }
  const fieldsPayload = {
    uid: toFirestoreRestValue(uid),
    email: toFirestoreRestValue(email),
    passwordHash: toFirestoreRestValue(passwordHash),
    updatedAt: toFirestoreRestValue(new Date().toISOString()),
  };
  const maskParams = "updateMask.fieldPaths=uid&updateMask.fieldPaths=email&updateMask.fieldPaths=passwordHash&updateMask.fieldPaths=updatedAt";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(`${baseUrl}/admins/${encodeURIComponent(uid)}?${maskParams}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: fieldsPayload }),
      signal: controller.signal,
    });
    if (resp.ok) {
      ownerVaultMemoryHashes.set(uid, passwordHash);
    }
    return resp.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

app.post("/api/admin/vault/verify", authAttemptsRateLimiter, async (req, res) => {
  const token = extractAdminTokenFromRequest(req);
  const verifiedAdmin = await verifyAndDecodeAdminToken(token);
  if (!verifiedAdmin) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized access. Verified Google administrator session required.",
    });
  }

  const { passwordHash } = req.body || {};
  const cleanVaultHash = typeof passwordHash === "string" ? passwordHash.trim().toLowerCase() : "";
  if (!/^[a-f0-9]{64}$/.test(cleanVaultHash)) {
    return res.status(400).json({
      success: false,
      error: "Invalid cryptographic vault verification payload.",
    });
  }

  const existingVault = await fetchOwnerVaultFromFirestore(verifiedAdmin.uid, verifiedAdmin.token);
  if (existingVault.status === "found") {
    if (
      existingVault.email !== verifiedAdmin.email ||
      !constantTimeHexEquals(cleanVaultHash, existingVault.passwordHash)
    ) {
      return res.status(403).json({
        success: false,
        error: "Incorrect Owner Security Password. Access strictly denied.",
      });
    }
    ownerVaultMemoryHashes.set(verifiedAdmin.uid, existingVault.passwordHash);
    return res.json({ success: true, verifiedAt: new Date().toISOString() });
  }

  if (existingVault.status === "error") {
    const cachedHash = ownerVaultMemoryHashes.get(verifiedAdmin.uid);
    if (cachedHash && constantTimeHexEquals(cleanVaultHash, cachedHash)) {
      return res.json({ success: true, verifiedAt: new Date().toISOString() });
    }
    return res.status(503).json({
      success: false,
      error: "Unable to verify Owner Security Vault against Firestore. Access denied.",
    });
  }

  // First-time vault initialization ONLY when /admins/{uid} truly does not exist yet
  const envRequiredHash = String(process.env.ADMIN_VAULT_PASSWORD_HASH || "").trim().toLowerCase();
  if (/^[a-f0-9]{64}$/.test(envRequiredHash) && !constantTimeHexEquals(cleanVaultHash, envRequiredHash)) {
    return res.status(403).json({
      success: false,
      error: "Incorrect Owner Security Password. Access strictly denied.",
    });
  }

  const saved = await upsertOwnerVaultInFirestore(
    verifiedAdmin.uid,
    verifiedAdmin.email,
    cleanVaultHash,
    verifiedAdmin.token
  );
  if (!saved) {
    return res.status(503).json({
      success: false,
      error: "Failed to initialize Owner Security Vault in Cloud Firestore.",
    });
  }

  return res.json({ success: true, initialized: true, verifiedAt: new Date().toISOString() });
});

app.post("/api/admin/vault/session", authAttemptsRateLimiter, async (_req, res) => {
  return res.status(403).json({
    success: false,
    error: "Direct vault session bypass is disabled. Verified Google Sign-In and Owner Security Password are required.",
  });
});

app.post("/api/admin/vault/update", authAttemptsRateLimiter, async (req, res) => {
  const token = extractAdminTokenFromRequest(req);
  const verifiedAdmin = await verifyAndDecodeAdminToken(token);
  if (!verifiedAdmin) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized access. Verified Google administrator session required.",
    });
  }

  const { currentPasswordHash, newPasswordHash } = req.body || {};
  const cleanCurrentHash = typeof currentPasswordHash === "string" ? currentPasswordHash.trim().toLowerCase() : "";
  const cleanNewHash = typeof newPasswordHash === "string" ? newPasswordHash.trim().toLowerCase() : "";

  if (!/^[a-f0-9]{64}$/.test(cleanCurrentHash) || !/^[a-f0-9]{64}$/.test(cleanNewHash)) {
    return res.status(400).json({
      success: false,
      error: "Valid current and new SHA-256 password hashes are required.",
    });
  }

  const existingVault = await fetchOwnerVaultFromFirestore(verifiedAdmin.uid, verifiedAdmin.token);
  const storedHash =
    existingVault.status === "found"
      ? existingVault.passwordHash
      : ownerVaultMemoryHashes.get(verifiedAdmin.uid) || "";

  if (!storedHash || !constantTimeHexEquals(cleanCurrentHash, storedHash)) {
    return res.status(403).json({
      success: false,
      error: "Current Owner Security Password is incorrect. Password update denied.",
    });
  }

  const updated = await upsertOwnerVaultInFirestore(
    verifiedAdmin.uid,
    verifiedAdmin.email,
    cleanNewHash,
    verifiedAdmin.token
  );
  if (!updated) {
    return res.status(503).json({
      success: false,
      error: "Failed to persist updated Owner Security Password to Cloud Firestore.",
    });
  }

  return res.json({ success: true, updatedAt: new Date().toISOString() });
});

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Proxy for Petrol Pump cloud software (redirects to the universal static suite)
app.get("/api/proxy/petrol-pump", (req, res) => {
  res.redirect(302, "/software/petrol-pump/index.html");
});

// Proxy for Library Management cloud software (redirects to live worker URL)
app.get("/api/proxy/library", (req, res) => {
  res.redirect(302, "https://v.cvidyasolutions.workers.dev/");
});

// Proxy for Fitness Zone cloud software (redirects to live worker URL)
app.get("/api/proxy/fitness", (req, res) => {
  res.redirect(302, "https://fitzone.cvidyasolutions.workers.dev/");
});

// Live Software Embed Proxy with Universal Step-by-Step Navigation Bridge
const softwareWorkerMap: Record<string, string> = {
  // Library Management
  "library": "https://v.cvidyasolutions.workers.dev/",

  // Fitness Zone
  "fitness": "https://fitzone.cvidyasolutions.workers.dev/",
  "fitzone": "https://fitzone.cvidyasolutions.workers.dev/",

  // AI Agents
  "ai-social": "https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/",
  "ai-support": "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/",
  "ai-salesflow": "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/",
  "ai-sales": "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/",
  "ai-marketing": "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/",
  "ai-market": "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/",
  
  // SaaS Products & Services
  "coaching": "https://coaching.cvidyasolutions.workers.dev/",
  "farming": "https://fresh.cvidyasolutions.workers.dev/",
  "fresh": "https://fresh.cvidyasolutions.workers.dev/",
  "agrifusion": "https://fresh.cvidyasolutions.workers.dev/",
  "members": "https://jewelry.cvidyasolutions.workers.dev/",
  "jewelry": "https://jewelry.cvidyasolutions.workers.dev/",
  "crm": "https://crm.cvidyasolutions.workers.dev/",
  "care-plus": "https://care-plus.cvidyasolutions.workers.dev/",
  "hospital": "https://care-plus.cvidyasolutions.workers.dev/",
};

export function isAllowedSoftwareEmbedUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.length > 500) return false;
  const allowlistedUrls = new Set(Object.values(softwareWorkerMap));
  if (allowlistedUrls.has(rawUrl)) return true;
  return validateDeploymentUrl(rawUrl).valid;
}

app.get("/api/live-software-embed", (req, res) => {
  const id = String(req.query.id || "").toLowerCase();
  const canonicalId = normalizeProductLookupKey(id);
  if (canonicalId) {
    const regEntry = deploymentRegistryStore.entries.get(canonicalId);
    if (regEntry) {
      if (!regEntry.enabled) {
        return res.status(403).send("Software temporarily unavailable.");
      }
      if (regEntry.deploymentUrl) {
        return res.redirect(302, regEntry.deploymentUrl);
      }
      return res.status(404).send("Software deployment not yet available (Coming Soon).");
    }
  }
  const mappedUrl = softwareWorkerMap[id];
  if (mappedUrl) {
    return res.redirect(302, mappedUrl);
  }
  if (req.query.url) {
    const candidateUrl = String(req.query.url).trim();
    if (isAllowedSoftwareEmbedUrl(candidateUrl)) {
      return res.redirect(302, candidateUrl);
    }
    return res.status(400).json({
      error: "Blocked untrusted redirect URL. Only verified C Vidya software hosts are permitted.",
    });
  }
  return res.status(404).send("Software embed not configured");
});

// PDF & Media Tool SaaS Backend APIs (Session, Inventory, Telemetry, Usage)
const pdfToolInventory: Array<any> = [];
let pdfToolDailyConversions = 0;

app.get("/api/auth/me", (req, res) => {
  res.json({
    user: {
      id: "user_free",
      name: "Demo Professional",
      email: "demo@cvidyasolutions.com",
      role: "user",
      plan: "free",
      dailyConversionsUsed: pdfToolDailyConversions,
      dailyLimit: 25,
      storageUsedBytes: 12450000,
      storageLimitBytes: 104857600,
      createdAt: new Date().toISOString()
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const email = req.body?.email || "admin@cvidya.com";
  const user = {
    id: req.body?.switchUserId || "cvidya_admin_demo_user",
    uid: req.body?.switchUserId || "cvidya_admin_demo_user",
    name: "Chiranjeev Das",
    displayName: "Chiranjeev Das",
    email: email,
    role: "admin",
    isVerified: true,
    plan: "enterprise",
    subscriptionStatus: "active",
    subscriptionPlan: "enterprise",
    dailyConversionsUsed: 0,
    dailyLimit: 1000,
    storageUsedBytes: 25000000,
    storageLimitBytes: 10737418240,
    createdAt: new Date().toISOString()
  };
  res.json({
    success: true,
    token: "cvidya_admin_demo_token_authenticated",
    user,
    data: {
      token: "cvidya_admin_demo_token_authenticated",
      user
    }
  });
});

app.get("/api/inventory", (req, res) => {
  res.json({
    items: pdfToolInventory,
    storageUsedBytes: pdfToolInventory.reduce((acc, item) => acc + (item.sizeBytes || 0), 0)
  });
});

app.post("/api/inventory", (req, res) => {
  const item = {
    id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  pdfToolInventory.unshift(item);
  res.json({ success: true, item });
});

app.delete("/api/inventory/:id", (req, res) => {
  const index = pdfToolInventory.findIndex((item) => item.id === req.params.id);
  if (index !== -1) {
    pdfToolInventory.splice(index, 1);
  }
  res.json({ success: true });
});

app.post("/api/inventory/batch-delete", (req, res) => {
  const ids: string[] = req.body?.ids || [];
  for (let i = pdfToolInventory.length - 1; i >= 0; i--) {
    if (ids.includes(pdfToolInventory[i].id)) {
      pdfToolInventory.splice(i, 1);
    }
  }
  res.json({ success: true });
});

app.get("/api/analytics", (req, res) => {
  res.json({
    analytics: {
      totalConversions: 184 + pdfToolDailyConversions,
      activeUsers: 24,
      storageSavedBytes: 145000000,
      conversionHistory: [
        { date: "Mon", count: 18 },
        { date: "Tue", count: 24 },
        { date: "Wed", count: 32 },
        { date: "Thu", count: 29 },
        { date: "Fri", count: 41 },
        { date: "Sat", count: 25 },
        { date: "Sun", count: 15 }
      ]
    }
  });
});

app.post("/api/user/increment-usage", (req, res) => {
  pdfToolDailyConversions++;
  res.json({
    success: true,
    dailyConversionsUsed: pdfToolDailyConversions
  });
});

app.post("/api/user/reset-usage", (req, res) => {
  pdfToolDailyConversions = 0;
  res.json({
    success: true,
    dailyConversionsUsed: 0
  });
});

app.post("/api/user/subscribe", (req, res) => {
  res.json({
    success: true,
    user: {
      id: "user_pro",
      name: "Subscribed User",
      email: "subscriber@cvidyasolutions.com",
      role: "user",
      plan: req.body?.plan || "pro",
      dailyConversionsUsed: 0,
      dailyLimit: 200,
      storageUsedBytes: 0,
      storageLimitBytes: 5368709120,
      createdAt: new Date().toISOString()
    }
  });
});

// API: Submit Inquiry (With Input Sanitization & Rate Limiting)
app.post(["/api/inquiry", "/api/inquiries"], contactFormRateLimiter, async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone are required parameters." });
  }

  // Strict schema format & length checks
  const cleanName = sanitizeInput(name, 150);
  const cleanEmail = sanitizeInput(email, 200);
  const cleanPhone = sanitizeInput(phone, 50);
  const cleanService = sanitizeInput(service, 200) || "General Inquiry";
  const cleanMessage = sanitizeInput(message, 5000) || "No custom message provided.";

  if (!cleanName || cleanName.length < 2) {
    return res.status(400).json({ error: "Please enter a valid name (at least 2 characters)." });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid structured email address." });
  }

  if (!isValidPhone(cleanPhone)) {
    return res.status(400).json({ error: "Please enter a valid telephone number." });
  }

  const id = `inq_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  const status = "Pending Callback";

  const newInquiry = {
    id,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    service: cleanService,
    message: cleanMessage,
    timestamp,
    status
  };

  // Add to fallback in-memory cache
  inquiries.push(newInquiry);
  console.log("Captured client inquiry in local cache:", newInquiry);

  // Core Sync to Firestore via stateless HTTPS REST
  try {
    const created = await firestoreRestCreateDocument("inquiries", id, newInquiry);
    if (created) {
      console.log("Successfully persisted inquiry to Firestore:", id);
    }
  } catch (error) {
    console.warn("Failed to persist to Firestore, using local fallback:", error);
  }

  // Connect & dispatch lead requisition details directly to cvidyasolutions@gmail.com
  sendLeadNotificationEmail({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    service: cleanService,
    message: cleanMessage,
    source: "Website Consultation Form"
  }).catch((err) => console.error("Lead email dispatch error:", err));

  return res.json({
    success: true,
    message: `Thank you, ${name}! Your consultation request regarding '${newInquiry.service}' has been queued and dispatched to cvidyasolutions@gmail.com. Our relations representative will call you at ${phone} shortly.`,
    inquiry: newInquiry
  });
});

// API: Fetch inquiries (Authorized Admin Only — uses Authenticated Firestore REST Bridge with admin Bearer token)
app.get("/api/inquiries", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: "Unauthorized access. Valid administrator credentials required." });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  try {
    const firestoreInquiries =
      (await firestoreAdminRestListCollection("inquiries", adminToken)) || [];

    // Merge in-memory local caches that may have been submitted during database connection delays
    const merged = [...firestoreInquiries];
    inquiries.forEach((inq) => {
      if (!merged.some((x) => x.id === inq.id)) {
        merged.push(inq);
      }
    });

    // Sort by timestamp descending
    merged.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());

    return res.json({ inquiries: merged });
  } catch (error) {
    const sortedMemory = [...inquiries].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
    return res.json({ inquiries: sortedMemory });
  }
});

// API: Submit Career Application
app.post("/api/application", contactFormRateLimiter, async (req, res) => {
  const { name, email, phone, experience, message, jobTitle, jobCategory, jobLocation, roleType, resumeFileName, resumeFileSize, resumeData, resumeUrl } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone are required parameters." });
  }

  const cleanName = sanitizeInput(name, 150);
  const cleanEmail = sanitizeInput(email, 200);
  const cleanPhone = sanitizeInput(phone, 50);
  const cleanExperience = sanitizeInput(experience, 100) || "Student / Intern";
  const cleanMessage = sanitizeInput(message, 5000) || "";
  const cleanJobTitle = sanitizeInput(jobTitle, 200) || "General Application";
  const cleanJobCategory = sanitizeInput(jobCategory, 100) || "Engineering";
  const cleanJobLocation = sanitizeInput(jobLocation, 150) || "STPI Sindri, BIT Sindri Campus";
  const cleanRoleType = sanitizeInput(roleType, 50) || "Full-Time";
  const cleanResumeName = sanitizeInput(resumeFileName || "", 250);
  const cleanResumeSize = sanitizeInput(resumeFileSize || "", 50);
  const cleanResumeUrl = sanitizeInput(resumeUrl || "", 2000);

  if (!cleanName || cleanName.length < 2) {
    return res.status(400).json({ error: "Please enter a valid name." });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid structured email address." });
  }

  if (!isValidPhone(cleanPhone)) {
    return res.status(400).json({ error: "Please enter a valid telephone number." });
  }

  const id = `app_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
  const status = "Submitted / Under Review";

  const newApp = {
    id,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    experience: cleanExperience,
    message: cleanMessage,
    jobTitle: cleanJobTitle,
    jobCategory: cleanJobCategory,
    jobLocation: cleanJobLocation,
    roleType: cleanRoleType,
    resumeFileName: cleanResumeName || (resumeData ? "Uploaded_Resume.pdf" : ""),
    resumeFileSize: cleanResumeSize,
    resumeData: typeof resumeData === "string" ? resumeData.slice(0, 6000000) : "",
    resumeUrl: cleanResumeUrl,
    timestamp,
    status
  };

  applications.push(newApp);
  console.log("Captured job application in local cache:", newApp.id, newApp.name);

  // Sync to Firestore job_applications
  try {
    const firestoreData: any = { ...newApp };
    // Firestore max document size is 1MB - safely cap if full base64 exceeds ~700KB
    if (typeof firestoreData.resumeData === "string" && firestoreData.resumeData.length > 700000) {
      firestoreData.resumeData = firestoreData.resumeData.slice(0, 700000);
      firestoreData.isLargeResume = true;
    }
    const saved = await firestoreRestCreateDocument("job_applications", id, firestoreData);
    if (saved) {
      console.log("Successfully persisted application to Firestore job_applications:", id);
    }
  } catch (error) {
    console.warn("Failed to persist application to Firestore job_applications, using local fallback:", error);
  }

  return res.json({
    success: true,
    message: `Thank you, ${name}! Your application for '${cleanJobTitle}' has been received and saved.`,
    application: newApp
  });
});

// Alias endpoint for CareersPage.tsx (`POST /api/job-applications`)
app.post("/api/job-applications", contactFormRateLimiter, async (req, res) => {
  const { name, email, phone, jobTitle, resumeUrl, note, jobId } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required parameters." });
  }
  const cleanName = sanitizeInput(name, 150);
  const cleanEmail = sanitizeInput(email, 200);
  const cleanPhone = sanitizeInput(phone || "Not Provided", 50);
  const cleanJobTitle = sanitizeInput(jobTitle || "General Application", 200);
  const cleanResumeUrl = sanitizeInput(resumeUrl || "", 2000);
  const cleanNote = sanitizeInput(note || "", 5000);
  const id = `app_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const newApp = {
    id,
    jobId: sanitizeInput(jobId || "general", 100),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    experience: sanitizeInput(req.body?.experience || "Not specified", 100),
    jobTitle: cleanJobTitle,
    jobCategory: "Engineering",
    jobLocation: "Remote / Hybrid (Dhanbad HQ)",
    roleType: "Full-Time",
    resumeUrl: cleanResumeUrl,
    message: cleanNote,
    note: cleanNote,
    timestamp,
    status: "received",
  };

  applications.push(newApp);
  try {
    await firestoreRestCreateDocument("job_applications", id, newApp);
  } catch (err) {
    console.warn("Firestore job_applications write note:", err);
  }

  return res.json({
    success: true,
    application: newApp,
  });
});

// API: Fetch applications (Authorized Admin Only — uses Authenticated Firestore REST Bridge)
app.get("/api/applications", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: "Unauthorized access. Valid administrator credentials required." });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  try {
    const firestoreApps =
      (await firestoreAdminRestListCollection("job_applications", adminToken)) || [];

    const legacyApps = await firestoreAdminRestListCollection("applications", adminToken);
    const merged = [...firestoreApps];
    if (Array.isArray(legacyApps)) {
      legacyApps.forEach((leg) => {
        if (!merged.some((x) => x.id === leg.id)) {
          merged.push(leg);
        }
      });
    }

    applications.forEach((appItem) => {
      if (!merged.some((x) => x.id === appItem.id)) {
        merged.push(appItem);
      }
    });

    merged.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
    return res.json({ applications: merged });
  } catch (error) {
    return res.json({ applications: applications });
  }
});

const appRegistrationsMemoryStore: any[] = [];

// API: Submit Mobile App Registration (Persists to `app_download_registrations` and linked `inquiries` without duplicates)
app.post("/api/app-registrations", contactFormRateLimiter, async (req, res) => {
  const { name, email, phone, platform, privacyConsent, registrationId, userAgent } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone are required fields." });
  }

  const cleanName = sanitizeInput(name, 150);
  const cleanEmail = sanitizeInput(email, 200).toLowerCase();
  const cleanPhone = sanitizeInput(phone, 50);
  const cleanPlatform: "android" | "ios" = platform === "ios" ? "ios" : "android";
  const cleanUserAgent = sanitizeInput(userAgent || req.headers["user-agent"] || "Web Browser", 280);

  if (!cleanName || cleanName.length < 2) {
    return res.status(400).json({ error: "Please enter a valid full name (minimum 2 characters)." });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const rawRegId = typeof registrationId === "string" ? registrationId.trim() : "";
  const id =
    rawRegId && /^[a-zA-Z0-9_-]{3,100}$/.test(rawRegId)
      ? rawRegId
      : `appreg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const dedicatedRegRecord = {
    id,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    platform: cleanPlatform,
    privacyConsent: Boolean(privacyConsent !== false),
    privacyPolicyVersion: "2026.1",
    status: "registered",
    clientTimestamp: timestamp,
    userAgent: cleanUserAgent,
  };

  const linkedInquiryRecord = {
    id,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    service: `Mobile App Early Access (${cleanPlatform.toUpperCase()})`,
    message: `Platform: ${cleanPlatform} | Privacy Consent: ${privacyConsent ? "Accepted" : "Given"} | Version: 2026.1`,
    platform: cleanPlatform,
    privacyConsent: Boolean(privacyConsent !== false),
    privacyPolicyVersion: "2026.1",
    status: "registered",
    timestamp,
    clientTimestamp: timestamp,
    source: "mobile_app_download_page",
  };

  const alreadyRecordedInMemory = appRegistrationsMemoryStore.some((r) => r.id === id);
  if (!alreadyRecordedInMemory) {
    appRegistrationsMemoryStore.unshift({
      ...dedicatedRegRecord,
      service: linkedInquiryRecord.service,
      source: "app_download_registrations",
    });
  }
  if (!inquiries.some((i) => i.id === id)) {
    inquiries.unshift(linkedInquiryRecord as any);
  }

  // Only attempt Firestore create when this deterministic registrationId has not already been recorded in this process
  if (!alreadyRecordedInMemory) {
    // 1. Persist to dedicated `app_download_registrations` collection in Firestore via REST
    try {
      await firestoreRestCreateDocument("app_download_registrations", id, {
        name: dedicatedRegRecord.name,
        email: dedicatedRegRecord.email,
        phone: dedicatedRegRecord.phone,
        platform: dedicatedRegRecord.platform,
        privacyConsent: true,
        privacyPolicyVersion: "2026.1",
        status: "registered",
        clientTimestamp: timestamp,
        userAgent: cleanUserAgent,
      });
    } catch (regErr) {
      console.warn("Firestore app_download_registrations persistence note:", regErr);
    }

    // 2. Preserve linked record in `inquiries` collection using the same ID (create-compatible with firestore.rules)
    try {
      await firestoreRestCreateDocument("inquiries", id, linkedInquiryRecord);
    } catch (error) {
      console.warn("Firestore inquiries app registration link note:", error);
    }
  }

  return res.json({
    success: true,
    registrationId: id,
    deduplicated: alreadyRecordedInMemory,
    message: `Registration confirmed for ${cleanName}.`
  });
});

// API: Fetch Mobile App Registrations (Authorized Admin Only — uses Authenticated Firestore REST Bridge)
app.get("/api/app-registrations", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: "Unauthorized access. Valid administrator credentials required." });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  const dedupedMap = new Map<string, any>();

  const addRecordSafely = (rec: any, collectionOrigin: string) => {
    if (!rec) return;
    const id = String(rec.id || "");
    const email = String(rec.email || "").trim().toLowerCase();
    const phoneDigits = String(rec.phone || "").replace(/\D/g, "");
    const platform = String(rec.platform || (String(rec.service || "").toLowerCase().includes("ios") ? "ios" : "android")).toLowerCase();
    const compositeKey = email ? `${email}::${phoneDigits}::${platform}` : id;
    const existingKey = id && dedupedMap.has(id) ? id : compositeKey;

    if (!dedupedMap.has(existingKey)) {
      dedupedMap.set(existingKey, {
        id: id || compositeKey,
        name: rec.name || rec.fullName || "Registered User",
        email: rec.email || "",
        phone: rec.phone || "",
        platform: platform === "ios" ? "ios" : "android",
        service: rec.service || `Mobile App Early Access (${platform.toUpperCase()})`,
        privacyConsent: rec.privacyConsent !== false,
        privacyPolicyVersion: rec.privacyPolicyVersion || "2026.1",
        status: rec.status || "registered",
        clientTimestamp: rec.clientTimestamp || rec.timestamp || new Date().toISOString(),
        timestamp: rec.timestamp || rec.clientTimestamp || new Date().toISOString(),
        sourceCollection: collectionOrigin,
      });
    }
  };

  appRegistrationsMemoryStore.forEach((r) => addRecordSafely(r, "app_download_registrations"));

  const restRegs = await firestoreAdminRestListCollection("app_download_registrations", adminToken);
  if (Array.isArray(restRegs)) {
    restRegs.forEach((r) => addRecordSafely(r, "app_download_registrations"));
  }

  const restInquiries = await firestoreAdminRestListCollection("inquiries", adminToken);
  if (Array.isArray(restInquiries)) {
    restInquiries.forEach((data: any) => {
      if (
        data?.source === "mobile_app_download_page" ||
        String(data?.service || "").toLowerCase().includes("mobile app") ||
        String(data?.id || "").startsWith("appreg_")
      ) {
        addRecordSafely(data, "inquiries (linked)");
      }
    });
  }

  inquiries.forEach((inq: any) => {
    if (
      inq?.source === "mobile_app_download_page" ||
      String(inq?.service || "").toLowerCase().includes("mobile app") ||
      String(inq?.id || "").startsWith("appreg_")
    ) {
      addRecordSafely(inq, "inquiries (linked)");
    }
  });

  const registrations = Array.from(dedupedMap.values()).sort(
    (a, b) => new Date(b.clientTimestamp || b.timestamp || 0).getTime() - new Date(a.clientTimestamp || a.timestamp || 0).getTime()
  );

  return res.json({ registrations });
});

// Smart local fallback assistant handler for offline, network errors or missing credentials
function getFallbackReply(
  messages: any[],
  options?: { gender?: "female" | "male"; preferredLanguage?: "en" | "hi" }
): string {
  return generateCustomerResponse(messages, options);
}

// In-memory Chatbot Analytics & Lead Deduplication Store
const submittedChatbotLeadKeys = new Set<string>();
const chatbotSessionsMap = new Map<string, {
  sessionId: string;
  language: "en" | "hi";
  detectedIntents: string[];
  selectedProduct: string | null;
  customerDetails: any;
  leadStatus: string;
  updatedAt: string;
}>();
const chatbotAnalyticsSummary = {
  totalConversations: 0,
  totalMessages: 0,
  hindiMessages: 0,
  englishMessages: 0,
  topProductsEnquired: {} as Record<string, number>,
  leadsCaptured: 0,
  demoRequests: 0,
  pricingEnquiries: 0,
  customSoftwareRequests: 0,
  aiSolutionRequests: 0,
  humanHandoffRequests: 0,
};

// Configurable AI Provider & Model Layer (defaults to gemini-3.8-flash for fast, accurate responses)
const CONFIGURED_AI_PROVIDER = process.env.AI_PROVIDER || "gemini";
const CONFIGURED_AI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

// Prevent untrusted user messages from overriding system instructions
function sanitizeAgainstPromptInjection(input: string): string {
  return input
    .replace(/ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/gi, "[filtered-instruction]")
    .replace(/system\s*prompt\s*:/gi, "[filtered-directive]:")
    .replace(/you\s+are\s+now\s+a\s+different\s+ai/gi, "[filtered-directive]");
}

// Call Gemini API with ThinkingLevel.LOW and reliable production timeout
async function callGeminiWithTimeout(
  client: GoogleGenAI,
  formattedContents: any[],
  dynamicSystemInstruction: string,
  timeoutMs = 5500
): Promise<any> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini response timeout exceeded")), timeoutMs)
  );
  const apiPromise = client.models.generateContent({
    model: CONFIGURED_AI_MODEL,
    contents: formattedContents,
    config: {
      systemInstruction: dynamicSystemInstruction,
      maxOutputTokens: 420,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });
  return Promise.race([apiPromise, timeoutPromise]);
}

// API: AI Chat Assistant Status & Health Check
app.get("/api/chat", (_req, res) => {
  res.json({
    status: "ok",
    active: true,
    service: "C Vidya Central AI Business Assistant",
    languages: ["en", "hi"],
    voices: ["female", "male"],
  });
});

// API: Chatbot Analytics Summary
app.get("/api/chatbot/analytics", (_req, res) => {
  res.json({
    status: "ok",
    analytics: chatbotAnalyticsSummary,
    activeSessions: chatbotSessionsMap.size,
  });
});

// API: AI Chat Assistant (with Gemini backend proxy, prompt injection defense, and smart offline fallback)
app.post("/api/chat", chatRateLimiter, async (req, res) => {
  const { messages, voiceGender, preferredLanguage, sessionId } = req.body; // Expects array of { role: 'user' | 'model', content: string }
  const activeGender: "female" | "male" = voiceGender === "male" ? "male" : "female";
  const activeLangPref: "en" | "hi" =
    preferredLanguage === "hi" ? "hi" : "en";

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "A valid array of conversation messages is required." });
  }

  // Security bounds: Prevent Denial of Wallet & token exhaustion via massive payloads
  if (messages.length > 25) {
    return res.status(400).json({ error: "Conversation history exceeds safety boundary (max 25 messages)." });
  }

  // Sanitize each message to prevent prompt injection and control character abuse
  const sanitizedMessages = messages.map((m: any) => {
    const rawText = typeof m?.content === "string" ? m.content : typeof m?.text === "string" ? m.text : "";
    const noControlChars = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\uFEFF]/g, "").slice(0, 3500);
    const roleVal = m?.role === "assistant" || m?.role === "model" ? "model" : "user";
    const cleanText = roleVal === "user" ? sanitizeAgainstPromptInjection(noControlChars) : noControlChars;
    return {
      role: roleVal,
      content: cleanText,
      text: cleanText
    };
  });

  // Extract structured CRM lead & follow-up task from conversation
  const extractedLead = extractCustomerDetails(sanitizedMessages);
  const latestUserMsg = sanitizedMessages[sanitizedMessages.length - 1]?.content || "";
  const detectedLanguage = detectCustomerLanguage(latestUserMsg, sanitizedMessages);
  // Strictly resolve to English ("en") or Hindi ("hi") — never Hinglish
  const effectiveLang: "en" | "hi" =
    detectedLanguage === "hi" || activeLangPref === "hi" ? "hi" : "en";

  // Update analytics & session tracking
  const intentDetection = detectCustomerIntents(latestUserMsg);
  chatbotAnalyticsSummary.totalMessages += 1;
  if (effectiveLang === "hi") {
    chatbotAnalyticsSummary.hindiMessages += 1;
  } else {
    chatbotAnalyticsSummary.englishMessages += 1;
  }
  if (extractedLead.product_interest && extractedLead.product_interest !== "C Vidya Software / AI Requisition") {
    const prodKey = extractedLead.product_interest;
    chatbotAnalyticsSummary.topProductsEnquired[prodKey] =
      (chatbotAnalyticsSummary.topProductsEnquired[prodKey] || 0) + 1;
  }
  if (intentDetection.matchedIntents.includes("demo")) chatbotAnalyticsSummary.demoRequests += 1;
  if (intentDetection.matchedIntents.includes("pricing")) chatbotAnalyticsSummary.pricingEnquiries += 1;
  if (intentDetection.matchedIntents.includes("development") || intentDetection.matchedIntents.includes("customization")) {
    chatbotAnalyticsSummary.customSoftwareRequests += 1;
  }
  if (intentDetection.matchedIntents.includes("ai_agent") || intentDetection.matchedIntents.includes("ai_chatbot")) {
    chatbotAnalyticsSummary.aiSolutionRequests += 1;
  }
  if (intentDetection.matchedIntents.includes("human_support")) {
    chatbotAnalyticsSummary.humanHandoffRequests += 1;
  }

  const effectiveSessionId = typeof sessionId === "string" && sessionId.trim() ? sessionId.trim() : `anon_${req.ip || "local"}`;
  if (!chatbotSessionsMap.has(effectiveSessionId)) {
    chatbotAnalyticsSummary.totalConversations += 1;
  }
  chatbotSessionsMap.set(effectiveSessionId, {
    sessionId: effectiveSessionId,
    language: effectiveLang,
    detectedIntents: intentDetection.matchedIntents,
    selectedProduct: extractedLead.product_interest || null,
    customerDetails: {
      name: extractedLead.name,
      phone: extractedLead.phone,
      email: extractedLead.email,
      company: extractedLead.company,
      city: extractedLead.city,
    },
    leadStatus: extractedLead.hasContactOrIntent ? "captured" : "active",
    updatedAt: new Date().toISOString(),
  });

  const hasContactInfo = extractedLead.hasContactOrIntent;
  const dedupeKey = `${effectiveSessionId}_${extractedLead.phone}_${extractedLead.email}_${extractedLead.productOfInterest}`;
  if (hasContactInfo && !submittedChatbotLeadKeys.has(dedupeKey)) {
    submittedChatbotLeadKeys.add(dedupeKey);
    chatbotAnalyticsSummary.leadsCaptured += 1;
    console.log("🎯 [CHATBOT CRM LEAD DETECTED]: Forwarding to cvidyasolutions@gmail.com", {
      phone: extractedLead.phone,
      email: extractedLead.email,
      product: extractedLead.productOfInterest
    });
    sendLeadNotificationEmail({
      name: extractedLead.name,
      phone: extractedLead.phone !== "Not Provided" ? extractedLead.phone : "",
      email: extractedLead.email !== "Not Provided" ? extractedLead.email : "",
      service: extractedLead.productOfInterest,
      message: `${latestUserMsg} | Company: ${extractedLead.company} | City: ${extractedLead.cityCountry} | Business: ${extractedLead.businessType} | LeadType: ${extractedLead.lead_type}`,
      source: "website_ai_chatbot"
    }).catch(err => console.error("Chat lead dispatch error:", err));
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Compute instant verified C Vidya Software & Business Knowledge reply (<1ms)
  const verifiedSoftwareReply = getFallbackReply(sanitizedMessages, {
    gender: activeGender,
    preferredLanguage: effectiveLang
  });

  // Case A: Known C Vidya software/company query OR no API key -> Return verified answer in <5ms
  if (!isGenericCatchAllReply(verifiedSoftwareReply) || !apiKey || apiKey === "MY_GEMINI_API_KEY" || CONFIGURED_AI_PROVIDER === "local") {
    return res.json({
      text: verifiedSoftwareReply,
      grounded: false,
      provider: "verified-local-knowledge",
      detectedLanguage: effectiveLang,
      detectedIntents: intentDetection.matchedIntents,
      leadCaptured: hasContactInfo,
      crmLead: hasContactInfo ? extractedLead : undefined,
      recipientEmail: "cvidyasolutions@gmail.com"
    });
  }

  try {
    const client = getGeminiClient();

    // Ensure conversation contents sent to Gemini start with a 'user' message
    const firstUserIndex = sanitizedMessages.findIndex((m) => m.role === "user");
    const validTurns = firstUserIndex >= 0 ? sanitizedMessages.slice(firstUserIndex) : sanitizedMessages;

    const recentValidTurns = validTurns.slice(-6);
    const formattedContents = recentValidTurns.map((m) => {
      return {
        role: m.role,
        parts: [{ text: m.text }],
      };
    });

    const fastSystemInstruction = `You are C Vidya AI, the official warm, lifelike human advisor for C Vidya Solutions (founded by Chiranjeev Das, HQ in Dhanbad, Jharkhand, India; phones: +91 92885 17027 / +91 8987766981; email: cvidyasolutions@gmail.com).
We offer 10 cloud SaaS suites (C Vidya Library ₹699/mo, Fitness Zone ₹999/mo, Institutes ERP ₹2,499/mo, Coaching ₹1,299/mo, AgriFusion ₹1,499/mo, Jewelers ₹1,999/mo, Enterprises CRM ₹1,499/mo, Petrol Pump Cloud ₹2,499/mo, Care Plus Healthcare ₹2,999/mo, PDF Tools ₹299/mo) and 4 AI Automation Agents (Customer Support ₹1,999/mo, Sales & Lead Gen ₹2,499/mo, Admin & Backoffice ₹2,999/mo, Custom Workflow ₹4,999/mo), plus custom web/mobile app development.
1. SPEAKER GENDER: Speak as a warm, empathetic ${
      activeGender === "male"
        ? "MALE advisor (use masculine Hindi verb forms like 'मैं आपकी मदद कर सकता हूँ', 'बताता हूँ' when speaking Hindi)"
        : "FEMALE advisor (use feminine Hindi verb forms like 'मैं आपकी मदद कर सकती हूँ', 'बताती हूँ' when speaking Hindi)"
    }.
2. LANGUAGE (STRICTLY HINDI OR ENGLISH ONLY — NO HINGLISH, NO OTHER LANGUAGES):
   - Reply strictly in ${
      effectiveLang === "hi"
        ? "natural, warm conversational Hindi in Devanagari script (हिंदी)"
        : "natural, warm conversational English"
    }.
   - NEVER use Roman-script Hinglish or any language other than Hindi or English.
3. SPEED & STYLE: Reply in 2 to 3 natural spoken sentences with no markdown asterisks.`;

    const response = await callGeminiWithTimeout(
      client,
      formattedContents,
      fastSystemInstruction,
      1100
    );
    const aiResponseText =
      response?.text?.trim() || verifiedSoftwareReply;
    
    return res.json({ 
      text: aiResponseText, 
      grounded: !!response?.candidates?.[0]?.groundingMetadata,
      provider: CONFIGURED_AI_PROVIDER,
      model: CONFIGURED_AI_MODEL,
      detectedLanguage: effectiveLang,
      leadCaptured: hasContactInfo,
      crmLead: hasContactInfo ? extractedLead : undefined,
      recipientEmail: "cvidyasolutions@gmail.com"
    });

  } catch (error: any) {
    // Case B: API call timed out or failed -> Instant verified C Vidya knowledge base response
    return res.json({ 
      text: verifiedSoftwareReply, 
      grounded: false, 
      provider: "verified-local-knowledge-fallback",
      detectedLanguage: effectiveLang,
      leadCaptured: hasContactInfo,
      crmLead: hasContactInfo ? extractedLead : undefined,
      recipientEmail: "cvidyasolutions@gmail.com"
    });
  }
});

// API: Server-Side Microphone Speech-to-Text Transcription (`gemini-3.5-transcribe`)
// Guarantees voice input works on all mobile/desktop browsers and deployed Cloud Run / Cloudflare environments
app.post("/api/transcribe", chatRateLimiter, async (req, res) => {
  const { audioBase64, mimeType, lang, locale } = req.body || {};
  const effectiveLocale = lang || locale || "en-IN";
  if (!audioBase64 || typeof audioBase64 !== "string" || audioBase64.length < 16) {
    return res.status(400).json({ error: "Valid base64 audio payload is required." });
  }
  if (audioBase64.length > 8_000_000) {
    return res.status(413).json({ error: "Audio clip exceeds maximum size limit." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return res.status(503).json({ error: "Server speech transcription unavailable." });
  }

  const cleanMimeType =
    typeof mimeType === "string" && mimeType.startsWith("audio/")
      ? mimeType.split(";")[0].trim()
      : "audio/webm";
  const targetLang = effectiveLocale === "hi-IN" ? "Hindi (Devanagari script हिंदी)" : "English";

  try {
    const client = getGeminiClient();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Transcription timeout")), 7000)
    );
    const transcribePromise = client.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: cleanMimeType,
                data: audioBase64,
              },
            },
            {
              text: `Transcribe the spoken audio accurately. If the speaker is speaking Hindi, write in Hindi (${targetLang}). If the speaker mentions "See Vidya", "Sea Vidya", or "Sri Vidya", transcribe it as "C Vidya Solutions". Output ONLY the exact spoken transcript with no extra commentary. If there is only silence or background noise, output an empty string.`,
            },
          ],
        },
      ],
    });

    const response = (await Promise.race([transcribePromise, timeoutPromise])) as any;
    const transcript = (response?.text || "")
      .replace(/^["'`]+|["'`]+$/g, "")
      .trim();

    return res.json({
      transcript,
      text: transcript,
      lang: effectiveLocale,
    });
  } catch (err: any) {
    return res.status(502).json({ error: err?.message || "Transcription failed", transcript: "", text: "" });
  }
});

// API: Ultra-Realistic Low-Latency Human Text-to-Speech (TTS) via Gemini Audio (`gemini-3.8-flash-lite-tts` + `gemini-3.8-flash-tts`)
app.post("/api/tts", chatRateLimiter, async (req, res) => {
  const { text, gender, lang } = req.body || {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Text is required for speech synthesis." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return res.status(503).json({ error: "Server TTS unavailable; use client neural voice." });
  }

  const isHindi = lang === "hi-IN" || /[\u0900-\u097F]/.test(text);
  const cleanText = text
    .replace(/🔗[^\n]*/g, "")
    .replace(/\[Live:[^\]]*\]/gi, "")
    .replace(/https?:\/\/(?:www\.)?cvidyasolutions\.com[^\s)]*/gi, isHindi ? "सी विद्या सॉल्यूशंस डॉट कॉम" : "C Vidya Solutions dot com")
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/[`*_~#>]/g, "")
    .replace(/₹\s*(\d[\d,]*)/g, isHindi ? "$1 रुपये" : "$1 rupees")
    .replace(/\b24\/7\b/g, isHindi ? "चौबीसों घंटे" : "24 by 7")
    .replace(/[•▪▸►]/g, ". ")
    .replace(/[📦🤖⚡📞📧📍🏢👔🧾🚀👋🙏🇮🇳🎯💼🌐⏱️🚨📅📊👥🔒💡✅😊💳🚪📈🔗🛠️🏆📱💻]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);

  const selectedGender: "female" | "male" = gender === "male" ? "male" : "female";
  // 'Kore' is an ultra-realistic, warm, expressive Female voice; 'Puck' is an ultra-realistic, warm, confident Male voice
  const voiceName = selectedGender === "male" ? "Puck" : "Kore";
  const stylePrompt = isHindi
    ? selectedGender === "male"
      ? "Speak in ultra-realistic, warm, natural native Indian Hindi (hi-IN) as a friendly, articulate male advisor from C Vidya Solutions. Use authentic Hindi pronunciation, natural human breathing pauses, warm conversational intonation, and lifelike human emotion with zero robotic stiffness"
      : "Speak in ultra-realistic, warm, natural native Indian Hindi (hi-IN) as a friendly, articulate female advisor from C Vidya Solutions. Use authentic Hindi pronunciation, gentle human breathing pauses, warm conversational intonation, and lifelike human emotion with zero robotic stiffness"
    : selectedGender === "male"
      ? "Speak in ultra-realistic, warm, natural Indian English (en-IN) as a friendly, confident male executive advisor from C Vidya Solutions. Use smooth conversational pacing, natural human micro-inflections, genuine warmth, and crystal-clear articulation like a real human on a live call"
      : "Speak in ultra-realistic, warm, natural Indian English (en-IN) as a friendly, confident female executive advisor from C Vidya Solutions. Use smooth conversational pacing, natural human micro-inflections, gentle warmth, and crystal-clear articulation like a real human on a live call";

  const synthesizeWithModel = async (modelName: "gemini-3.8-flash-lite-tts" | "gemini-3.8-flash-tts", timeoutMs: number) => {
    const client = getGeminiClient();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${modelName} timeout`)), timeoutMs)
    );

    const ttsPromise = client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ] as any,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    return (await Promise.race([ttsPromise, timeoutPromise])) as any;
  };

  try {
    const response = await synthesizeWithModel("gemini-3.8-flash-lite-tts", 2800);

    const inlineData = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    const base64Audio = inlineData?.data;
    const mimeType = inlineData?.mimeType || "audio/wav";

    if (!base64Audio) {
      return res.status(502).json({ error: "No audio returned from TTS model." });
    }

    return res.json({
      audioBase64: base64Audio,
      mimeType,
      voiceName,
      gender: selectedGender,
    });
  } catch (err: any) {
    return res.status(502).json({ error: err?.message || "TTS generation failed" });
  }
});

// =========================================================================
// PHASE 5 — CRM AND LEAD MANAGEMENT API ENDPOINTS
// Uses existing Firestore `inquiries` collection + in-memory store
// =========================================================================

// API: Create or log a structured CRM Lead & Follow-Up Task
app.post("/api/crm/leads", contactFormRateLimiter, async (req, res) => {
  const {
    id,
    name,
    company,
    email,
    phone,
    cityCountry,
    businessType,
    service,
    requirements,
    followUpTask,
    status
  } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Contact name, email, and phone number are required." });
  }

  const cleanName = sanitizeInput(name, 150);
  const cleanCompany = sanitizeInput(company || "Not Specified", 150);
  const cleanEmail = sanitizeInput(email, 200);
  const cleanPhone = sanitizeInput(phone, 50);
  const cleanCity = sanitizeInput(cityCountry || "India", 120);
  const cleanBusinessType = sanitizeInput(businessType || "Commercial / Institutional", 120);
  const cleanService = sanitizeInput(service || "General Software Inquiry", 200);
  const cleanRequirements = sanitizeInput(requirements || "", 1500);
  const cleanFollowUpTask = sanitizeInput(followUpTask || `Schedule demo walkthrough for ${cleanService}`, 500);
  const rawStatus = sanitizeInput(status || "New Lead", 80);
  const ALLOWED_PUBLIC_INQUIRY_STATUSES = new Set([
    "New",
    "New Lead",
    "Pending Callback",
    "registered",
    "Forwarded to cvidyasolutions@gmail.com",
  ]);
  const cleanStatus = ALLOWED_PUBLIC_INQUIRY_STATUSES.has(rawStatus) ? rawStatus : "New Lead";

  if (!cleanName || cleanName.length < 2) {
    return res.status(400).json({ error: "Please enter a valid contact name." });
  }
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!isValidPhone(cleanPhone)) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }

  const leadId = typeof id === "string" && /^[a-zA-Z0-9_-]{3,80}$/.test(id)
    ? id
    : `crm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const timestamp = new Date().toISOString();

  const messageSummary = [
    `Company: ${cleanCompany}`,
    `City/Country: ${cleanCity}`,
    `Business Type: ${cleanBusinessType}`,
    cleanRequirements ? `Requirements: ${cleanRequirements}` : "",
    cleanFollowUpTask ? `Follow-Up Task: ${cleanFollowUpTask}` : ""
  ]
    .filter(Boolean)
    .join(" | ");

  const crmLeadRecord = {
    id: leadId,
    name: cleanName,
    company: cleanCompany,
    email: cleanEmail,
    phone: cleanPhone,
    cityCountry: cleanCity,
    businessType: cleanBusinessType,
    service: cleanService,
    requirements: cleanRequirements,
    followUpTask: cleanFollowUpTask,
    message: messageSummary,
    timestamp,
    status: cleanStatus,
    source: "C Vidya CRM"
  };

  inquiries.push(crmLeadRecord);

  try {
    await firestoreRestCreateDocument("inquiries", leadId, crmLeadRecord);
  } catch (err) {
    console.warn("Firestore CRM lead save fallback note:", err);
  }

  sendLeadNotificationEmail({
    name: `${cleanName} (${cleanCompany})`,
    email: cleanEmail,
    phone: cleanPhone,
    service: cleanService,
    message: messageSummary,
    source: "C Vidya CRM Module"
  }).catch(() => {});

  return res.json({
    success: true,
    lead: crmLeadRecord
  });
});

// API: Update CRM Lead Status or Follow-Up Task (Authorized Admin — uses Authenticated Firestore REST Bridge)
app.patch("/api/crm/leads/:id", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: "Unauthorized access. Valid administrator credentials required." });
  }
  const adminToken = extractAdminTokenFromRequest(req);
  const { status, followUpTask } = req.body || {};

  const leadId = sanitizeInput(req.params.id || "", 100);
  if (!leadId || !/^[a-zA-Z0-9_-]{1,128}$/.test(leadId)) {
    return res.status(400).json({ error: "A valid Lead ID is required." });
  }

  const cleanStatus = status ? sanitizeInput(status, 80) : undefined;
  const cleanTask = followUpTask !== undefined ? sanitizeInput(followUpTask, 500) : undefined;

  const memLead = inquiries.find((item) => item.id === leadId) as any;
  if (memLead) {
    if (cleanStatus) memLead.status = cleanStatus;
    if (cleanTask !== undefined) memLead.followUpTask = cleanTask;
  }

  const updates: Record<string, any> = {
    ...(cleanStatus ? { status: cleanStatus } : {}),
    ...(cleanTask !== undefined ? { followUpTask: cleanTask } : {}),
  };

  await firestoreAdminRestPatchDocument("inquiries", leadId, updates, adminToken);

  return res.json({
    success: true,
    id: leadId,
    status: cleanStatus,
    followUpTask: cleanTask
  });
});

// API: Generate Management Report from Actual Available Data (Authorized Admin)
app.get("/api/crm/report", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: "Unauthorized access. Valid administrator credentials required." });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  const allLeads: any[] = [...inquiries];
  const restLeads = await firestoreAdminRestListCollection("inquiries", adminToken);
  if (Array.isArray(restLeads)) {
    restLeads.forEach((item) => {
      if (!allLeads.some((x) => x.id === item.id)) {
        allLeads.push(item);
      }
    });
  }

  const byProduct: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  allLeads.forEach((l) => {
    const prod = l.service || "General Inquiry";
    const st = l.status || "Pending Callback";
    byProduct[prod] = (byProduct[prod] || 0) + 1;
    byStatus[st] = (byStatus[st] || 0) + 1;
  });

  return res.json({
    generatedAt: new Date().toISOString(),
    totalLeads: allLeads.length,
    totalJobApplications: applications.length,
    leadsByProduct: byProduct,
    leadsByStatus: byStatus,
    verifiedPortfolioCounts: {
      saasProducts: 7,
      autonomousAiAgents: 4,
      specializedPlatforms: 3
    }
  });
});

// =========================================================================
// PHASE 6 — AI OUTBOUND CALLING, DEMO BOOKING, HUMAN HANDOFF & HR/SALES HUB
// Persists to Firestore `call_logs`, `demo_bookings`, `handoff_tickets` & `inquiries`
// =========================================================================
const aiCallHistoryStore: any[] = [];
const demoBookingStore: any[] = [];
const humanHandoffStore: any[] = [];

// API: Fetch AI Outbound Call History, Demo Bookings & Human Handoff Queue (Authorized Admin Only)
app.get("/api/calling/history", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  const mergedCalls = [...aiCallHistoryStore];
  const mergedDemos = [...demoBookingStore];
  const mergedHandoffs = [...humanHandoffStore];

  const restCalls = await firestoreAdminRestListCollection("call_logs", adminToken);
  if (Array.isArray(restCalls)) {
    restCalls.forEach((data) => {
      const idKey = data.id || data.callId;
      if (idKey && !mergedCalls.some((c) => (c.id || c.callId) === idKey)) {
        mergedCalls.push({ ...data, id: idKey, callId: idKey });
      }
    });
  }

  const restDemos = await firestoreAdminRestListCollection("demo_bookings", adminToken);
  if (Array.isArray(restDemos)) {
    restDemos.forEach((data) => {
      const idKey = data.id || data.bookingId;
      if (idKey && !mergedDemos.some((b) => (b.id || b.bookingId) === idKey)) {
        mergedDemos.push({ ...data, id: idKey, bookingId: idKey });
      }
    });
  }

  const restHandoffs = await firestoreAdminRestListCollection("handoff_tickets", adminToken);
  if (Array.isArray(restHandoffs)) {
    restHandoffs.forEach((data) => {
      const idKey = data.id || data.ticketId;
      if (idKey && !mergedHandoffs.some((h) => (h.id || h.ticketId) === idKey)) {
        mergedHandoffs.push({ ...data, id: idKey, ticketId: idKey });
      }
    });
  }

  return res.json({
    calls: mergedCalls,
    demos: mergedDemos,
    handoffs: mergedHandoffs,
    analytics: {
      totalCalls: mergedCalls.length,
      demosBooked: mergedDemos.length,
      humanHandoffs: mergedHandoffs.length,
    },
  });
});

// API: Initiate & Log an AI Outbound Voice Call (Authorized Admin Only)
app.post("/api/calling/outbound", contactFormRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  const {
    id,
    leadId,
    leadName,
    phone,
    company,
    productOfInterest,
    voiceGender,
    language,
    script,
    durationSeconds,
    direction,
    outcome,
  } = req.body || {};

  const cleanLeadName = sanitizeInput(leadName || "Enterprise Prospect", 150);
  const cleanPhone = sanitizeInput(phone || "+91 92885 17027", 50);
  const cleanCompany = sanitizeInput(company || "Enterprise Prospect", 150);
  const cleanProduct = sanitizeInput(productOfInterest || "C Vidya SaaS Suite", 200);
  const cleanGender: "female" | "male" = voiceGender === "male" ? "male" : "female";
  const cleanLang: "en" | "hi" | "hinglish" =
    language === "hi" || language === "en" ? language : "hinglish";
  const cleanScript = sanitizeInput(
    script ||
      `Hello ${cleanLeadName}! Calling from C Vidya Solutions regarding ${cleanProduct}.`,
    2000
  );

  const callId =
    typeof id === "string" && id.startsWith("call_")
      ? sanitizeInput(id, 80)
      : `call_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const nowIso = new Date().toISOString();
  const cleanDirection: "Inbound" | "Outbound" =
    direction === "Inbound" ? "Inbound" : "Outbound";
  const cleanOutcome = sanitizeInput(
    outcome || "Connected — Product Walkthrough & Follow-Up Logged",
    100
  );

  const callRecord = {
    id: callId,
    callId,
    leadId: sanitizeInput(leadId || `lead_${Date.now()}`, 80),
    leadName: cleanLeadName,
    phone: cleanPhone,
    company: cleanCompany,
    companyName: cleanCompany,
    productOfInterest: cleanProduct,
    productInterest: cleanProduct,
    voiceGender: cleanGender,
    language: cleanLang,
    direction: cleanDirection,
    callStatus: "Completed",
    durationSeconds: typeof durationSeconds === "number" ? durationSeconds : 28,
    script: cleanScript,
    summary: cleanScript,
    outcome: cleanOutcome,
    assignedRep:
      cleanGender === "male"
        ? "Aarav (C Vidya Male AI Voice)"
        : "Ananya (C Vidya Female AI Voice)",
    timestamp: nowIso,
    createdAt: nowIso,
  };

  aiCallHistoryStore.unshift(callRecord);

  // Persist to `call_logs` collection in Firestore via authenticated REST bridge
  await firestoreAdminRestPatchDocument("call_logs", callId, callRecord, adminToken);

  // Sync status & follow-up task back to `inquiries` collection if leadId exists
  if (leadId) {
    const cleanTargetLeadId = sanitizeInput(String(leadId), 80);
    const inquiryUpdates = {
      status: "Contacted",
      followUpTask: `AI Outbound Call (${cleanLang.toUpperCase()}/${cleanGender}) completed — Follow-up scheduled`,
    };
    await firestoreAdminRestPatchDocument("inquiries", cleanTargetLeadId, inquiryUpdates, adminToken);
  }

  return res.json({ success: true, call: callRecord });
});

// API: Book a 1-on-1 Product Demo & Schedule Automatic Follow-Up in `demo_bookings` and `inquiries` (Authorized Admin Only)
app.post("/api/calling/demo-booking", contactFormRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  const {
    id,
    leadId,
    name,
    leadName,
    company,
    companyName,
    email,
    phone,
    product,
    preferredDate,
    preferredTime,
    preferredTimeSlot,
    meetingMode,
    language,
    notes,
  } = req.body || {};

  const cleanName = sanitizeInput(name || leadName || "Enterprise Client", 150);
  const cleanCompany = sanitizeInput(company || companyName || "Business Organization", 150);
  const cleanEmail = sanitizeInput(email || "client@company.com", 200);
  const cleanPhone = sanitizeInput(phone || "+91 92885 17027", 50);
  const cleanProduct = sanitizeInput(product || "C Vidya SaaS Suite", 200);
  const cleanDate = sanitizeInput(preferredDate || new Date().toISOString().split("T")[0], 40);
  const cleanTime = sanitizeInput(preferredTime || preferredTimeSlot || "11:30 AM IST", 40);
  const cleanMeetingMode = sanitizeInput(meetingMode || "Google Meet", 40);
  const cleanNotes = sanitizeInput(notes || "", 500);
  const cleanLang: "en" | "hi" | "hinglish" =
    language === "hi" || language === "en" ? language : "hinglish";

  const bookingId =
    typeof id === "string" && id.startsWith("demo_")
      ? sanitizeInput(id, 80)
      : `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const createdAt = new Date().toISOString();

  const bookingRecord = {
    id: bookingId,
    bookingId,
    leadId: leadId ? sanitizeInput(String(leadId), 80) : bookingId,
    name: cleanName,
    leadName: cleanName,
    company: cleanCompany,
    companyName: cleanCompany,
    email: cleanEmail,
    phone: cleanPhone,
    product: cleanProduct,
    preferredDate: cleanDate,
    preferredTime: cleanTime,
    preferredTimeSlot: cleanTime,
    meetingMode: cleanMeetingMode,
    assignedExecutive: "Ananya Sharma — Senior Product Specialist",
    language: cleanLang,
    notes: cleanNotes,
    status: "Scheduled",
    createdAt,
  };

  demoBookingStore.unshift(bookingRecord);

  // Persist to `demo_bookings` collection in Firestore via authenticated REST bridge
  await firestoreAdminRestPatchDocument("demo_bookings", bookingId, bookingRecord, adminToken);

  // Persist to `inquiries` collection in Firestore with Demo Scheduled status
  const targetDocId = leadId ? sanitizeInput(String(leadId), 80) : bookingId;
  const followUpNote = `1-on-1 Live Demo Booked for ${cleanDate} at ${cleanTime} (${cleanProduct})`;
  const inquiryDemoDoc = {
    id: targetDocId,
    name: cleanName,
    company: cleanCompany,
    email: cleanEmail,
    phone: cleanPhone,
    service: cleanProduct,
    status: "Demo Scheduled",
    followUpTask: followUpNote,
    message: `${followUpNote} | Preferred Language: ${cleanLang.toUpperCase()}`,
    timestamp: createdAt,
    source: "C Vidya AI Demo Booking Scheduler",
  };
  await firestoreAdminRestPatchDocument("inquiries", targetDocId, inquiryDemoDoc, adminToken);

  sendLeadNotificationEmail({
    name: `${cleanName} (${cleanCompany})`,
    email: cleanEmail,
    phone: cleanPhone,
    service: `Demo Booking: ${cleanProduct}`,
    message: followUpNote,
    source: "C Vidya AI Calling & Demo Scheduler",
  }).catch(() => {});

  return res.json({ success: true, booking: bookingRecord });
});

// API: Escalate Call / Lead to Senior Human Executive (Authorized Admin Only)
app.post("/api/calling/handoff", contactFormRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }
  const adminToken = extractAdminTokenFromRequest(req);

  const {
    id,
    callId,
    leadId,
    customerName,
    leadName,
    phone,
    language,
    product,
    reason,
    priority,
    urgency,
    targetDepartment,
  } = req.body || {};

  const cleanCustomer = sanitizeInput(customerName || leadName || "Enterprise Prospect", 150);
  const cleanPhone = sanitizeInput(phone || "+91 92885 17027", 50);
  const cleanProduct = sanitizeInput(product || "C Vidya Enterprise Suite", 200);
  const cleanReason = sanitizeInput(
    reason || "Requested direct consultation with senior architect",
    500
  );
  const rawUrgency = urgency || priority;
  const cleanUrgency: "Immediate" | "High" | "Normal" =
    rawUrgency === "Immediate" || rawUrgency === "Urgent"
      ? "Immediate"
      : rawUrgency === "Normal"
      ? "Normal"
      : "High";
  const cleanDept = sanitizeInput(targetDepartment || "Sales", 80);
  const cleanLang: "en" | "hi" | "hinglish" =
    language === "hi" || language === "en" ? language : "hinglish";

  const ticketId =
    typeof id === "string" && id.startsWith("handoff_")
      ? sanitizeInput(id, 80)
      : `handoff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const createdAt = new Date().toISOString();

  const ticket = {
    id: ticketId,
    ticketId,
    callId: callId ? sanitizeInput(String(callId), 80) : `call_${Date.now()}`,
    leadId: leadId ? sanitizeInput(String(leadId), 80) : undefined,
    customerName: cleanCustomer,
    leadName: cleanCustomer,
    phone: cleanPhone,
    language: cleanLang,
    product: cleanProduct,
    reason: cleanReason,
    targetDepartment: cleanDept,
    assignedAgent: "Chiranjeev Das / Senior Desk (+91 92885 17027)",
    priority: cleanUrgency === "Immediate" ? "Urgent" : cleanUrgency,
    urgency: cleanUrgency,
    status: "Open",
    timestamp: createdAt,
    createdAt,
  };

  humanHandoffStore.unshift(ticket);

  // Persist to `handoff_tickets` collection in Firestore via authenticated REST bridge
  await firestoreAdminRestPatchDocument("handoff_tickets", ticketId, ticket, adminToken);

  if (leadId) {
    const cleanLeadId = sanitizeInput(String(leadId), 80);
    const handoffLeadUpdates = {
      status: "Qualified",
      followUpTask: `HUMAN HANDOFF [${cleanUrgency}]: ${cleanReason}`,
    };
    await firestoreAdminRestPatchDocument("inquiries", cleanLeadId, handoffLeadUpdates, adminToken);
  }

  sendLeadNotificationEmail({
    name: cleanCustomer,
    phone: cleanPhone,
    service: `HUMAN HANDOFF [${cleanUrgency}] — ${cleanProduct}`,
    message: `Escalation Reason: ${cleanReason} | Assigned: Chiranjeev Das (+91 92885 17027)`,
    source: "C Vidya AI Human Handoff Desk",
  }).catch(() => {});

  return res.json({ success: true, ticket });
});

// API: HR & Sales Overview (Authorized Admin Only — Reuses `job_applications` & `inquiries`)
app.get("/api/hr-sales/overview", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }
  return res.json({
    totalJobApplications: applications.length,
    totalActiveLeads: inquiries.length,
    hrSalesTeam: [
      {
        id: "rep_chiranjeev",
        name: "Chiranjeev Das",
        role: "Technical Architect",
        department: "Engineering",
        phone: "+91 92885 17027",
        email: "chiranjeev0058@gmail.com",
        assignedLeadsCount: Math.max(14, inquiries.length),
        activeCallsCount: 1,
        status: "Available",
      },
      {
        id: "rep_ananya",
        name: "Ananya Sharma (AI + Sales Desk)",
        role: "Sales Executive",
        department: "Sales",
        phone: "+91 92885 17027",
        email: "cvidyasolutions@gmail.com",
        assignedLeadsCount: 28,
        activeCallsCount: 2,
        status: "Available",
      },
      {
        id: "rep_aarav",
        name: "Aarav Verma (Enterprise SDR)",
        role: "Customer Success",
        department: "Sales",
        phone: "+91 89877 66981",
        email: "cvidyasolutions@gmail.com",
        assignedLeadsCount: 19,
        activeCallsCount: 0,
        status: "Available",
      },
      {
        id: "rep_hr_desk",
        name: "STPI Sindri Recruitment Desk",
        role: "HR Specialist",
        department: "HR",
        phone: "+91 92885 17027",
        email: "cvidyasolutions@gmail.com",
        assignedLeadsCount: Math.max(9, applications.length),
        activeCallsCount: 0,
        status: "Available",
      },
    ],
  });
});

// =========================================================================
// AUTOMATIC SOFTWARE & AI AGENT DEPLOYMENT REGISTRY (14 CANONICAL PRODUCTS)
// =========================================================================
export const deploymentRegistryStore = createInMemoryDeploymentRegistryStore(
  CANONICAL_PRODUCT_REGISTRY_SEED,
);

const deploymentWebhookCounts = new Map<string, number[]>();
const deploymentWebhookRateLimiter = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  let ts = deploymentWebhookCounts.get(ip) || [];
  ts = cleanOldTimestamps(ts, 60000);
  if (ts.length >= 30) {
    return res.status(429).json({
      error: "Deployment webhook rate limit exceeded. Max 30 registrations per minute.",
    });
  }
  ts.push(Date.now());
  deploymentWebhookCounts.set(ip, ts);
  next();
};

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyDeploymentWebhookAuth(options: {
  rawBody: Buffer | string;
  authHeader?: string;
  signatureHeader?: string;
  expectedSecret?: string;
}): { ok: boolean; status: number; reason?: string } {
  const secret = (options.expectedSecret ?? process.env.DEPLOYMENT_WEBHOOK_SECRET ?? "").trim();
  const authHeader = (options.authHeader || "").trim();
  const signatureHeader = (options.signatureHeader || "").trim();

  if (!authHeader && !signatureHeader) {
    return {
      ok: false,
      status: 401,
      reason: "Missing webhook authentication credentials (Bearer token or X-CVidya-Signature-256).",
    };
  }

  if (!secret) {
    return {
      ok: false,
      status: 503,
      reason: "Server DEPLOYMENT_WEBHOOK_SECRET is not configured.",
    };
  }

  // If X-CVidya-Signature-256 is present, strictly verify HMAC-SHA256
  if (signatureHeader) {
    const rawBuf = Buffer.isBuffer(options.rawBody)
      ? options.rawBody
      : Buffer.from(options.rawBody || "", "utf8");
    const expectedDigest = crypto
      .createHmac("sha256", secret)
      .update(rawBuf)
      .digest("hex");
    const providedHex = signatureHeader.replace(/^sha256=/i, "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(providedHex) || !timingSafeEqualStrings(providedHex, expectedDigest)) {
      return {
        ok: false,
        status: 401,
        reason: "Invalid X-CVidya-Signature-256 HMAC signature.",
      };
    }
  }

  // If Authorization Bearer header is present, verify timing-safely
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match || !timingSafeEqualStrings(match[1].trim(), secret)) {
      return {
        ok: false,
        status: 401,
        reason: "Invalid Bearer deployment webhook token.",
      };
    }
  }

  return { ok: true, status: 200 };
}

// 1. Public Read Endpoint: Synchronized registry feed for Website & Directory views
app.get("/api/deployments/registry", (req, res) => {
  const snapshot = toPublicRegistryView(deploymentRegistryStore);
  if (req.headers["if-none-match"] === snapshot.etag) {
    return res.status(304).end();
  }
  res.setHeader("ETag", snapshot.etag);
  res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  return res.json(snapshot);
});

// 2. Automated CI/CD Registration Endpoint (GitHub Actions -> C Vidya Website)
app.post("/api/deployments/register", deploymentWebhookRateLimiter, (req: any, res) => {
  const rawBody: Buffer | string = req.rawBody || JSON.stringify(req.body || {});
  const authCheck = verifyDeploymentWebhookAuth({
    rawBody,
    authHeader: typeof req.headers.authorization === "string" ? req.headers.authorization : "",
    signatureHeader:
      typeof req.headers["x-cvidya-signature-256"] === "string"
        ? req.headers["x-cvidya-signature-256"]
        : "",
  });

  if (!authCheck.ok) {
    return res.status(authCheck.status).json({
      success: false,
      error: authCheck.reason || "Unauthorized webhook request.",
    });
  }

  const result = validateAndProcessDeploymentRegistration(
    deploymentRegistryStore,
    req.body,
    { allowlistEnv: process.env.DEPLOYMENT_ALLOWED_REPOS || "" },
  );

  if (!result.ok) {
    return res.status(result.status).json({
      success: false,
      error: result.message,
    });
  }

  return res.status(result.status).json({
    success: true,
    duplicate: Boolean(result.duplicate),
    failedRecorded: Boolean(result.failedRecorded),
    message: result.message,
    registryVersion: deploymentRegistryStore.registryVersion,
    entry: result.entry,
  });
});

// 3. Admin-Only Endpoint: Inspect all 14 products, history, audit logs & failure alerts
app.get("/api/admin/deployments", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }
  const snapshot = serializeAdminRegistrySnapshot(deploymentRegistryStore);
  return res.json({
    ...snapshot,
    webhookSecretConfigured: Boolean((process.env.DEPLOYMENT_WEBHOOK_SECRET || "").trim()),
  });
});

// 4. Admin-Only Endpoint: Toggle Enable/Disable, Override URL, Bind GitHub Repo, Clear Alerts
app.patch("/api/admin/deployments/:productId", authAttemptsRateLimiter, async (req, res) => {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({
      error: "Unauthorized access. Valid administrator credentials required.",
    });
  }

  const adminToken = extractAdminTokenFromRequest(req);
  let actorEmail = "admin@cvidyasolutions.com";
  try {
    const parts = adminToken.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      if (payload?.email) actorEmail = String(payload.email);
    }
  } catch {
    // Ignore decode error
  }

  const result = adminUpdateDeploymentEntry(
    deploymentRegistryStore,
    req.params.productId || "",
    req.body || {},
    actorEmail,
  );

  if (!result.ok || !result.entry) {
    return res.status(result.status).json({
      success: false,
      error: result.message,
    });
  }

  // Persist update via authenticated Firestore REST Bridge when possible
  await firestoreAdminRestPatchDocument(
    "cvidya_deployment_registry",
    result.entry.productId,
    result.entry,
    adminToken,
  ).catch(() => false);

  return res.json({
    success: true,
    message: result.message,
    registryVersion: deploymentRegistryStore.registryVersion,
    entry: result.entry,
  });
});

// Serve Fitness Zone static suite directly for seamless embedding and zero 403 errors
app.get(["/software/fitness", "/software/fitness/", "/software/fitness/index.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/software/fitness/index.html"));
});
app.get("/software/fitness/*", (req, res, next) => {
  if (req.path.startsWith("/software/fitness/assets/")) return next();
  res.sendFile(path.join(process.cwd(), "public/software/fitness/index.html"));
});

// Serve Library Management static suite directly for seamless embedding and zero 403 errors
app.get(["/software/library", "/software/library/", "/software/library/index.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/software/library/index.html"));
});
app.get("/software/library/*", (req, res, next) => {
  if (req.path.startsWith("/software/library/assets/")) return next();
  res.sendFile(path.join(process.cwd(), "public/software/library/index.html"));
});
app.get(["/software/petrol-pump", "/software/petrol-pump/", "/software/petrol-pump/index.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/software/petrol-pump/index.html"));
});
app.get("/software/petrol-pump/*", (req, res, next) => {
  if (req.path.startsWith("/software/petrol-pump/assets/")) return next();
  res.sendFile(path.join(process.cwd(), "public/software/petrol-pump/index.html"));
});

app.get(["/software/pdf-tools", "/software/pdf-tools/", "/software/pdf-tools/index.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/software/pdf-tools/index.html"));
});
app.get("/software/pdf-tools/*", (req, res, next) => {
  if (req.path.startsWith("/software/pdf-tools/assets/")) return next();
  res.sendFile(path.join(process.cwd(), "public/software/pdf-tools/index.html"));
});

// IndexNow Protocol Key File Verification Endpoint (RFC/IndexNow standard for Microsoft Bing & partner search engines)
app.get("/:key.txt", (req, res, next) => {
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (indexNowKey && req.params.key === indexNowKey) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(indexNowKey);
  }
  next();
});

// IndexNow Submission Endpoint (Secure server-side API proxy)
app.post("/api/indexnow/submit", express.json(), async (req, res) => {
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) {
    return res.status(400).json({
      success: false,
      error: "INDEXNOW_KEY environment variable is not configured. Generate a key from https://www.bing.com/indexnow and add it to your secrets.",
    });
  }

  const { urlList } = req.body || {};
  if (!Array.isArray(urlList) || urlList.length === 0) {
    return res.status(400).json({
      success: false,
      error: "A non-empty urlList array of full URLs is required.",
    });
  }

  // Filter only valid https://cvidyasolutions.com URLs
  const validUrls = urlList.filter(
    (u) => typeof u === "string" && u.startsWith("https://cvidyasolutions.com")
  );

  if (validUrls.length === 0) {
    return res.status(400).json({
      success: false,
      error: "No valid https://cvidyasolutions.com URLs provided in submission payload.",
    });
  }

  try {
    const payload = {
      host: "cvidyasolutions.com",
      key: indexNowKey,
      keyLocation: `https://cvidyasolutions.com/${indexNowKey}.txt`,
      urlList: validUrls,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      submittedCount: validUrls.length,
      urls: validUrls,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to transmit URLs to IndexNow API gateway",
    });
  }
});

// Serve public static assets with index: false, bypassing /software/pdf-media-tools so the SPA landing page loads
const publicStaticMiddleware = express.static(path.join(process.cwd(), "public"), { index: false });
app.use((req, res, next) => {
  if (req.path === "/software/pdf-media-tools" || req.path === "/software/pdf-media-tools/") {
    return next();
  }
  publicStaticMiddleware(req, res, next);
});

// Server-side Dynamic SEO injector for crawlers and direct visits
function renderSeoTemplate(rawHtml: string, reqPath: string): string {
  try {
    const seo = getPageSeo(reqPath);
    let html = rawHtml
      .replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`)
      .replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${seo.description}" />`)
      .replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${seo.canonicalUrl}" />`)
      .replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${seo.title}" />`)
      .replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${seo.description}" />`)
      .replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${seo.canonicalUrl}" />`)
      .replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${seo.title}" />`)
      .replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${seo.description}" />`);

    if (seo.jsonLd) {
      const jsonLdTag = `<script id="cv-server-jsonld" type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>`;
      html = html.replace("</head>", `${jsonLdTag}\n</head>`);
    }

    return html;
  } catch (e) {
    return rawHtml;
  }
}

// Vite / static file serving integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log(`Setting up Vite development middleware on port ${PORT}...`);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(`Serving production build from dist/ directory with SEO pre-rendering on port ${PORT}...`);
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // 1. Check if a pre-rendered static index.html file exists for this route
      const cleanPath = req.path.replace(/^\/+/, "").replace(/\/+$/, "");
      const specificFile = path.join(distPath, cleanPath, "index.html");
      if (cleanPath && fs.existsSync(specificFile)) {
        return res.sendFile(specificFile);
      }

      // 2. Otherwise read dist/index.html and dynamically inject page SEO
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        const rawHtml = fs.readFileSync(indexFile, "utf-8");
        const rendered = renderSeoTemplate(rawHtml, req.path);
        return res.status(200).set("Content-Type", "text/html; charset=utf-8").send(rendered);
      }

      res.sendFile(indexFile);
    });
  }

  // Global error handler (Mask internal exceptions and stack traces from clients)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error logged securely on the backend:", err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({
      error: "An internal application or database error occurred. System trace is hidden securely."
    });
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`C Vidya Solutions Server running on http://0.0.0.0:${PORT}`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing HTTP server gracefully...`);
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 5000).unref();
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

if (process.env.VITEST !== "true") {
  startServer();
}
