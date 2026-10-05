export interface ProductSeoInfo {
  id: string;
  slug: string;
  urlPath: string;
  canonicalUrl: string;
  type: "software" | "ai-agent";
  breadcrumbName: string;
  h1Title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetUsers: { role: string; description: string }[];
  problemsSolved: { problem: string; solution: string }[];
  benefits: { metric: string; label: string; detail: string }[];
  workflow: { step: string; title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
  schemaType: "SoftwareApplication" | "Service";
  applicationCategory: string;
  operatingSystem: string;
}

import { ARTICLES_DATA } from "./articleData";

export const BASE_SITE_URL = "https://cvidyasolutions.com";

export const PRODUCT_SEO_DATA: Record<string, ProductSeoInfo> = {
  "library": {
    id: "library",
    slug: "library-management",
    urlPath: "/software/library-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/library-management/",
    type: "software",
    breadcrumbName: "Library Management",
    h1Title: "C Vidya Library Management Software",
    metaTitle: "C Vidya Library Management Software | Cloud Library Automation System",
    metaDescription: "Cloud library management software for educational institutes, public libraries, and study centers. Automate book circulation, student passes, barcode ISBN scans, and fee tracking.",
    category: "Academic & Campus SaaS",
    primaryKeyword: "C Vidya Library Management Software",
    secondaryKeywords: [
      "library management software",
      "cloud library management system",
      "library automation software",
      "library student management",
      "library member management",
      "library fee management",
      "library seat management",
      "reading room management software",
      "study centre management software",
      "attendance management",
      "library billing",
      "library reports"
    ],
    targetUsers: [
      { role: "College & School Librarians", description: "Streamline cataloging, barcode book scanning, and automated due date reminders." },
      { role: "Private Study Centers & Reading Rooms", description: "Manage hourly or monthly seat reservations, desk allocations, and entry passes." },
      { role: "University Department Libraries", description: "Multi-branch digital ledgers with multi-tier borrowing privileges and fine tracking." }
    ],
    problemsSolved: [
      { problem: "Lost or unreturned books causing inventory loss", solution: "Automated WhatsApp and SMS reminders before and on due dates, reducing delinquency by 85%." },
      { problem: "Manual register logging slowing front-desk checkout", solution: "Instant barcode and ISBN laser scanning to complete checkouts in under 3 seconds." },
      { problem: "Overcrowded reading rooms and seat disputes", solution: "Real-time seat grid allocation ledger tracking vacant, reserved, and active study desks." }
    ],
    benefits: [
      { metric: "85%", label: "Reduction in Overdue Delinquencies", detail: "Automated multichannel renewal alerts via WhatsApp and SMS" },
      { metric: "3s", label: "Average Book Checkout Time", detail: "Fast optical barcode and ISBN scanning without manual logging" },
      { metric: "100%", label: "Digital Audit Readiness", detail: "Exportable circulation ledgers and accession registers for accreditation" }
    ],
    workflow: [
      { step: "01", title: "Cataloging & ISBN Ingestion", detail: "Batch import existing book inventories or scan ISBN codes to auto-populate title, author, and edition metadata." },
      { step: "02", title: "Member Digital Pass Generation", detail: "Issue QR and barcode member identity cards for students, researchers, and faculty members." },
      { step: "03", title: "Automated Circulation & Returns", detail: "Rapid scan-in and scan-out with automatic due date computation, fine ledger calculation, and instant receipts." }
    ],
    faqs: [
      {
        question: "Can C Vidya Library Management handle barcode and ISBN scanners?",
        answer: "Yes. C Vidya Library Management supports standard USB, Bluetooth, and handheld optical barcode/ISBN scanners natively in the browser without requiring special driver installations."
      },
      {
        question: "Does the system support private study libraries with reserved seats?",
        answer: "Yes, it includes a dedicated Seat Management module specifically built for modern 24/7 reading rooms, self-study libraries, and study centers with shift-based desk reservations."
      },
      {
        question: "How does the automated overdue reminder work?",
        answer: "The platform integrates with WhatsApp Business API and transactional SMS gateways to automatically notify patrons 48 hours prior to due dates and on the due date."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "fitness": {
    id: "fitness",
    slug: "fitness-zone",
    urlPath: "/software/fitness-zone/",
    canonicalUrl: "https://cvidyasolutions.com/software/fitness-zone/",
    type: "software",
    breadcrumbName: "Fitness Zone",
    h1Title: "C Vidya Fitness Zone Management Software",
    metaTitle: "C Vidya Fitness Management Software | Gym & Fitness Centre Management System",
    metaDescription: "Comprehensive gym and health club management software with biometric turnstile gate sync, active member subscriptions, trainer rosters, and automated payment billing.",
    category: "Gym & Sports SaaS",
    primaryKeyword: "C Vidya Fitness Management Software",
    secondaryKeywords: [
      "gym management software",
      "fitness centre management system",
      "gym member management",
      "gym billing software",
      "gym membership management",
      "trainer management software",
      "biometric turnstile software",
      "gym access control",
      "fitness payment management"
    ],
    targetUsers: [
      { role: "Gym & Fitness Club Owners", description: "Eliminate unpaid entries and revenue leakages with automated turnstile gate relay control." },
      { role: "Personal Trainers & Fitness Coaches", description: "Design workout regimes, track diet compliance, and manage personal training clients." },
      { role: "Crossfit & Pilates Studios", description: "Schedule group sessions, control studio capacity, and manage flexible multi-tier passes." }
    ],
    problemsSolved: [
      { problem: "Expired or non-paying members accessing gym floor", solution: "Biometric and RFID turnstile integration locks doors automatically when membership expires." },
      { problem: "Manual cash collections and late renewal follow-ups", solution: "Direct UPI payment links sent via WhatsApp with auto-generated GST invoices." },
      { problem: "Floor overcrowding during peak evening hours", solution: "Real-time attendance heatmaps and capacity limits displayed at the front desk." }
    ],
    benefits: [
      { metric: "100%", label: "Turnstile Gate Enforcement", detail: "Zero unauthorized entries with automated biometric door relay sync" },
      { metric: "35%", label: "Faster Renewal Turnaround", detail: "Automated payment links sent directly to members' WhatsApp" },
      { metric: "24/7", label: "Real-time Member Telemetry", detail: "Live check-in dashboard showing current floor occupancy and peak hours" }
    ],
    workflow: [
      { step: "01", title: "Member Enrollment & Biometric Capture", detail: "Register member profile, assign fingerprint or RFID card, and attach the subscription tier." },
      { step: "02", title: "Turnstile Gate Access Control", detail: "Biometric relays verify active subscription status in milliseconds before unlocking the turnstile." },
      { step: "03", title: "Automated Invoicing & Renewals", detail: "Auto-generate GST tax receipts and send automated WhatsApp reminders 5 days prior to expiration." }
    ],
    faqs: [
      {
        question: "Can C Vidya Fitness Zone connect with existing biometric turnstiles?",
        answer: "Yes, C Vidya Fitness Zone connects with industry-standard TCP/IP and Wiegand biometric turnstiles, fingerprint readers, and RFID door controllers."
      },
      {
        question: "Does the software support Personal Training (PT) packages?",
        answer: "Yes, it tracks personal trainer allocations, session counts, trainer commission splits, and client progress notes."
      },
      {
        question: "Can members view their workouts and diet cards?",
        answer: "Yes, trainers can publish customized diet cards and workout schedules accessible on the member mobile view."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "institutes": {
    id: "institutes",
    slug: "institutes-management",
    urlPath: "/software/institutes-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/institutes-management/",
    type: "software",
    breadcrumbName: "Institutes Management",
    h1Title: "C Vidya Institutes Management Software",
    metaTitle: "C Vidya Institute Management Software | Multi-Branch Institute ERP",
    metaDescription: "All-in-one educational ERP software for schools, colleges, and multi-campus institutes. Manage student admissions, fee cashbooks, biometric attendance, and exams.",
    category: "Education & Campus ERP",
    primaryKeyword: "C Vidya Institute Management Software",
    secondaryKeywords: [
      "institute management software",
      "education management software",
      "institute ERP",
      "school management system",
      "student management software",
      "fee management software",
      "attendance management system",
      "result management system",
      "multi-branch institute management"
    ],
    targetUsers: [
      { role: "School Principals & College Directors", description: "Consolidated operational oversight across admissions, fee collection, and academic performance." },
      { role: "Accounts & Administration Staff", description: "Automated fee invoicing, digital receipting, ledger reconciliation, and bus route tracking." },
      { role: "Faculty & Teaching Staff", description: "Digital gradebooks, automated report card compilation, and daily homework registers." }
    ],
    problemsSolved: [
      { problem: "Fragmented spreadsheets across branches and departments", solution: "Unified multitenant cloud database connecting all administrative, academic, and financial functions." },
      { problem: "Delayed fee collection and disputed payment receipts", solution: "Online fee gateway, computerized cash registers, and automated fee reminder notices." },
      { problem: "Parent communication gaps regarding student absence", solution: "Instant parent WhatsApp/SMS notifications as soon as morning attendance is scanned." }
    ],
    benefits: [
      { metric: "99.4%", label: "Fee Reconciliation Accuracy", detail: "Zero ledger discrepancies with computerized cashier settlement" },
      { metric: "10x", label: "Faster Report Card Generation", detail: "Automated calculation of marks, grades, and percentage ranks" },
      { metric: "100%", label: "Multi-Branch Governance", detail: "Centralized super-admin dashboard managing all campus sites" }
    ],
    workflow: [
      { step: "01", title: "Admissions CRM & Verification", detail: "Capture online application forms, verify documents, and issue official student enrollment registration numbers." },
      { step: "02", title: "Academic & Fee Ledger Structuring", detail: "Set up semester or monthly installment slabs, assign concessions, and link school bus transport routes." },
      { step: "03", title: "Examinations & Parent Portal", detail: "Input subject grades, generate digital CBSE/ICSE report cards, and notify parents in real time." }
    ],
    faqs: [
      {
        question: "Can C Vidya Institutes Management manage multiple campuses simultaneously?",
        answer: "Yes, the system is designed with multitenant architecture allowing central trusts or group directors to oversee multiple branches from a single unified login."
      },
      {
        question: "Does it support automated fee reminders and online payments?",
        answer: "Yes, it supports integrated payment gateways (UPI, Netbanking, Cards) and automated WhatsApp reminders with payment links."
      },
      {
        question: "Is there a transport and bus tracking module?",
        answer: "Yes, administrators can map bus routes, assign student stops, track driver assignments, and audit transport fee collections."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "coaching": {
    id: "coaching",
    slug: "coaching-management",
    urlPath: "/software/coaching-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/coaching-management/",
    type: "software",
    breadcrumbName: "Coaching Management",
    h1Title: "C Vidya Coaching Management Software",
    metaTitle: "C Vidya Coaching Management Software | Academy Batch & OMR Test System",
    metaDescription: "Cloud software designed for competitive exam coaching centers, IIT-JEE/NEET academies, and tuition centers. Manage batches, OMR test analytics, and parent alerts.",
    category: "Coaching & Test Prep SaaS",
    primaryKeyword: "C Vidya Coaching Management Software",
    secondaryKeywords: [
      "coaching management software",
      "coaching institute software",
      "tuition management system",
      "batch management software",
      "OMR test scanner software",
      "coaching student tracking",
      "coaching fee software",
      "NEET JEE coaching software"
    ],
    targetUsers: [
      { role: "Coaching Center Directors", description: "Supervise student admissions, batch timetables, and teacher allocations across competitive courses." },
      { role: "Academic Coordinators", description: "Conduct weekly mock tests, scan OMR response sheets, and publish rank percentiles." },
      { role: "Subject Mentors & Tutors", description: "Track syllabus completion milestones, log student attendance, and resolve doubt queries." }
    ],
    problemsSolved: [
      { problem: "Manual grading of hundreds of weekly mock tests", solution: "High-speed OMR sheet scanner and automated rank card generation with topic-level analysis." },
      { problem: "Parents unaware of student absenteeism from coaching classes", solution: "Instant automated WhatsApp and SMS alerts sent to parents within 15 minutes of class start." },
      { problem: "Complex batch scheduling and syllabus delays", solution: "Interactive course calendars tracking syllabus percentage completed per subject." }
    ],
    benefits: [
      { metric: "15min", label: "Absenteeism Notification SLA", detail: "Parent WhatsApp alerts sent promptly upon morning roll call" },
      { metric: "100%", label: "Automated Mock Test Ranking", detail: "Instant rank list, percentile, and negative marking evaluation" },
      { metric: "82%", label: "Syllabus Pacing Compliance", detail: "Real-time tracking of curriculum milestones across faculty" }
    ],
    workflow: [
      { step: "01", title: "Batch Allotment & Timetabling", detail: "Enroll students into target exam cohorts (JEE, NEET, Foundation) and assign faculty schedules." },
      { step: "02", title: "Biometric Attendance & Alerts", detail: "Log entry through fingerprint or biometric attendance with automated parent notifications." },
      { step: "03", title: "OMR Mock Test Evaluation", detail: "Scan physical or digital answer keys, compute marks with negative grading, and dispatch scorecards." }
    ],
    faqs: [
      {
        question: "Can C Vidya Coaching Management grade physical OMR sheets?",
        answer: "Yes, it includes an OMR processing module that evaluates scanned answer sheets against answer keys with customized negative marking rules."
      },
      {
        question: "How does the system notify parents when a student is absent?",
        answer: "As soon as the batch attendance is submitted, an automated SMS/WhatsApp trigger dispatches a personalized message to registered guardian mobile numbers."
      },
      {
        question: "Can students check their rank and performance trends?",
        answer: "Yes, student profiles display historical test scores, percentile graphs, and subject-wise strength/weakness diagnostics."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "farming": {
    id: "farming",
    slug: "agriculture-management",
    urlPath: "/software/agriculture-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/agriculture-management/",
    type: "software",
    breadcrumbName: "Agriculture Management",
    h1Title: "AgriFusion Farm & Agribusiness Management Software",
    metaTitle: "AgriFusion Farm Management Software | Agribusiness ERP & Livestock Ledger",
    metaDescription: "All-in-one agribusiness software for poultry farms, fishery ponds, goat livestock, crop inventory, POS retail billing, and feed supply-chain accounting.",
    category: "Agribusiness & Farm Tech",
    primaryKeyword: "AgriFusion Farm Management Software",
    secondaryKeywords: [
      "farm management software",
      "agribusiness software",
      "poultry farm management",
      "fishery management software",
      "livestock tracking software",
      "dairy farm management",
      "crop inventory software",
      "farm accounting software",
      "agricultural POS billing"
    ],
    targetUsers: [
      { role: "Commercial Poultry & Dairy Farm Operators", description: "Track flock mortality, feed consumption ratios, vaccine schedules, and egg production." },
      { role: "Aquaculture & Fishery Managers", description: "Monitor pond water pH, fingerling stocking rates, feed cycles, and wholesale harvest yields." },
      { role: "Agricultural Retailers & FPOs", description: "Manage seed, fertilizer, and pesticide inventory with POS billing and farmer credit ledgers." }
    ],
    problemsSolved: [
      { problem: "Feed wastage and unexplained livestock mortality", solution: "Batch-wise Feed Conversion Ratio (FCR) calculation and automated vaccination alert calendars." },
      { problem: "Uncontrolled credit ledgers with agricultural wholesale distributors", solution: "Built-in POS billing with computerized distributor khata statements and balance tracking." },
      { problem: "Poor visibility into farm profitability per cycle", solution: "Complete cost-of-production accounting factoring feed, labor, medications, and harvest sale prices." }
    ],
    benefits: [
      { metric: "18%", label: "Feed Cost Optimization", detail: "Precise ration calculations based on flock age and target weight" },
      { metric: "100%", label: "Vaccination Schedule Compliance", detail: "Proactive automated reminders to prevent disease outbreaks" },
      { metric: "360°", label: "Profitability Visibility", detail: "Batch-level financial reporting from Day 1 to market harvest" }
    ],
    workflow: [
      { step: "01", title: "Batch & Herd Initialization", detail: "Register chick flocks, pond fingerlings, or livestock herds with acquisition dates and supplier costs." },
      { step: "02", title: "Daily Feed & Health Logging", detail: "Log daily feed intake, environmental conditions, and routine veterinary inspections." },
      { step: "03", title: "Harvest Billing & Dispatch", detail: "Generate wholesale weight-based tax invoices, update inventory ledgers, and reconcile dealer payments." }
    ],
    faqs: [
      {
        question: "Does AgriFusion support mixed farming operations (e.g. Poultry + Fishery)?",
        answer: "Yes. AgriFusion is an all-in-one agribusiness ERP that lets you manage poultry sheds, fishery ponds, livestock herds, and crop fields within a single unified account."
      },
      {
        question: "Can it calculate Feed Conversion Ratio (FCR)?",
        answer: "Yes, it automatically calculates FCR by comparing total feed consumed against average body weight gains per batch."
      },
      {
        question: "Does it support POS billing for retail farm outlets?",
        answer: "Yes, it includes a fast POS checkout counter capable of printing thermal receipts and tracking customer credit accounts."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "members": {
    id: "members",
    slug: "jewellers-management",
    urlPath: "/software/jewellers-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/jewellers-management/",
    type: "software",
    breadcrumbName: "Jewellers Management",
    h1Title: "C Vidya Jewellers Management Software",
    metaTitle: "C Vidya Jewellers Management Software | Gold, Silver & Diamond Billing ERP",
    metaDescription: "Specialized retail and wholesale jewelry management ERP. Track precious metal weights, live bullion rates, Karigar artisan wastage, and GST gold billing.",
    category: "Retail & Bullion SaaS",
    primaryKeyword: "C Vidya Jewellers Management Software",
    secondaryKeywords: [
      "jewelry software",
      "jewellery management software",
      "gold shop billing software",
      "jewellery ERP software",
      "karigar management software",
      "bullion rate billing software",
      "jewelry inventory tracking",
      "gold wastage management"
    ],
    targetUsers: [
      { role: "Jewellery Showroom Owners", description: "Streamline high-value bullion retail with barcode tag scanning, hallmark logging, and GST invoices." },
      { role: "Goldsmiths & Karigar Workshop Heads", description: "Track metal issue weight, return scrap, melting loss, and making charge accounts." },
      { role: "Wholesale Bullion Dealers", description: "Manage daily metal rate booking, customer old gold exchange transactions, and safe vault audits." }
    ],
    problemsSolved: [
      { problem: "Gold weight discrepancies and unexplained Karigar wastage", solution: "Granular milligram-level weight ledgers tracking pure metal given, finished ornament received, and net loss." },
      { problem: "Price volatility causing outdated showroom tag pricing", solution: "Live bullion rate board integration dynamically re-pricing tag estimates based on the day's spot rate." },
      { problem: "Cumbersome GST invoice calculations with multiple tax components", solution: "Automated billing separating metal value, making charges, hallmark fees, and 3% jewelry GST." }
    ],
    benefits: [
      { metric: "0.001g", label: "Precision Weight Tracking", detail: "Milligram-accurate ledger for 24K, 22K, 18K gold and silver" },
      { metric: "100%", label: "Hallmark Compliance", detail: "HUID barcode tagging and certified quality traceability" },
      { metric: "3s", label: "Instant GST Invoicing", detail: "Automatic calculation of metal, making charges, and taxes" }
    ],
    workflow: [
      { step: "01", title: "Metal Inflow & Bullion Rate Lock", detail: "Record pure gold and silver purchases from refineries and lock daily retail selling rates." },
      { step: "02", title: "Karigar Order Jobwork Allocation", detail: "Issue pure metal to artisans with design specifications, expected return weight, and making rates." },
      { step: "03", title: "Barcode Tagging & POS Sale", detail: "Scan HUID tag at billing counter, account for old gold exchange weight, and print compliant GST tax invoice." }
    ],
    faqs: [
      {
        question: "Does the software support old gold purchase and exchange calculations?",
        answer: "Yes, it provides a dedicated Old Gold Exchange calculator that determines net purity, melt deductions, and customer exchange credit."
      },
      {
        question: "Can it print jewelry barcode and HUID tags?",
        answer: "Yes, it interfaces with standard jewelry thermal label printers to print small butterfly tags with item weight, purity, and barcode."
      },
      {
        question: "How does it handle Karigar (Artisan) accounts?",
        answer: "It maintains a dual metal and cash ledger for every artisan, recording pure metal issued, ornament received, verified wastage, and making charges."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "crm": {
    id: "crm",
    slug: "enterprise-crm",
    urlPath: "/software/enterprise-crm/",
    canonicalUrl: "https://cvidyasolutions.com/software/enterprise-crm/",
    type: "software",
    breadcrumbName: "Enterprise CRM",
    h1Title: "C Vidya Enterprise CRM Software",
    metaTitle: "C Vidya Enterprise CRM | Sales Pipeline & Lead Management Software",
    metaDescription: "Scalable B2B enterprise CRM to manage customer pipelines, sales leads, quotation proposals, follow-up cadences, and sales team conversion KPIs.",
    category: "Sales & Enterprise CRM",
    primaryKeyword: "C Vidya Enterprise CRM",
    secondaryKeywords: [
      "CRM software",
      "sales CRM",
      "enterprise CRM software",
      "lead management software",
      "sales pipeline software",
      "customer management system",
      "sales automation software",
      "partner management CRM",
      "B2B CRM"
    ],
    targetUsers: [
      { role: "VP of Sales & Revenue Leaders", description: "Gain executive pipeline visibility, forecast quarterly bookings, and optimize team sales velocity." },
      { role: "Account Executives & SDRs", description: "Organize daily outreach, manage lead stages in Kanban pipelines, and log prospect calls." },
      { role: "Customer Success Managers", description: "Track renewal contracts, client health scores, support inquiries, and upselling opportunities." }
    ],
    problemsSolved: [
      { problem: "Leads slipping through cracks due to forgotten follow-ups", solution: "Automated follow-up reminders and scheduled email/WhatsApp triggers ensuring zero neglected leads." },
      { problem: "Slow quotation generation causing deal drop-offs", solution: "One-click proposal generator compiling customized PDF quotes with pricing tiers and terms." },
      { problem: "Inaccurate revenue forecasting from static spreadsheets", solution: "Real-time weighted pipeline calculations based on deal stages and historical close rates." }
    ],
    benefits: [
      { metric: "38%", label: "Faster Sales Cycle Velocity", detail: "Accelerated follow-ups and automated stage progression" },
      { metric: "100%", label: "Pipeline Transparency", detail: "Drag-and-drop Kanban view of every deal across the company" },
      { metric: "3x", label: "Quotation Turnaround Speed", detail: "One-click generation of branded proposals and commercial terms" }
    ],
    workflow: [
      { step: "01", title: "Lead Ingestion & Assignment", detail: "Automatically ingest leads from web forms, WhatsApp, and social campaigns, assigning them via round-robin." },
      { step: "02", title: "Pipeline Progression & Follow-Up", detail: "Move deals through Qualification, Demo, Proposal, and Negotiation stages with automated task alerts." },
      { step: "03", title: "Quotation & Contract Closure", detail: "Generate digital proposals, collect client acceptance, and seamlessly transition closed accounts to billing." }
    ],
    faqs: [
      {
        question: "Can C Vidya Enterprise CRM integrate with WhatsApp and email?",
        answer: "Yes, it integrates with official WhatsApp Business APIs and corporate email services to log conversations directly inside the prospect's CRM timeline."
      },
      {
        question: "Can we customize pipeline deal stages?",
        answer: "Yes, administrators can create unlimited custom pipeline funnels with custom deal stages, mandatory qualification fields, and automated alerts."
      },
      {
        question: "Is data export supported for reporting?",
        answer: "Yes, authorized users can export leads, contact histories, and financial summaries to Excel or CSV at any time."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "petrol-pump": {
    id: "petrol-pump",
    slug: "petrol-pump-management",
    urlPath: "/software/petrol-pump-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/petrol-pump-management/",
    type: "software",
    breadcrumbName: "Petrol Pump Management",
    h1Title: "C Vidya Cloud-Based Petrol Pump Management Suite",
    metaTitle: "C Vidya Petrol Pump Software | Fuel Station ERP & Tank Reconciliation",
    metaDescription: "Cloud retail fuel station management software for IOCL, BPCL, HPCL, and Shell dealerships. Track dispenser nozzle meters, underground tank dips, and fleet credit.",
    category: "Energy & Fuel Station SaaS",
    primaryKeyword: "C Vidya Petrol Pump Management Software",
    secondaryKeywords: [
      "petrol pump software",
      "fuel station management system",
      "petrol pump billing software",
      "fuel station ERP",
      "underground tank dip reconciliation",
      "dispenser nozzle meter software",
      "fleet credit khata software",
      "petrol pump GST billing"
    ],
    targetUsers: [
      { role: "Petrol Pump Dealership Owners", description: "Prevent fuel theft and meter tampering with shift-wise density and dip-to-sale variance audits." },
      { role: "Station Managers & Shift Cashiers", description: "Reconcile nozzle totalizer counters against cash collections, card swipes, and UPI payments." },
      { role: "Fleet Transport Accounts Clerks", description: "Maintain vehicle credit ledgers, verify vehicle indent slips, and issue computerized monthly invoices." }
    ],
    problemsSolved: [
      { problem: "Fuel losses and unexplained variance between tank dip and nozzle sales", solution: "Temperature and density-calibrated variance formula flagging unauthorized shrinkage or underground leaks." },
      { problem: "Cashier shortages during shift changeovers", solution: "Shift settlement sheets reconciling opening and closing meter readings against collected tender." },
      { problem: "Unpaid vehicle fleet credit accounts causing cash crunches", solution: "Vehicle-wise credit limits, indent slip verification, and automated monthly statement dispatches." }
    ],
    benefits: [
      { metric: "100%", label: "Nozzle-to-Cash Settlement", detail: "Exact shift reconciliation between totalizer meters and collections" },
      { metric: "0.1%", label: "Underground Dip Variance Audit", detail: "Density-calibrated audits preventing undetected fuel losses" },
      { metric: "30 Days", label: "Fleet Credit Ledger Automation", detail: "Vehicle-specific credit limits with automated monthly billing" }
    ],
    workflow: [
      { step: "01", title: "Shift Meter Ingestion", detail: "Record opening and closing dispenser totalizer readings across High-Speed Diesel (HSD), Petrol (MS), and CNG nozzles." },
      { step: "02", title: "Underground Tank Dip Calibration", detail: "Input physical dip rod measurements to compare actual storage tank stock against theoretical book sales." },
      { step: "03", title: "Cashier & Credit Settlement", detail: "Audit cash, digital UPI/POS receipts, and vehicle fleet indent slips before signing off on the shift cashbook." }
    ],
    faqs: [
      {
        question: "Does the software support all major oil marketing dealership standards (IOCL, BPCL, HPCL, Nayara, Shell)?",
        answer: "Yes, C Vidya Petrol Pump Suite is tailored to Indian oil marketing company operational guidelines, including daily density tests, sales registers, and GST formats."
      },
      {
        question: "How does the system handle fleet credit billing?",
        answer: "You can register transport companies with authorized vehicle registration numbers, set credit limits, log individual fuel slips, and generate monthly consolidated bills."
      },
      {
        question: "Can managers view pump metrics remotely on their mobile phones?",
        answer: "Yes, the cloud-based dashboard provides real-time access to live shift sales, tank stock levels, and outstanding debtor balances from any smartphone."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "care-plus": {
    id: "care-plus",
    slug: "healthcare-management",
    urlPath: "/software/healthcare-management/",
    canonicalUrl: "https://cvidyasolutions.com/software/healthcare-management/",
    type: "software",
    breadcrumbName: "Healthcare Management",
    h1Title: "Care Plus Healthcare & Hospital Management System",
    metaTitle: "Care Plus Healthcare Software | Hospital Management ERP & Clinic EHR",
    metaDescription: "Integrated healthcare ERP for hospitals, specialty clinics, and diagnostic centers. Manage OPD/IPD registrations, digital EHR prescriptions, pharmacy POS, and lab tests.",
    category: "Healthcare & Clinical SaaS",
    primaryKeyword: "Care Plus Healthcare Management Software",
    secondaryKeywords: [
      "hospital management software",
      "clinic management system",
      "healthcare ERP",
      "electronic health records software",
      "EHR software India",
      "OPD IPD management software",
      "hospital billing software",
      "pharmacy POS software",
      "diagnostic lab software"
    ],
    targetUsers: [
      { role: "Hospital Medical Directors & Administrators", description: "Real-time bed occupancy oversight, doctor scheduling rosters, and integrated financial cashbooks." },
      { role: "Consultant Physicians & Surgeons", description: "Access patient medical histories, prescribe digital Rx, order lab tests, and log clinical notes." },
      { role: "Hospital Pharmacy & Lab Managers", description: "Streamline medication dispensation with batch expiry tracking and automated pathology test reports." }
    ],
    problemsSolved: [
      { problem: "Overcrowded reception queues and lost paper patient records", solution: "Digital token queue management and unified Electronic Health Records (EHR) accessible across departments." },
      { problem: "Billing discrepancies between treatments, labs, and medicines", solution: "Consolidated patient ledger tracking doctor fees, room tariffs, consumables, and pharmacy items in one bill." },
      { problem: "Expired medicines in hospital pharmacy inventories", solution: "Proactive FIFO/FEFO batch expiration alerts preventing stock losses and ensuring patient safety." }
    ],
    benefits: [
      { metric: "100%", label: "Paperless Clinical Workflow", detail: "Digital patient records accessible securely across hospital departments" },
      { metric: "60%", label: "Shorter Patient Wait Times", detail: "Digital token queues and streamlined doctor appointment schedules" },
      { metric: "Zero", label: "Pharmacy Expiration Waste", detail: "Automated early warning system for near-expiry medication batches" }
    ],
    workflow: [
      { step: "01", title: "OPD/IPD Patient Registration", detail: "Register patient demographic details, assign Unique Health ID (UHID), and allocate doctor queue token or IPD bed." },
      { step: "02", title: "Clinical Consultation & Diagnostics", detail: "Physicians record vital signs, issue digital e-prescriptions, and order pathology tests linked directly to the patient profile." },
      { step: "03", title: "Discharge & Consolidated Billing", detail: "Reconcile bed charges, doctor visits, lab reports, and pharmacy dispensations into an itemized GST hospital discharge invoice." }
    ],
    faqs: [
      {
        question: "Is patient medical data stored securely and privately?",
        answer: "Yes, Care Plus utilizes role-based encryption protocols complying with healthcare data privacy standards and ABDM guidelines."
      },
      {
        question: "Can it handle both OPD and IPD workflows?",
        answer: "Yes, it supports out-patient consultations, token queues, in-patient bed allocation, nursing station charts, and OT scheduling."
      },
      {
        question: "Does the system integrate with diagnostic lab equipment?",
        answer: "Yes, it provides standardized test report templates and can integrate with digital pathology equipment."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "pdf-media-tools": {
    id: "pdf-media-tools",
    slug: "pdf-media-tools",
    urlPath: "/software/pdf-media-tools/",
    canonicalUrl: "https://cvidyasolutions.com/software/pdf-media-tools/",
    type: "software",
    breadcrumbName: "PDF & Media Tools",
    h1Title: "C Vidya PDF and Media Tools SaaS",
    metaTitle: "C Vidya PDF & Media Tools | Online Document & Conversion Suite",
    metaDescription: "High-speed document and media conversion engine. Merge, split, compress, and OCR PDFs, convert Word documents to standard PDF, and optimize media files securely.",
    category: "Document & Media Utilities",
    primaryKeyword: "C Vidya PDF and Media Tools SaaS",
    secondaryKeywords: [
      "PDF tools online",
      "compress PDF software",
      "merge PDF online",
      "Word to PDF converter",
      "OCR PDF software",
      "split PDF online",
      "document conversion suite",
      "image compression tool"
    ],
    targetUsers: [
      { role: "Corporate Legal & Finance Teams", description: "Merge multi-page contracts, digitally watermark sensitive balance sheets, and apply cryptographic password locks." },
      { role: "Academic Offices & Students", description: "Convert research Word documents to publication-grade PDFs and compress large thesis submissions." },
      { role: "Marketing & Design Agencies", description: "Batch convert heavy graphics to modern WebP formats and transcode media assets without quality degradation." }
    ],
    problemsSolved: [
      { problem: "Oversized documents rejected by government and institutional upload portals", solution: "Lossless compression engine reducing file sizes by up to 80% while preserving typography and vectors." },
      { problem: "Sensitive corporate data exposed on third-party public conversion websites", solution: "Zero-retention client-side edge processing ensuring documents never leave private memory." },
      { problem: "Scanned paper documents inaccessible for copy-pasting", solution: "Built-in Optical Character Recognition (OCR) converting scanned image PDFs into searchable text." }
    ],
    benefits: [
      { metric: "80%", label: "Document Size Compression", detail: "Lossless compression algorithm preserving vector fonts and images" },
      { metric: "0.4s", label: "Average Processing Latency", detail: "Instant client-side WASM processing with zero server retention" },
      { metric: "100%", label: "Data Privacy & Zero Retention", detail: "Files processed in isolated sandboxes and cleared immediately" }
    ],
    workflow: [
      { step: "01", title: "Select & Upload Document", detail: "Drag and drop single or multiple PDF, Word, or graphic files into the secure conversion canvas." },
      { step: "02", title: "Configure Transformation", detail: "Select desired operation: Merge, Split, Compress, Watermark, OCR, or Format Conversion." },
      { step: "03", title: "Instant Download & Cleanup", detail: "Download transformed assets immediately; all cached buffers are purged automatically." }
    ],
    faqs: [
      {
        question: "Are uploaded documents stored on C Vidya servers?",
        answer: "No. All conversion and compression operations are performed using zero-retention edge architecture. Documents are discarded immediately after processing."
      },
      {
        question: "Can it convert Microsoft Word documents to PDF?",
        answer: "Yes, it contains a specialized Word-to-PDF parser that preserves paragraph XML structure, tables, and typography."
      },
      {
        question: "What is the maximum file size supported?",
        answer: "The free web utility supports files up to 50MB, with enterprise tiers supporting batch processing of unlimited sizes."
      }
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web, Cloud, Windows, Android, iOS"
  },
  "ai-social": {
    id: "ai-social",
    slug: "social-media",
    urlPath: "/ai-agents/social-media/",
    canonicalUrl: "https://cvidyasolutions.com/ai-agents/social-media/",
    type: "ai-agent",
    breadcrumbName: "Social Media AI Agent",
    h1Title: "C Vidya AI Social Media Marketing Agent",
    metaTitle: "C Vidya AI Social Media Agent | Autonomous Social Content & Growth Engine",
    metaDescription: "Autonomous AI social media agent to research viral trends, craft high-converting copy, schedule cross-platform posts, and nurture leads across LinkedIn, Twitter, and Instagram.",
    category: "Autonomous AI Marketing",
    primaryKeyword: "C Vidya AI Social Media Agent",
    secondaryKeywords: [
      "AI social media agent",
      "autonomous social media marketing",
      "AI content creation",
      "social media automation",
      "AI post scheduler",
      "LinkedIn AI growth",
      "Instagram AI marketing"
    ],
    targetUsers: [
      { role: "B2B SaaS & Tech Founders", description: "Establish consistent thought leadership on LinkedIn and X (Twitter) without dedicating hours to writing." },
      { role: "Digital Marketing Agencies", description: "Scale client content output 5x with automated trend identification, carousel design, and multi-channel scheduling." },
      { role: "E-Commerce & DTC Brands", description: "Maintain 24/7 engagement, auto-respond to product queries in Instagram DMs, and convert commenters into buyers." }
    ],
    problemsSolved: [
      { problem: "Inconsistent posting leading to plummeting social reach", solution: "Autonomous calendar planner ensuring daily cadence during peak audience engagement hours." },
      { problem: "Writer's block and generic AI copy that gets ignored", solution: "Context-aware models trained on viral hooks, industry case studies, and brand-specific voice guidelines." },
      { problem: "Unanswered comments and missed buyer intent in DMs", solution: "Sub-second sentiment monitoring that replies to common questions and routes qualified leads directly to CRM." }
    ],
    benefits: [
      { metric: "+48%", label: "Audience Engagement Growth", detail: "Viral hook analysis and optimal posting time optimization" },
      { metric: "24/7", label: "Automated Comment & DM Replies", detail: "Instant nurturing of prospect comments with demo links" },
      { metric: "4x", label: "Content Production Velocity", detail: "Generate weeks of multi-channel carousels and threads in minutes" }
    ],
    workflow: [
      { step: "01", title: "Trend Ingestion & Brand Voice Alignment", detail: "The AI agent ingests current industry topics and calibrates copy to your specific tone of voice." },
      { step: "02", title: "Autonomous Creative & Copy Drafting", detail: "Generates tailored LinkedIn carousels, Twitter/X threads, and Instagram visuals with optimized hashtags." },
      { step: "03", title: "Multi-Platform Scheduling & Lead Capture", detail: "Auto-publishes to connected channels and monitors replies to qualify buying interest into your sales pipeline." }
    ],
    faqs: [
      {
        question: "Which social media platforms does the AI agent support?",
        answer: "It supports LinkedIn (Personal Profiles & Company Pages), Twitter/X, Instagram, and Facebook Business pages."
      },
      {
        question: "Do I have the option to review posts before they are published?",
        answer: "Yes, you can operate in Semi-Autonomous mode with a visual approval queue, or switch to Fully Autonomous mode once brand trust is established."
      },
      {
        question: "How does it capture leads from comments?",
        answer: "When a user comments a designated trigger keyword or expresses interest, the agent sends an automated personalized direct message with the requested resource or booking link."
      }
    ],
    schemaType: "Service",
    applicationCategory: "MarketingApplication",
    operatingSystem: "Cloud, Web"
  },
  "ai-support": {
    id: "ai-support",
    slug: "customer-support",
    urlPath: "/ai-agents/customer-support/",
    canonicalUrl: "https://cvidyasolutions.com/ai-agents/customer-support/",
    type: "ai-agent",
    breadcrumbName: "Customer Support AI Agent",
    h1Title: "C Vidya AI Customer Support Agent",
    metaTitle: "C Vidya AI Customer Support | Autonomous 24/7 Enterprise Support Agent",
    metaDescription: "Autonomous 24/7 AI customer support agent with sub-second RAG resolution, omnichannel chat widgets, intelligent ticket routing, and seamless human escalation.",
    category: "Autonomous AI Customer Service",
    primaryKeyword: "C Vidya AI Customer Support",
    secondaryKeywords: [
      "AI customer support",
      "AI support agent",
      "customer service automation",
      "AI chatbot",
      "automated customer support",
      "RAG customer support",
      "omnichannel AI support",
      "AI ticketing system"
    ],
    targetUsers: [
      { role: "Customer Support Directors", description: "Deflect 80%+ of repetitive tier-1 tickets while maintaining customer satisfaction (CSAT) above 4.8/5." },
      { role: "E-Commerce & SaaS Operations", description: "Provide 24/7 instant resolutions for order tracking, subscription modifications, and technical troubleshooting." },
      { role: "Human Support Specialists", description: "Receive pre-qualified escalation summaries with full conversation context when complex intervention is needed." }
    ],
    problemsSolved: [
      { problem: "Customers waiting hours for basic answers during off-hours", solution: "Sub-second 24/7 RAG answers grounded strictly in your official product documentation." },
      { problem: "Hallucinated answers from generic AI chatbots", solution: "Zero-hallucination guardrails restricting answers exclusively to verified enterprise knowledge sources." },
      { problem: "Frustrated customers stuck in endless bot loops", solution: "Intelligent sentiment triage escalating to human team members with full conversation context." }
    ],
    benefits: [
      { metric: "0.8s", label: "Average Response Latency", detail: "Instant accurate context retrieval from company documentation" },
      { metric: "92%", label: "Autonomous Ticket Resolution Rate", detail: "Resolves repetitive tier-1 queries without human intervention" },
      { metric: "4.9/5", label: "Average Customer CSAT", detail: "High user satisfaction backed by accurate and polite assistance" }
    ],
    workflow: [
      { step: "01", title: "Knowledge Base Ingestion", detail: "Connect your help center articles, API documentation, PDFs, and past ticket resolutions into secure vector storage." },
      { step: "02", title: "Omnichannel Deployment", detail: "Embed our sleek web chat widget, connect your official WhatsApp Business API, or route support emails." },
      { step: "03", title: "Sub-Second Resolution & Escalation", detail: "The AI agent resolves queries instantly or neatly escalates complex issues to your human team with summarized context." }
    ],
    faqs: [
      {
        question: "How does the AI prevent hallucinating incorrect answers?",
        answer: "It uses Retrieval-Augmented Generation (RAG) with strict enterprise guardrails: if an answer is not present in your verified knowledge base, it transparently offers to connect the user with a human specialist."
      },
      {
        question: "Can it integrate with our existing ticketing desk (Zendesk, Freshdesk, CRM)?",
        answer: "Yes, it integrates with modern helpdesks via webhooks and REST APIs to create, update, and close tickets automatically."
      },
      {
        question: "Does it support multiple languages?",
        answer: "Yes, it supports over 50 global languages including English, Hindi, Spanish, French, and German natively."
      }
    ],
    schemaType: "Service",
    applicationCategory: "CustomerServiceApplication",
    operatingSystem: "Cloud, Web"
  },
  "ai-salesflow": {
    id: "ai-salesflow",
    slug: "sales-flow",
    urlPath: "/ai-agents/sales-flow/",
    canonicalUrl: "https://cvidyasolutions.com/ai-agents/sales-flow/",
    type: "ai-agent",
    breadcrumbName: "Sales Flow AI Agent",
    h1Title: "C Vidya Business SalesFlow AI Agent",
    metaTitle: "C Vidya Sales Flow AI | Autonomous B2B Prospecting & SDR Automation",
    metaDescription: "Autonomous AI sales development representative (SDR) to discover verified B2B leads, generate tailored multi-touch email sequences, qualify intent, and book sales demos.",
    category: "Autonomous AI Sales",
    primaryKeyword: "C Vidya Sales Flow AI",
    secondaryKeywords: [
      "AI sales automation",
      "lead follow-up automation",
      "sales CRM",
      "WhatsApp sales automation",
      "AI lead management",
      "AI SDR agent",
      "B2B lead generation AI",
      "automated demo booking"
    ],
    targetUsers: [
      { role: "B2B Sales Executives & Founders", description: "Automate outbound prospecting and keep sales rep calendars filled with qualified product demo calls." },
      { role: "Outbound SDR Teams", description: "Supercharge outreach volume by generating hyper-personalized research angles for each target executive." },
      { role: "B2B Agency Growth Specialists", description: "Run multi-client outreach campaigns with dedicated inbox rotation and spam-score protection." }
    ],
    problemsSolved: [
      { problem: "Sales reps spending 70% of time prospecting instead of closing deals", solution: "Autonomous B2B prospect discovery identifying verified corporate emails, phone numbers, and decision-maker roles." },
      { problem: "Low reply rates caused by generic mass cold emails", solution: "Hyper-personalized 1-on-1 pitch generation referencing prospect recent company news, hiring trends, and tech stack." },
      { problem: "Back-and-forth friction in scheduling product demos", solution: "Natural language calendar booking directly offering meeting slots inside email or WhatsApp threads." }
    ],
    benefits: [
      { metric: "68.4%", label: "Average Email Open Rate", detail: "High deliverability via optimized domain warm-up and personalization" },
      { metric: "+38%", label: "Lead Qualification Conversion", detail: "Intelligent BANT qualification filtering out unqualified inquiries" },
      { metric: "94+", label: "Monthly Demos Booked Automatically", detail: "Direct meeting placement on account executives' Google/Outlook calendars" }
    ],
    workflow: [
      { step: "01", title: "Target Account & Persona Definition", detail: "Specify your Ideal Customer Profile (ICP), industry verticals, company size, and executive job titles." },
      { step: "02", title: "Autonomous Discovery & Research", detail: "The agent identifies verified decision-maker contacts and conducts automated account research to identify pain points." },
      { step: "03", title: "Multi-Touch Cadence & Demo Booking", detail: "Dispatches tailored outreach across Email, LinkedIn, and WhatsApp, qualifying replies and booking demos on your calendar." }
    ],
    faqs: [
      {
        question: "How does SalesFlow AI ensure emails do not land in spam?",
        answer: "It utilizes automated inbox rotation, SPF/DKIM/DMARC deliverability protocols, slow ramp-up warmups, and personalized natural language variations that evade bulk-mail filters."
      },
      {
        question: "Can it qualify leads based on our specific budget criteria?",
        answer: "Yes, you can configure BANT (Budget, Authority, Need, Timeline) qualification logic so only prospects meeting your criteria receive calendar booking links."
      },
      {
        question: "Does it sync with our CRM?",
        answer: "Yes, all discovered contacts, email histories, and booked meetings sync directly with C Vidya Enterprise CRM, HubSpot, or Salesforce."
      }
    ],
    schemaType: "Service",
    applicationCategory: "SalesApplication",
    operatingSystem: "Cloud, Web"
  },
  "ai-marketing": {
    id: "ai-marketing",
    slug: "b2b-marketing",
    urlPath: "/ai-agents/b2b-marketing/",
    canonicalUrl: "https://cvidyasolutions.com/ai-agents/b2b-marketing/",
    type: "ai-agent",
    breadcrumbName: "B2B Marketing AI Agent",
    h1Title: "C Vidya AI Marketing for B2B SaaS Companies",
    metaTitle: "C Vidya AI Marketing for B2B SaaS | Inbound Demand Gen & Content Engine",
    metaDescription: "Autonomous AI marketing engine for B2B SaaS companies. Research keyword search gaps, publish technical SEO content clusters, write landing pages, and accelerate MQLs.",
    category: "Autonomous AI SaaS Growth",
    primaryKeyword: "C Vidya AI Marketing for B2B SaaS",
    secondaryKeywords: [
      "AI marketing for SaaS",
      "B2B SaaS marketing AI",
      "inbound demand gen AI",
      "SEO content automation",
      "competitor gap analysis",
      "SaaS content cluster",
      "MQL velocity",
      "SaaS CAC reduction"
    ],
    targetUsers: [
      { role: "B2B SaaS Chief Marketing Officers", description: "Accelerate inbound organic traffic with comprehensive topic clusters that rank for high-intent buyer keywords." },
      { role: "Product Marketing Managers (PMM)", description: "Generate competitor comparison matrices, technical feature teardowns, and high-converting landing page copy." },
      { role: "Content Marketing Leads", description: "Scale technical blog production from 2 articles a month to 20 publication-grade articles with zero fluff." }
    ],
    problemsSolved: [
      { problem: "High paid customer acquisition costs (CAC) eating margins", solution: "Builds compounding organic inbound search assets targeting bottom-of-funnel 'alternative to' and 'software for' queries." },
      { problem: "Superficial AI-generated blog posts that fail to rank on Google", solution: "Deep semantic topic research models citing real architecture diagrams, workflows, and actionable technical solutions." },
      { problem: "Lack of clear attribution between content and pipeline revenue", solution: "Integrated conversion tracking measuring which articles and lead magnets generate qualified sales pipeline." }
    ],
    benefits: [
      { metric: "+148%", label: "Organic Inbound Traffic Growth", detail: "High-intent keyword cluster capture across Google search results" },
      { metric: "-34%", label: "Customer Acquisition Cost (CAC)", detail: "Reduced reliance on costly Google and LinkedIn paid ads" },
      { metric: "+42%", label: "Monthly Marketing Qualified Leads", detail: "Targeted lead magnets and strategic CTA placement across articles" }
    ],
    workflow: [
      { step: "01", title: "Competitor Search Gap Audit", detail: "Analyzes competitor keyword rankings and discovers underserved high-intent search queries in your SaaS niche." },
      { step: "02", title: "Pillar & Cluster Content Generation", detail: "Authors comprehensive 2,500+ word technical comparison guides, product walkthroughs, and executive thought pieces." },
      { step: "03", title: "Distribution & Funnel Optimization", detail: "Syndicates highlights to LinkedIn newsletters, creates downloadable PDF guides, and A/B tests high-converting CTA copy." }
    ],
    faqs: [
      {
        question: "Are articles written by the AI agent penalized by Google?",
        answer: "No. The agent is built around Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines, prioritizing deep technical accuracy, real product architecture, and clear human-first value."
      },
      {
        question: "Can it generate competitor comparison pages (e.g. 'Software X vs Software Y')?",
        answer: "Yes, it excels at objective, high-converting comparison matrices and migration guides that capture prospects actively shopping for solutions."
      },
      {
        question: "How does it measure pipeline attribution?",
        answer: "It embeds UTM tracking parameters and conversion pixels to trace form fills and demo bookings directly back to specific content pieces."
      }
    ],
    schemaType: "Service",
    applicationCategory: "MarketingApplication",
    operatingSystem: "Cloud, Web"
  }
};

export const CORE_PAGES_SEO = {
  home: {
    title: "C Vidya Solutions | Cloud Software, SaaS & AI Automation",
    description: "C Vidya Solutions is a premier technology company delivering cloud software, multi-tenant SaaS suites, and autonomous AI agents for modern enterprises.",
    canonical: "https://cvidyasolutions.com/",
    h1: "Architecting the Future of Enterprise Software & Autonomous AI Automation"
  },
  softwareDirectory: {
    title: "C Vidya Software Solutions | Enterprise Cloud & SaaS Suites",
    description: "Explore the complete portfolio of C Vidya Solutions software suites: Library Automation, Gym Fitness Zone, Campus ERP, Enterprise CRM, and Fuel Station Management.",
    canonical: "https://cvidyasolutions.com/software/",
    h1: "C Vidya Enterprise Software Solutions"
  },
  aiAgentsDirectory: {
    title: "Autonomous AI Agents | C Vidya Solutions AI Automation Suite",
    description: "Discover autonomous AI agents for B2B enterprises: Social Media Marketing AI, 24/7 Customer Support RAG Agent, Outbound SalesFlow SDR, and SaaS Growth Marketing AI.",
    canonical: "https://cvidyasolutions.com/ai-agents/",
    h1: "C Vidya Autonomous AI Agents & Business Automation"
  },
  services: {
    title: "Services & SaaS Products | C Vidya Solutions Technology Consulting",
    description: "End-to-end technology consulting, custom software engineering, cloud infrastructure modernization, and autonomous AI automation services by C Vidya Solutions.",
    canonical: "https://cvidyasolutions.com/services/",
    h1: "Enterprise Technology Services & Cloud SaaS Products"
  },
  about: {
    title: "About C Vidya Solutions | Company Mission, Leadership & Engineering",
    description: "Learn about C Vidya Solutions: our engineering philosophy, corporate headquarters in Dhanbad, R&D labs, and mission to build scalable digital infrastructure.",
    canonical: "https://cvidyasolutions.com/about/",
    h1: "About C Vidya Solutions"
  },
  contact: {
    title: "Contact Us & Regional Offices | C Vidya Solutions",
    description: "Get in touch with C Vidya Solutions. Connect with our director desk, schedule an enterprise product demonstration, or visit our regional engineering offices.",
    canonical: "https://cvidyasolutions.com/contact/",
    h1: "Contact C Vidya Solutions"
  },
  pricing: {
    title: "Transparent Software & AI Agent Pricing | C Vidya Solutions",
    description: "Explore transparent pricing models for C Vidya software suites and autonomous AI agents. Flexible starter, growth, and enterprise deployment packages.",
    canonical: "https://cvidyasolutions.com/pricing/",
    h1: "Transparent Software & Autonomous AI Pricing"
  },
  blog: {
    title: "Technology Insights & Engineering Articles | C Vidya Solutions",
    description: "Technical articles, architectural case studies, and engineering guides on cloud-native SaaS development, biometric access control, and enterprise AI automation.",
    canonical: "https://cvidyasolutions.com/blog/",
    h1: "Engineering Insights & Enterprise Technology Articles"
  },
  portfolio: {
    title: "Portfolio & Engineering Case Studies | C Vidya Solutions",
    description: "Review real-world deployment case studies and systems architecture diagrams delivered across educational campuses, retail enterprises, and commercial logistics.",
    canonical: "https://cvidyasolutions.com/portfolio/",
    h1: "Enterprise Engineering Portfolio & Case Studies"
  },
  careers: {
    title: "Careers & Open Positions | C Vidya Solutions",
    description: "Join C Vidya Solutions. Explore open software engineering, full-stack development, and artificial intelligence research positions at our R&D hub.",
    canonical: "https://cvidyasolutions.com/careers/",
    h1: "Build the Future With C Vidya Solutions"
  },
  faq: {
    title: "Frequently Asked Questions | C Vidya Solutions Software & AI",
    description: "Comprehensive answers to common questions regarding deployment timelines, cloud hosting security, multi-tenant billing, and technical support SLAs.",
    canonical: "https://cvidyasolutions.com/faq/",
    h1: "Frequently Asked Questions"
  },
  privacy: {
    title: "Privacy Policy | C Vidya Solutions Data Protection",
    description: "Read the C Vidya Solutions Privacy Policy. Understand how we collect, process, encrypt, and protect your enterprise and institutional data.",
    canonical: "https://cvidyasolutions.com/privacy/",
    h1: "Privacy Policy & Data Protection"
  },
  terms: {
    title: "Terms of Service | C Vidya Solutions Software Agreement",
    description: "Review C Vidya Solutions Terms of Service, licensing conditions, multi-tenant cloud usage policies, and service level commitments.",
    canonical: "https://cvidyasolutions.com/terms/",
    h1: "Terms of Service"
  },
  billing: {
    title: "Billing & Subscription Terms | C Vidya Solutions",
    description: "Transparent billing policies, GST-compliant invoicing, renewal schedules, and modular software payment terms for C Vidya Solutions.",
    canonical: "https://cvidyasolutions.com/billing/",
    h1: "Billing & Subscription Terms"
  },
  refund: {
    title: "Refund Policy | C Vidya Solutions Software Licensing",
    description: "Clear and fair refund policies for C Vidya Solutions SaaS subscriptions, module setup fees, and enterprise onboarding agreements.",
    canonical: "https://cvidyasolutions.com/refund/",
    h1: "Refund & Cancellation Policy"
  },
  cookies: {
    title: "Cookie Policy | C Vidya Solutions Web Privacy",
    description: "Learn about the essential, performance, and analytical cookies utilized across C Vidya Solutions websites and cloud applications.",
    canonical: "https://cvidyasolutions.com/cookies/",
    h1: "Cookie Policy & Web Tracking"
  },
  disclaimer: {
    title: "Legal & Regulatory Disclaimer | C Vidya Solutions",
    description: "Legal disclaimers, liability limitations, intellectual property notices, and regulatory compliance disclosures for C Vidya Solutions.",
    canonical: "https://cvidyasolutions.com/disclaimer/",
    h1: "Legal & Regulatory Disclaimer"
  },
  portability: {
    title: "Data Portability & Zero Lock-in Policy | C Vidya Solutions",
    description: "C Vidya Solutions guarantees zero data lock-in. Export complete relational databases in Excel, CSV, and JSON format at any time.",
    canonical: "https://cvidyasolutions.com/portability/",
    h1: "Data Portability & Export Guarantee"
  }
};

export interface PageSeoResult {
  title: string;
  description: string;
  canonicalUrl: string;
  h1: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  robots?: string;
  keywords?: string[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export function getPageSeo(pathname: string): PageSeoResult {
  let cleanPath = pathname.replace(/\/+$/, "");
  if (!cleanPath || cleanPath === "") cleanPath = "/";

  // 1. Homepage
  if (cleanPath === "/") {
    return {
      title: CORE_PAGES_SEO.home.title,
      description: CORE_PAGES_SEO.home.description,
      canonicalUrl: CORE_PAGES_SEO.home.canonical,
      h1: CORE_PAGES_SEO.home.h1,
      ogType: "website",
      ogImage: "https://cvidyasolutions.com/og-image.png",
      robots: "index, follow",
      keywords: ["C Vidya Solutions", "C Vidya", "Software Company", "SaaS Solutions India", "Cloud Business Software", "Autonomous AI Agents"]
    };
  }

  // 2. Product Landing Pages
  for (const product of Object.values(PRODUCT_SEO_DATA)) {
    const pPathClean = product.urlPath.replace(/\/+$/, "");
    if (cleanPath === pPathClean || 
        (product.type === "software" && cleanPath === `/software/${product.slug}`) ||
        (product.type === "ai-agent" && cleanPath === `/ai-agents/${product.slug}`)) {
      return {
        title: product.metaTitle,
        description: product.metaDescription,
        canonicalUrl: product.canonicalUrl,
        h1: product.h1Title,
        ogType: "product",
        ogImage: "https://cvidyasolutions.com/og-image.png",
        robots: "index, follow",
        keywords: [product.primaryKeyword, ...product.secondaryKeywords],
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": product.schemaType,
            "name": product.h1Title,
            "description": product.metaDescription,
            "url": product.canonicalUrl,
            "applicationCategory": product.applicationCategory,
            "operatingSystem": product.operatingSystem,
            "provider": {
              "@type": "Organization",
              "name": "C Vidya Solutions",
              "url": "https://cvidyasolutions.com"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cvidyasolutions.com/" },
              { "@type": "ListItem", "position": 2, "name": product.type === "software" ? "Software" : "AI Agents", "item": product.type === "software" ? "https://cvidyasolutions.com/software/" : "https://cvidyasolutions.com/ai-agents/" },
              { "@type": "ListItem", "position": 3, "name": product.breadcrumbName, "item": product.canonicalUrl }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": product.faqs.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": { "@type": "Answer", "text": f.answer }
            }))
          }
        ]
      };
    }
  }

  // 3. Blog & Topical Authority Articles
  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace(/^\/blog\//, "").replace(/\/+$/, "");
    const article = ARTICLES_DATA[slug];
    if (article) {
      return {
        title: article.metaTitle,
        description: article.metaDescription,
        canonicalUrl: article.canonicalUrl,
        h1: article.title,
        ogType: "article",
        ogImage: article.image || "https://cvidyasolutions.com/og-image.png",
        robots: "index, follow",
        keywords: article.tags,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.metaDescription,
            "image": article.image || "https://cvidyasolutions.com/og-image.png",
            "author": {
              "@type": "Person",
              "name": article.author.name,
              "jobTitle": article.author.role
            },
            "publisher": {
              "@type": "Organization",
              "name": "C Vidya Solutions",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cvidyasolutions.com/logo.png"
              }
            },
            "datePublished": article.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": article.canonicalUrl
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cvidyasolutions.com/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://cvidyasolutions.com/blog/" },
              { "@type": "ListItem", "position": 3, "name": article.title, "item": article.canonicalUrl }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": article.faqs.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": { "@type": "Answer", "text": f.answer }
            }))
          }
        ]
      };
    }
  }

  // 4. Core Directory & Standard Pages
  const coreMap: Record<string, keyof typeof CORE_PAGES_SEO> = {
    "/software": "softwareDirectory",
    "/ai-agents": "aiAgentsDirectory",
    "/services": "services",
    "/about": "about",
    "/contact": "contact",
    "/pricing": "pricing",
    "/blog": "blog",
    "/portfolio": "portfolio",
    "/careers": "careers",
    "/faq": "faq",
    "/privacy": "privacy",
    "/terms": "terms",
    "/billing": "billing",
    "/refund": "refund",
    "/cookies": "cookies",
    "/disclaimer": "disclaimer",
    "/portability": "portability"
  };

  if (coreMap[cleanPath]) {
    const key = coreMap[cleanPath];
    const data = CORE_PAGES_SEO[key];
    return {
      title: data.title,
      description: data.description,
      canonicalUrl: data.canonical,
      h1: data.h1,
      ogType: "website",
      ogImage: "https://cvidyasolutions.com/og-image.png",
      robots: "index, follow"
    };
  }

  // Default Fallback
  return {
    title: CORE_PAGES_SEO.home.title,
    description: CORE_PAGES_SEO.home.description,
    canonicalUrl: `https://cvidyasolutions.com${cleanPath}/`,
    h1: "C Vidya Solutions",
    ogType: "website",
    ogImage: "https://cvidyasolutions.com/og-image.png",
    robots: "index, follow"
  };
}
