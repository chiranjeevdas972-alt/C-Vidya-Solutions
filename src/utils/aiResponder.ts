// Comprehensive Knowledge Base & Smart Offline AI Responder for C Vidya Solutions

export function getSmartAssistantResponse(messages: { role: string; content?: string; text?: string }[]): string {
  if (!messages || messages.length === 0) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**.\n\nI am your **AI Customer Support Assistant**. How can I help you today?";
  }

  const lastMsg = messages[messages.length - 1];
  const userText = ((lastMsg.content || lastMsg.text || "").toLowerCase()).trim();

  if (!userText) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**. How can I assist you today?";
  }

  // 1. Browsing / Casual / No immediate requirement ("dekh rha", "just browsing", "no thanks", etc.)
  if (
    userText.includes("dekh rha") ||
    userText.includes("dekh raha") ||
    userText.includes("dekh rhe") ||
    userText.includes("nahi chahiye") ||
    userText.includes("nhi chahiye") ||
    userText.includes("nhi chahiy") ||
    userText.includes("nahi chahiy") ||
    userText.includes("aise i") ||
    userText.includes("aise hi") ||
    userText.includes("just browsing") ||
    userText.includes("just looking") ||
    userText.includes("no need") ||
    userText.includes("just checking") ||
    userText.includes("not buying") ||
    userText.includes("explore kr") ||
    userText.includes("explore kar") ||
    userText.includes("no thanks")
  ) {
    return "Koi baat nahi! 👋 Aap aaram se **C Vidya Solutions** ke sabhi software products, AI Agents, aur cloud services ko explore kar sakte hain.\n\nAgar aapko hamare **7 SaaS Products** (Library, Gym, Institute, Coaching, AgriFusion, Jewelers, CRM), **4 Autonomous AI Agents**, ya specialized services jaise **Petrol Pump Site**, **Care Plus Healthcare System**, aur **PDF & Media Tools SaaS** ke baare mein jaankari chahiye ya live demo test karna ho, toh main aapki poori madad karunga!";
  }

  // 2. Greetings & Small Talk (English, Hindi, Hinglish)
  if (
    userText === "hi" ||
    userText === "hello" ||
    userText === "hey" ||
    userText.startsWith("namaste") ||
    userText.startsWith("namaskar") ||
    userText.startsWith("pranam") ||
    userText.includes("good morning") ||
    userText.includes("good afternoon") ||
    userText.includes("good evening") ||
    userText.includes("kaise ho") ||
    userText.includes("kaise h") ||
    userText.includes("kya haal") ||
    userText.includes("what's up") ||
    userText.includes("whats up")
  ) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**.\n\nI am your **C-Vidya AI Customer Support Agent**. I can help you with:\n\n• **7 Flagship SaaS Products**:\n  1. C Vidya Library Management\n  2. C Vidya Fitness Zone\n  3. C Vidya Institute Management\n  4. C Vidya Coaching Management\n  5. AgriFusion (FarmFresh Hub)\n  6. C Vidya Jewelers Management\n  7. C Vidya Enterprises CRM\n\n• **4 Autonomous AI Agents**:\n  1. C Vidya Social Media Agent\n  2. C Vidya AI Customer Support Agent\n  3. C Vidya Business Sales Flow AI Agent\n  4. C Vidya AI Marketing for B2B SaaS Companies AI Agent\n\n• **Other Specialized Services**:\n  1. C Vidya Cloud-Based Software Petrol Pump Site\n  2. Care Plus Healthcare System\n  3. C Vidya PDF and Media Tools SaaS\n\nHow can I help you today? Aap English, Hindi, ya Hinglish mein bhi pooch sakte hain!";
  }

  // 3. Human / Real Person Agent Request
  if (
    userText.includes("human") ||
    userText.includes("real agent") ||
    userText.includes("person") ||
    userText.includes("insan") ||
    userText.includes("banda") ||
    userText.includes("talk to agent") ||
    userText.includes("call me")
  ) {
    return "I am the official **AI Customer Support Assistant** of C Vidya Solutions. I can answer any question about our software architecture, features, live demos, pricing, and onboarding.\n\nIf you would like to connect directly with our management or executive team:\n\n📞 **Helpline**: +91 9288517027 / 8987766981\n📧 **Official Email**: cvidyasolutions@gmail.com\n👔 **Founder Desk (Chiranjeev Das)**: chiranjeev0058@gmail.com\n📍 **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n🏢 **Incubation & Branch**: STPI Sindri, BIT Sindri Campus, Dhanbad\n\nPlease share your name, phone number, and product of interest, and our executive team will get in touch with you right away!";
  }

  // 4. All Software / Products Overview ("all software", "what software", "list of software", "all products", "services", "kya kya software")
  if (
    userText.includes("all software") ||
    userText.includes("all products") ||
    userText.includes("all product") ||
    userText.includes("what software") ||
    userText.includes("which software") ||
    userText.includes("list of software") ||
    userText.includes("kya kya software") ||
    userText.includes("product list") ||
    userText.includes("services list") ||
    userText.includes("software list")
  ) {
    return "**C Vidya Solutions Ecosystem Overview**:\n\n📦 **7 Flagship SaaS Products**:\n1. **C Vidya Library Management**: ISBN barcode scanning, reading room seat allocator, overdue WhatsApp alerts, fine ledgers.\n2. **C Vidya Fitness Zone**: Biometric turnstile access control, subscription renewals, automated fee lockout, workout & diet planner.\n3. **C Vidya Institute Management**: Admissions CRM, school/college fee collection, CBSE/ICSE gradebooks, GPS bus tracking, hostel management.\n4. **C Vidya Coaching Management**: Batch scheduling, biometric attendance alerts, offline OMR mock test grading, AIR rank generator.\n5. **AgriFusion (FarmFresh Hub)**: Poultry flock FCR, fishery pond telemetry, goat herd cycles, POS retail/wholesale billing, feed stock.\n6. **C Vidya Jewelers Management**: 24K/22K live gold/silver rate sync, karat weight calculation, Karigar casting logs, GST barcode billing.\n7. **C Vidya Enterprises CRM**: Drag-and-drop Kanban deal pipeline, automated follow-ups, VoIP logs, quotation PDF builder.\n\n🤖 **4 Autonomous AI Agents**:\n1. **C Vidya Social Media Agent**: Viral trend research, automated multi-channel posting, comment sentiment replies.\n2. **C Vidya AI Customer Support Agent**: 24/7 RAG support, sub-second query resolution, omnichannel widget integration.\n3. **C Vidya Business Sales Flow AI Agent**: Automated B2B prospect discovery, personalized cold outreach, demo calendar booking.\n4. **C Vidya AI Marketing for B2B SaaS Companies**: SEO keyword clustering, technical blogs, LinkedIn thought leadership, CAC/MQL analytics.\n\n⚡ **Other Specialized Services**:\n1. **C Vidya Cloud-Based Software Petrol Pump Site**: Shift reconciliation, nozzle meter counters, tank dip-to-sale variance, fleet credit khata.\n2. **Care Plus Healthcare System**: Hospital OPD/IPD queue, digital prescriptions, pharmacy inventory, lab pathology reports, bed allocation.\n3. **C Vidya PDF and Media Tools SaaS**: High-speed Word to PDF, merge, split, compress, watermark, protect, media conversion tools.\n\nWhich software or service would you like to explore or test in a live demo?";
  }

  // 5. Demo, Trial, or Sandbox Access
  if (
    userText.includes("demo") ||
    userText.includes("trial") ||
    userText.includes("test karna") ||
    userText.includes("kaise chalega") ||
    userText.includes("dekho") ||
    userText.includes("dikhao") ||
    userText.includes("live link") ||
    userText.includes("how to try")
  ) {
    return "We provide **Free Interactive Live Demos & Sandbox Access** for all our software products and AI agents!\n\nAll platforms are hosted on high-performance Cloudflare edge nodes with instant access.\n\nTo schedule a personalized 1-on-1 walkthrough or receive custom credentials, please share:\n1. **Your Full Name**\n2. **Business / Institution Name**\n3. **Mobile Number**\n4. **Email Address**\n5. **Product of Interest** (e.g., Library, Gym, Petrol Pump, Care Plus, AgriFusion, Coaching, AI Agents, PDF Tools)\n6. **City & State**\n\nOur team will set up your environment within 24 hours!";
  }

  // 6. Pricing, Cost, Rates, Subscription Plans
  if (
    userText.includes("price") ||
    userText.includes("cost") ||
    userText.includes("rate") ||
    userText.includes("fee") ||
    userText.includes("charge") ||
    userText.includes("kitne ka") ||
    userText.includes("kitna lagega") ||
    userText.includes("paise") ||
    userText.includes("plan") ||
    userText.includes("subscription") ||
    userText.includes("billing")
  ) {
    return "**C Vidya Solutions** offers modular, affordable SaaS pricing based on your operational scale and required modules:\n\n• **Starter Tier**: Designed for single-branch libraries, local fitness studios, small clinics, and individual farms/shops.\n• **Growth / Professional Tier**: Built for multi-batch coaching centers, busy fuel stations, jewelry retailers, and medium hospitals.\n• **Enterprise Custom**: Tailored for multi-branch campuses, hospital chains, enterprise CRM pipelines, dedicated edge nodes, and 24/7 SLA.\n\nPlease let me know which software product or AI agent you need, along with your approximate users/volume, and our team will share a customized quotation!";
  }

  // =========================================================================
  // 7. THE 7 FLAGSHIP SAAS PRODUCTS
  // =========================================================================

  // 7.1 C Vidya Library Management System
  if (
    userText.includes("library") ||
    userText.includes("kitab") ||
    userText.includes("book") ||
    userText.includes("reading room") ||
    userText.includes("study center")
  ) {
    return "**C Vidya Library Management** is a complete cloud automation system for libraries, study rooms, and educational reading halls:\n\n• **Member Profiles & Digital Passes**: Student registration, photo ID cards, and reading room seat allocator.\n• **Barcode & ISBN Scanner**: High-speed book check-in and check-out; search by title, author, category, or rack location.\n• **Automated Overdue Alerts**: Automated WhatsApp and SMS notifications with automated fine calculation.\n• **Financial Ledgers & Cashbook**: Instant fee receipts, lost book reconciliation, and daily cash collection logs.\n• **Reader Analytics**: Track popular book genres, peak reading hall hours, and borrowing histories.\n\n🔗 Live App: `https://v.cvidyasolutions.workers.dev/`\n\nWould you like a live demo or test login for your library?";
  }

  // 7.2 C Vidya Fitness Zone (Gym Management)
  if (
    userText.includes("gym") ||
    userText.includes("fitness") ||
    userText.includes("workout") ||
    userText.includes("trainer") ||
    userText.includes("fitzone") ||
    userText.includes("bodybuilding")
  ) {
    return "**C Vidya Fitness Zone** is an advanced club management platform for gyms, crossfit studios, and health clubs:\n\n• **Biometric Turnstile Access**: Fingerprint and RFID turnstile integration with automated door lock for unpaid or expired memberships.\n• **Flexible Membership Plans**: Daily, monthly, quarterly, annual, couple, and personal trainer (PT) subscriptions.\n• **Automated WhatsApp Invoices**: Instant renewal reminders with integrated UPI payment links.\n• **Workout & Diet Planners**: Custom diet cards, macronutrient targets, and progressive exercise routines.\n• **Trainer Rosters & Analytics**: Trainer commission logs, member attendance, and peak floor capacity heatmaps.\n\n🔗 Live App: `https://fitzone.cvidyasolutions.workers.dev/`\n\nWould you like a live demo for your fitness center?";
  }

  // 7.3 C Vidya Institute Management
  if (
    userText.includes("institute management") ||
    userText.includes("school erp") ||
    userText.includes("college erp") ||
    userText.includes("school management") ||
    userText.includes("college management") ||
    userText.includes("campus") ||
    (userText.includes("institute") && !userText.includes("coaching"))
  ) {
    return "**C Vidya Institute Management** is an all-in-one ERP suite for schools, colleges, and academic institutions:\n\n• **Admissions CRM Pipeline**: Student intake tracking from online/offline inquiry to formal enrollment.\n• **Fee Collection & Concessions**: Automated fee structures, installments, digital receipts, and cashbook accounting.\n• **Biometric Student & Staff Attendance**: Instant automated SMS/WhatsApp alerts sent to parents upon arrival or absence.\n• **Examinations & Report Cards**: CBSE, ICSE, and State Board compliant gradebook generation.\n• **Fleet GPS Transport**: School bus route tracking, driver assignments, and live location monitoring for parents.\n• **Hostel & Dormitory**: Room allotment, mess fee billing, and student gate-pass management.";
  }

  // 7.4 C Vidya Coaching Management
  if (
    userText.includes("coaching") ||
    userText.includes("tuition") ||
    userText.includes("batch") ||
    userText.includes("jee") ||
    userText.includes("neet") ||
    userText.includes("upsc") ||
    userText.includes("omr") ||
    userText.includes("mock test")
  ) {
    return "**C Vidya Coaching Management** is specialized for competitive exam centers (JEE, NEET, UPSC, SSC, Banking):\n\n• **Dynamic Batch Scheduling**: Batch creation, syllabus tracker, classroom capacity rosters, and batch transfers.\n• **Biometric Attendance Alerts**: Automated alerts to parents if a student misses class.\n• **Offline OMR Mock Test Grader**: Rapid OMR answer sheet scanning with instant All-India Rank (AIR) and percentile generation.\n• **Performance Diagnostics**: Topic-wise weakness identification and detailed graphical scorecards.\n• **Faculty Doubt Tracker**: Student doubt tickets allocated to subject mentors.\n\n🔗 Live App: `https://coaching.cvidyasolutions.workers.dev/`\n\nWould you like to see how our OMR grader or batch scheduling works?";
  }

  // 7.5 AgriFusion (FarmFresh Hub / ChickMart)
  if (
    userText.includes("farm") ||
    userText.includes("agrifusion") ||
    userText.includes("agriculture") ||
    userText.includes("poultry") ||
    userText.includes("chickmart") ||
    userText.includes("goat") ||
    userText.includes("fish") ||
    userText.includes("livestock") ||
    userText.includes("kheti") ||
    userText.includes("fishery")
  ) {
    return "**AgriFusion (FarmFresh Hub)** (*'One Platform. Every Farm. Unlimited Growth.'*):\n\n• **Multi-Farm Enterprise**: Unified management for poultry flock cycles, fishery pond water telemetry (pH/DO), goat breeding herds, and dairy livestock.\n• **Feed Stock & Mortality Tracking**: Automated feed inventory alerts and flock Feed Conversion Ratio (FCR) analytics.\n• **Counter POS & Wholesale Billing**: Fast point-of-sale billing for fresh chicken, meat, fish, eggs, and farm produce.\n• **Supplier & Customer Ledgers**: Credit khata for distributors and direct farm-to-table delivery dispatch.\n• **Farm P&L Accounting**: Daily expense tracking and batch-wise profitability reports.\n\n🔗 Live App: `https://fresh.cvidyasolutions.workers.dev/`\n\nWhich farming activity do you manage?";
  }

  // 7.6 C Vidya Jewelers Management
  if (
    userText.includes("jewel") ||
    userText.includes("jeweler") ||
    userText.includes("gold") ||
    userText.includes("silver") ||
    userText.includes("bullion") ||
    userText.includes("karigar") ||
    userText.includes("sona") ||
    userText.includes("chandi")
  ) {
    return "**C Vidya Jewelers Management** is a specialized ERP crafted for retail jewelers and bullion merchants:\n\n• **Live Bullion Market Rates**: Real-time sync for 24K, 22K, 18K gold and silver spot prices.\n• **Precision Weight & Wastage**: Net weight, gross weight, stone weight, and wastage (ghat) percentage calculators.\n• **Karigar (Artisan) Workflow**: Raw metal issuance, craftsmanship loss monitoring, and scrap recovery reconciliation.\n• **Custom Design Orders**: Track bespoke bridal and ceremonial orders with customer advance payments.\n• **GST Barcode Billing**: Hallmarked barcode label generation and compliant tax invoice printing.\n\n🔗 Live App: `https://jewelry.cvidyasolutions.workers.dev/`\n\nWould you like a live demo for your jewelry showroom?";
  }

  // 7.7 C Vidya Enterprises CRM
  if (
    userText.includes("crm") ||
    userText.includes("sales pipeline") ||
    userText.includes("deals") ||
    userText.includes("leads") ||
    userText.includes("quotation") ||
    userText.includes("proposal") ||
    userText.includes("b2b crm")
  ) {
    return "**C Vidya Enterprises CRM** empowers sales teams to accelerate deal velocity and revenue growth:\n\n• **Visual Kanban Pipeline**: Drag-and-drop lead stages with probability win scores.\n• **Omnichannel Lead Capture**: Captures leads from websites, WhatsApp, inbound calls, and campaigns.\n• **Automated Follow-ups**: Task reminders, meeting logs, and VoIP interaction timelines.\n• **Quotation PDF Builder**: Generate branded professional proposals in seconds.\n• **Sales Rep KPIs**: Conversion velocity, deal cycle length, and revenue attribution metrics.\n\n🔗 Live App: `https://crm.cvidyasolutions.workers.dev/`\n\nWould you like to test our CRM pipeline demo?";
  }

  // =========================================================================
  // 8. THE 4 AUTONOMOUS AI AGENTS
  // =========================================================================

  // 8.1 All 4 AI Agents Overview
  if (
    userText.includes("ai agent") ||
    userText.includes("autonomous agent") ||
    userText.includes("ai saas") ||
    userText.includes("agents")
  ) {
    return "**C Vidya Solutions 4 Autonomous AI Agents**:\n\n1. **C Vidya Social Media Agent**: Autonomous viral trend research, multi-platform scheduling (LinkedIn, X, Instagram, Facebook), and comment engagement.\n   🔗 [Live: c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev]\n\n2. **C Vidya AI Customer Support Agent**: 24/7 Omnichannel RAG engine, sub-second query resolution, automated ticket classification, and human escalation.\n   🔗 [Live: c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev]\n\n3. **C Vidya Business Sales Flow AI Agent**: Autonomous B2B prospect discovery, email verification, hyper-personalized outreach sequences, and calendar demo booking.\n   🔗 [Live: c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev]\n\n4. **C Vidya AI Marketing for B2B SaaS Companies**: Inbound demand gen engine, competitor gap analysis, SEO content clusters, LinkedIn executive thought leadership, and MQL velocity.\n   🔗 [Live: c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev]\n\nWhich AI Agent would you like to deploy for your business?";
  }

  // 8.2 C Vidya Social Media Agent
  if (
    userText.includes("social media agent") ||
    userText.includes("ai social") ||
    userText.includes("linkedin post") ||
    userText.includes("instagram agent") ||
    userText.includes("twitter agent")
  ) {
    return "**C Vidya Social Media Agent** is an autonomous growth engine for your brand:\n\n• **Viral Trend Ingestion**: Scans industry trends to identify high-performing content hooks.\n• **Cross-Platform Scheduling**: Creates engaging copy and auto-publishes to LinkedIn, X (Twitter), Instagram, and Facebook.\n• **Comment & DM Nurturing**: Monitors sentiment, replies to prospect comments, and captures qualified leads from DMs.\n• **Audience Analytics**: Provides posting time heatmaps and engagement velocity metrics.\n\n🔗 Live App: `https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/`";
  }

  // 8.3 C Vidya AI Customer Support Agent
  if (
    userText.includes("ai support") ||
    userText.includes("customer support agent") ||
    userText.includes("rag agent") ||
    userText.includes("support bot")
  ) {
    return "**C Vidya AI Customer Support Agent** provides automated 24/7 enterprise service:\n\n• **Sub-Second RAG Resolution**: Instant, accurate answers grounded in your company knowledge base.\n• **Omnichannel Deployment**: Embedded website widgets, WhatsApp Business API, and email.\n• **Smart Ticket Triage**: Automatically categorizes issues and detects urgency.\n• **Human Agent Escalation**: Smooth handoff with conversation context when manual intervention is needed.\n\n🔗 Live App: `https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/`";
  }

  // 8.4 C Vidya Business Sales Flow AI Agent
  if (
    userText.includes("salesflow") ||
    userText.includes("sales flow") ||
    userText.includes("sales agent") ||
    userText.includes("outreach agent") ||
    userText.includes("sdr agent") ||
    userText.includes("b2b sales")
  ) {
    return "**C Vidya Business Sales Flow AI Agent** acts as an autonomous AI Sales Development Representative (SDR):\n\n• **Prospect Discovery**: Identifies and verifies target B2B accounts and verified contact emails.\n• **Personalized Multi-Touch Outreach**: Generates tailored email, WhatsApp, and LinkedIn sequences based on prospect pain points.\n• **BANT Qualification**: Automatically qualifies intent, budget, and readiness.\n• **Calendar Demo Booking**: Directly books demo meetings into your sales team's calendar.\n\n🔗 Live App: `https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/`";
  }

  // 8.5 C Vidya AI Marketing for B2B SaaS Companies
  if (
    userText.includes("b2b saas marketing") ||
    userText.includes("marketing agent") ||
    userText.includes("ai marketing") ||
    userText.includes("seo agent") ||
    userText.includes("content agent")
  ) {
    return "**C Vidya AI Marketing for B2B SaaS Companies** is an inbound demand generation engine:\n\n• **SEO Content Clusters**: Comprehensive keyword research and competitor search gap analysis to rank for high-intent keywords.\n• **Thought Leadership**: Generates authoritative executive articles and LinkedIn carousels.\n• **Lead Magnets & Copy**: Crafts high-converting landing page copy, case studies, and email lead nurturing.\n• **Pipeline Analytics**: Full attribution modeling measuring Customer Acquisition Cost (CAC) and MQL pipeline velocity.\n\n🔗 Live App: `https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/`";
  }

  // =========================================================================
  // 9. OTHER SPECIALIZED SERVICES
  // =========================================================================

  // 9.1 C Vidya Cloud-Based Software Petrol Pump Site
  if (
    userText.includes("petrol") ||
    userText.includes("petrol pump") ||
    userText.includes("fuel") ||
    userText.includes("diesel") ||
    userText.includes("nozzle") ||
    userText.includes("tank dip") ||
    userText.includes("credit khata")
  ) {
    return "**C Vidya Cloud-Based Software Petrol Pump Site** is a comprehensive cloud fuel station management solution designed for retail petrol/diesel dealerships (IOCL, BPCL, HPCL, Nayara, Shell, Reliance):\n\n• **Nozzle Meter Management**: Shift-wise opening and closing totalizer meter readings with automatic sales calculation per nozzle.\n• **Underground Tank Dips & Variance**: Physical dip vs. book stock comparison with automatic dip-to-sale temperature/density variance audits to detect fuel losses or leaks.\n• **Fleet Credit Khata (Indent / Slip Billing)**: Manages vehicle credit accounts for transport companies, trucks, and businesses with slip verification and automated payment reminders.\n• **Lubricants & DEF Inventory**: Track lube oils, AdBlue, greases, and retail accessories stock with re-order alerts.\n• **Cashier & Shift Reconciliation**: Daily cash collection registers, digital payment receipts (UPI/POS), and cashier handover cashbooks.\n• **GST Invoicing**: Instant GST-compliant fuel bills and tax summary generation.\n\n🔗 Live Worker: `https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/`\n\nWould you like a live demo or to set up your petrol pump station?";
  }

  // 9.2 Care Plus Healthcare System
  if (
    userText.includes("care plus") ||
    userText.includes("healthcare") ||
    userText.includes("hospital") ||
    userText.includes("clinic") ||
    userText.includes("doctor") ||
    userText.includes("opd") ||
    userText.includes("ipd") ||
    userText.includes("patient") ||
    userText.includes("prescription") ||
    userText.includes("pathology") ||
    userText.includes("pharmacy")
  ) {
    return "**Care Plus Healthcare System** is an integrated Hospital Information System (HIS) & Clinical Practice ERP:\n\n• **OPD & IPD Management**: Patient registration, appointment scheduling, queue tokens, and IPD bed/ward/ICU allocation.\n• **Digital Prescription Generator (EMR/EHR)**: Quick-entry diagnosis templates, drug dosage guides, allergy warnings, and printed/WhatsApp digital prescriptions.\n• **In-House Pharmacy POS**: Medicine inventory management, batch number tracking, expiry date alerts, and retail billing.\n• **Pathology & Diagnostic Laboratory**: Test booking, sample collection barcodes, automated lab report generation, and diagnostic history.\n• **Billing & Insurance TPA**: Consolidated hospitalization billing, room tariffs, doctor visit fees, and Ayushman Bharat / TPA claims.\n• **Electronic Medical Records**: Lifelong patient medical histories, clinical charts, and discharge summaries.\n\nWould you like to schedule a personalized walkthrough for your hospital, clinic, or diagnostic center?";
  }

  // 9.3 C Vidya PDF and Media Tools SaaS
  if (
    userText.includes("pdf") ||
    userText.includes("media tool") ||
    userText.includes("convert word to pdf") ||
    userText.includes("word to pdf") ||
    userText.includes("merge pdf") ||
    userText.includes("split pdf") ||
    userText.includes("compress pdf") ||
    userText.includes("watermark")
  ) {
    return "**C Vidya PDF and Media Tools SaaS** is a high-speed digital document and multimedia transformation suite:\n\n• **Word to PDF Converter**: Professional conversion of Word (`.docx`) documents to standard PDF with preserved typography, XML paragraph extraction, and WinAnsi encoding sanitization.\n• **PDF Suite Tools**:\n  - **Merge PDF**: Combine multiple PDF files into one clean document.\n  - **Split PDF**: Extract specific pages or separate documents by range.\n  - **Compress PDF**: Reduce file size while maintaining visual clarity.\n  - **Watermark & Protect**: Add custom branding stamps and secure files with passwords.\n  - **Rotate & Organize**: Reorder or orient pages effortlessly.\n• **Media & Image Tools**: Instant image format conversion (PNG, JPG, WebP), compression, and multimedia processing.\n• **Privacy & Security**: High-speed client-side edge processing ensures files remain private with zero data retention.\n• **Cloud Inventory & Telemetry**: Built-in asset inventory, conversion speed metrics, and flexible usage tiers (Free, Pro, Enterprise).\n\n🔗 Live Worker: `https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/`\n\nWould you like to convert a document or test any of our PDF & media tools right now?";
  }

  // =========================================================================
  // 10. TECHNICAL SUPPORT, DATA MIGRATION & CLOUD ARCHITECTURE
  // =========================================================================

  // Data import / Excel / CSV
  if (
    userText.includes("excel") ||
    userText.includes("import") ||
    userText.includes("csv") ||
    userText.includes("migration") ||
    userText.includes("old data")
  ) {
    return "Yes, absolutely! **C Vidya Solutions** supports seamless data import:\n\n• **Bulk Excel / CSV Import**: Upload existing student records, member lists, book catalogs, inventory items, or client khata balances in one click.\n• **Free Migration Assistance**: Our engineering team provides complimentary data cleansing and onboarding support to ensure zero downtime when switching from legacy software.\n\nWhich software are you planning to migrate data into?";
  }

  // Cloud Architecture & Security
  if (
    userText.includes("security") ||
    userText.includes("safe") ||
    userText.includes("cloud") ||
    userText.includes("backup") ||
    userText.includes("stpi") ||
    userText.includes("server")
  ) {
    return "**C Vidya Cloud Architecture & Security Standards**:\n\n• **Cloudflare Edge Nodes**: Sub-50ms latency across India and global regions with 99.99% uptime guarantee.\n• **Bank-Grade Encryption**: End-to-end TLS 1.3 in-transit and AES-256 at-rest database encryption.\n• **Automated Daily Backups**: Redundant snapshots ensure your data is always safe and recoverable.\n• **Zero-Trust Role-Based Access (RBAC)**: Fine-grained permissions for owners, managers, accountants, staff, and customers.\n• **Certified Operations**: Supported and incubated under Software Technology Parks of India (STPI Sindri, BIT Sindri Campus).";
  }

  // Technical support, login, password
  if (
    userText.includes("support") ||
    userText.includes("login") ||
    userText.includes("password") ||
    userText.includes("otp") ||
    userText.includes("error") ||
    userText.includes("problem") ||
    userText.includes("issue") ||
    userText.includes("not working") ||
    userText.includes("chalu nahi") ||
    userText.includes("kaam nahi") ||
    userText.includes("forgot")
  ) {
    return "**C Vidya Technical Support Guidance**:\n\n• **Login / Password Issues**: Click 'Forgot Password' on your software portal, enter your registered email/phone, and submit the verification code.\n• **Technical Issue Submission**: Please share:\n  1. Software Product Name\n  2. Registered Email or Mobile Number\n  3. Error Message or description\n  4. Device Type (Mobile / Laptop / Desktop)\n\n🔒 *Security Note: Never share your password, OTP, or PIN with anyone.* Our technical team will assist you immediately!";
  }

  // Company details, founder, address
  if (
    userText.includes("contact") ||
    userText.includes("phone") ||
    userText.includes("email") ||
    userText.includes("address") ||
    userText.includes("office") ||
    userText.includes("location") ||
    userText.includes("dhanbad") ||
    userText.includes("sindri") ||
    userText.includes("surunga") ||
    userText.includes("chiranjeev") ||
    userText.includes("founder") ||
    userText.includes("owner") ||
    userText.includes("director")
  ) {
    return "**C Vidya Solutions Official Details**:\n\n• **Founded**: 2025 by **Chiranjeev Das** (Founder & Director)\n• **Tagline**: *Innovating Software for a Simpler Future*\n• **Official Website**: https://cvidyasolutions.com\n• **Helpline Phone**: +91 9288517027 / 8987766981\n• **Official Email**: cvidyasolutions@gmail.com\n• **Founder Desk**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch & Incubation**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand";
  }

  // 11. General Catch-All Fallback
  return "Thank you for reaching out to **C Vidya Solutions**! 👋\n\nI can assist you with:\n• **7 Flagship SaaS Products** (Library, Gym, Institute, Coaching, AgriFusion, Jewelers, Enterprises CRM)\n• **4 Autonomous AI Agents** (Social Media, Support, SalesFlow, B2B Marketing)\n• **Specialized Services** (Petrol Pump Site, Care Plus Healthcare System, PDF & Media Tools SaaS)\n• **Live Interactive Demos, Pricing Plans, and Onboarding Support**\n\nWhat would you like to know more about today?";
}
