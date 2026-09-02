import { ProductService } from "./types";
import libraryImg from "./assets/images/library_software_dashboard_1784909434916.jpg";
import fitnessImg from "./assets/images/fitness_software_dashboard_1784909454777.jpg";
import institutesImg from "./assets/images/institutes_software_dashboard_1784909550776.jpg";
import coachingImg from "./assets/images/coaching_software_dashboard_1784909470078.jpg";
import crmImg from "./assets/images/crm_software_dashboard_1784909507564.jpg";
import municipalImg from "./assets/images/municipal_software_dashboard_1784909536257.jpg";
import agrifusionImg from "./assets/images/agrifusion_software_dashboard_1784909491641.jpg";
import jewelryImg from "./assets/images/jewelry_software_dashboard_1784909522921.jpg";

// ==========================================
// 1. C VIDYA SOLUTIONS SAAS PRODUCTS
// ==========================================
export const saasProductsData: ProductService[] = [
  {
    id: "library",
    num: "01",
    name: "C VIDYA LIBRARY MANAGEMENT",
    tagline: "Automated Book Inflow & Student Membership Tracking",
    badge: "Cloud-Based SaaS",
    categoryType: "saas",
    description: "Complete library management system to manage books, student memberships, QR code checkout passes, overdue penalties, and automated inventory reconciliation.",
    externalLink: "https://v.cvidyasolutions.workers.dev/",
    imageUrl: libraryImg,
    features: [
      "ISBN barcode scanner & digital catalog repository",
      "Automated WhatsApp & SMS notifications for overdue titles",
      "Membership levels, circulation policy & fine calculations",
      "Digital student reading room check-in ledger & seat allocator",
      "Detailed reports on reader habits and high-demand books"
    ],
    mockData: {
      title: "C Vidya Library System Admin Dashboard",
      metrics: [
        { label: "Total Books Cataloged", value: "12,450", change: "+142 this week", isPositive: true },
        { label: "Active Members", value: "840", change: "+18 this month", isPositive: true },
        { label: "Books Out on Loan", value: "120", change: "Within capacity", isPositive: true },
        { label: "Overdue Penalties Pending", value: "x14", change: "Requires follow-up", isPositive: false }
      ],
      recentActivity: [
        "Pranav Kumar returned 'Clean Architecture' by Robert C. Martin",
        "Sneha Kumari renewed reference material 'Introduction to Algorithms' (3rd Ed)",
        "New reader membership card issued to Dr. Manoj Kumar (Academic Tier)",
        "Automated WhatsApp alert triggered for 4 books overdue beyond 7 days"
      ],
      chartData: [
        { name: "Mon", value: 45 },
        { name: "Tue", value: 68 },
        { name: "Wed", value: 52 },
        { name: "Thu", value: 89 },
        { name: "Fri", value: 71 },
        { name: "Sat", value: 30 }
      ]
    }
  },
  {
    id: "fitness",
    num: "02",
    name: "C VIDYA FITNESS ZONE",
    tagline: "Comprehensive Gym Plan & Biometric Turnstile Ledger",
    badge: "Cloud-Based SaaS",
    categoryType: "saas",
    description: "Gym & fitness management software to handle members, plans, attendance, biometric turnstile gates, trainers, and daily workout activities seamlessly.",
    externalLink: "https://fitzone.cvidyasolutions.workers.dev/",
    imageUrl: fitnessImg,
    features: [
      "Biometric finger scan and facial door access turnstile logs",
      "Personalized training diet regimes & fitness goal planners",
      "Flexible active subscription cards (Daily / Monthly / Yearly)",
      "Trainer assignment and private roster timetables",
      "Peak attendance and gym floor traffic heatmaps"
    ],
    mockData: {
      title: "C Vidya Fitness Zone Core Console",
      metrics: [
        { label: "Enrolled Gym Members", value: "612", change: "+24 new joints", isPositive: true },
        { label: "Floor Passes Today", value: "184", change: "Peak load at 6:30 PM", isPositive: true },
        { label: "Monthly Plans Ending Today", value: "8", change: "Auto-invoices sent", isPositive: true },
        { label: "Unpaid Subscription Flags", value: "x7", change: "Turnstile auto-lock active", isPositive: false }
      ],
      recentActivity: [
        "Rakesh Sharma scanned door RFID at Gym Entrance at 07:15 AM",
        "Trainer Neeraj updated 'Lean Shred v3' diet card for members",
        "Premium Annual payment ₹18,500 done by Ananya Sen (receipt #F-482)",
        "Ramesh Yadav changed package tier from 'Cardio Only' to 'Complete Gym + Spa'"
      ],
      chartData: [
        { name: "Mon", value: 120 },
        { name: "Tue", value: 140 },
        { name: "Wed", value: 135 },
        { name: "Thu", value: 160 },
        { name: "Fri", value: 155 },
        { name: "Sat", value: 95 }
      ]
    }
  },
  {
    id: "institutes",
    num: "03",
    name: "C VIDYA INSTITUTES MANAGEMENT",
    tagline: "Multi-branch Campus Admissions & Smart Fees Portal",
    badge: "Cloud-Based SaaS",
    categoryType: "saas",
    description: "All-in-one ERP solution for schools, colleges, and academic institutes to manage student admissions, fees collection, attendance, exams, and results.",
    externalLink: "https://institutes.cvidyasolutions.workers.dev/",
    imageUrl: institutesImg,
    features: [
      "End-to-end admission counseling CRM pipeline",
      "Automated academic report cards & gradebook generator",
      "Instantly downloadable PDF school ledger & cashbooks",
      "School bus route tracking, geo-alerts & dormitory slots",
      "Dedicated portal for Parents to check homework & attendance"
    ],
    mockData: {
      title: "C Vidya Central Institutes Console",
      metrics: [
        { label: "Registered Enrolled Students", value: "1,420", change: "98% Retained", isPositive: true },
        { label: "Term Average Attendance", value: "94.6%", change: "+0.8% YoY Improvement", isPositive: true },
        { label: "Admission Term Fee Collected", value: "₹18.4L", change: "Goal: ₹22.0L", isPositive: true },
        { label: "Faculty / Academic Advisors", value: "64", change: "All slots staffed", isPositive: true }
      ],
      recentActivity: [
        "High-School Grade Sheets compiled under CBSE standard for Class X-A",
        "Fees reminder notification sent to parents of Class V & VIII",
        "Class IX-C Chemistry Laboratory session timetables changed",
        "Grievance resolved: Bus Route #4 departure time adjusted to 02:45 PM"
      ],
      chartData: [
        { name: "Mon", value: 1400 },
        { name: "Tue", value: 1390 },
        { name: "Wed", value: 1420 },
        { name: "Thu", value: 1380 },
        { name: "Fri", value: 1410 },
        { name: "Sat", value: 200 }
      ]
    }
  },
  {
    id: "coaching",
    num: "04",
    name: "C VIDYA COACHING MANAGEMENT",
    tagline: "Aspirants Test Analytics & Automated SMS Broadcasts",
    badge: "Cloud-Based SaaS",
    categoryType: "saas",
    description: "Specially engineered for coaching centers & competitive academies to manage batches, student attendance, fees, OMR mock tests, and performance analytics.",
    externalLink: "https://coaching.cvidyasolutions.workers.dev/",
    imageUrl: coachingImg,
    features: [
      "Dynamic batch creation and classroom seating logs",
      "Biometric attendance with real-time SMS status sent to parents",
      "OMR offline mock test grading sheets scanner & rank generator",
      "Interactive course completion calendars and test schedules",
      "Mentor assignments and student doubt-clearing trackers"
    ],
    mockData: {
      title: "Coaching Center Student Tracker",
      metrics: [
        { label: "Active Cohort Batches", value: "18", change: "JEE / NEET / UPSC", isPositive: true },
        { label: "Active Students Enrolled", value: "480", change: "+42 in crash courses", isPositive: true },
        { label: "Batches Syllabus Done (%)", value: "82%", change: "On schedule", isPositive: true },
        { label: "Average Mock Class Rating", value: "4.8/5", change: "Highly satisfied", isPositive: true }
      ],
      recentActivity: [
        "IIT-JEE Adv v3 mock physics sheets published with scores",
        "Automated Absent SMS sent to guardian of Ajay Kumar (NEET Batch C)",
        "Doubt Ticket #912 'Thermodynamics Query' answered by Coach K. Verma",
        "New crash-course batch created for UP Board exam preparation"
      ],
      chartData: [
        { name: "Mon", value: 410 },
        { name: "Tue", value: 430 },
        { name: "Wed", value: 420 },
        { name: "Thu", value: 450 },
        { name: "Fri", value: 462 },
        { name: "Sat", value: 380 }
      ]
    }
  },
  {
    id: "farming",
    num: "05",
    name: "AGRIFUSION",
    tagline: "All-in-One Farming, Livestock & Agribusiness Management Software",
    subhead: "One Platform. Every Farm. Unlimited Growth.",
    badge: "Agribusiness SaaS",
    categoryType: "saas",
    description: "Powered by C Vidya Solutions, AgriFusion unifies poultry, fishery, goat farming, livestock, crop inventory, POS billing, accounting, and agribusiness analytics into one intelligent platform.",
    externalLink: "https://fresh.cvidyasolutions.workers.dev/",
    imageUrl: agrifusionImg,
    features: [
      "Poultry, fishery, goat farming & livestock herd management",
      "Unified inventory, POS retail/wholesale billing & accounting ledger",
      "Customer management, distributor orders & CRM workflows",
      "Business analytics, yield tracking & profitability forecasting",
      "IoT soil telemetry & crop-cycle timetable automation"
    ],
    mockData: {
      title: "AgriFusion Agribusiness Control Console",
      metrics: [
        { label: "Poultry & Livestock Stock", value: "12,400 Units", change: "Healthy feed cycles", isPositive: true },
        { label: "Fishery & Ponds Tracked", value: "8 Active Ponds", change: "Optimal pH water levels", isPositive: true },
        { label: "POS Sales & Invoicing", value: "₹2.8L Today", change: "+18% wholesale orders", isPositive: true },
        { label: "Inventory Feed Stock", value: "4.2 Tons", change: "Re-order in 5 days", isPositive: true }
      ],
      recentActivity: [
        "Poultry flock #B-14 feed dispatch & automated temperature regulation logged",
        "Fishery Pond #3 water quality test completed (pH 7.2, Dissolved Oxygen 6.8 mg/L)",
        "POS Billing invoice #AG-882 issued for 1.2 Tons organic fertilizer & fish feed",
        "Goat farming breeding registry updated for Section C livestock herds"
      ],
      chartData: [
        { name: "Mon", value: 85 },
        { name: "Tue", value: 88 },
        { name: "Wed", value: 92 },
        { name: "Thu", value: 91 },
        { name: "Fri", value: 94 },
        { name: "Sat", value: 98 }
      ]
    }
  },
  {
    id: "members",
    num: "06",
    name: "C VIDYA JEWELRY MANAGEMENT",
    tagline: "Precious Inventory Trackers & Daily Rate Billing Ledger",
    badge: "Bullion & Retail SaaS",
    categoryType: "saas",
    description: "Complete retail and wholesale jewelry management software to track precious metals (Gold, Silver, Diamond), cast weights, Karigar artisan jobs, and daily rate billing invoices.",
    externalLink: "https://jewelry.cvidyasolutions.workers.dev/",
    imageUrl: jewelryImg,
    features: [
      "Real-time inventory weight tracking for Gold, Silver and Diamond items",
      "Automated daily gold and silver bullion price feeds integration",
      "Karigar (Artisan) task logs, metal allocation, and wastage reports",
      "Custom customer jewelry order book with design spec catalogs",
      "In-store barcode label scanning and instant GST invoicing bills"
    ],
    mockData: {
      title: "C Vidya Custom Jewelry Ledger Panel",
      metrics: [
        { label: "Precious Gold Stock", value: "4.25 kg", change: "+85g casted today", isPositive: true },
        { label: "Active Orders Booked", value: "42 Customs", change: "15 in crafting queue", isPositive: true },
        { label: "Total Sales Billing", value: "₹18.6L", change: "This festive cycle", isPositive: true },
        { label: "Pending Karigar Tasks", value: "x6 Artisans", change: "Due for delivery", isPositive: false }
      ],
      recentActivity: [
        "Artisan Ramesh logged 24g pure gold weight casting completion for necklace #J-492",
        "Custom order booked: 18K Rose Gold wedding ring set for Client Shreya Paul",
        "In-store billing logged: Sold 10g Gold Coin (99.9% Purity) (invoice #S-829)",
        "Daily gold rate updated: 24K pure bullion locked at ₹72,500/10g"
      ],
      chartData: [
        { name: "Mon", value: 420 },
        { name: "Tue", value: 480 },
        { name: "Wed", value: 510 },
        { name: "Thu", value: 550 },
        { name: "Fri", value: 620 },
        { name: "Sat", value: 590 }
      ]
    }
  },
  {
    id: "crm",
    num: "07",
    name: "C VIDYA ENTERPRISE CRM",
    tagline: "Intuitive Sales Funnels & Lead Generation Metrics",
    badge: "Enterprise SaaS",
    categoryType: "saas",
    description: "Customer Relationship Management system to manage sales leads, deals pipeline, team KPIs, client quotations, and automated multi-stage customer engagement.",
    externalLink: "https://crm.cvidyasolutions.workers.dev/",
    imageUrl: crmImg,
    features: [
      "Dynamic pipeline cards with simple drag-drop Kanban states",
      "Smart follow-up alerts and automated customer greeting emails",
      "VoIP telephone integration with automated conversation logs",
      "Custom proposal generator with pre-formatted quote panels",
      "Sales staff conversion analytics and transaction logs"
    ],
    mockData: {
      title: "C Vidya Custom Enterprise CRM Panel",
      metrics: [
        { label: "Qualified Sales Leads", value: "340", change: "+12 imported today", isPositive: true },
        { label: "Client Inquiries Closed", value: "48", change: "+15% from last month", isPositive: true },
        { label: "Pipeline Gross Estimate", value: "₹6.4L", change: "Active deals in focus", isPositive: true },
        { label: "Average Sales Cycle Time", value: "11 Days", change: "Fast response index", isPositive: true }
      ],
      recentActivity: [
        "Lead 'Sharma Commercial Complex Steel' entered contract review",
        "Enterprise suite proposal compiled for GreenField Digital Services",
        "Call registry logged: Discussed upgrade with Dr. Sinha (coaching partner)",
        "Staff member Suresh closed subscription deal worth ₹45,000"
      ],
      chartData: [
        { name: "Mon", value: 32 },
        { name: "Tue", value: 45 },
        { name: "Wed", value: 50 },
        { name: "Thu", value: 72 },
        { name: "Fri", value: 89 },
        { name: "Sat", value: 64 }
      ]
    }
  }
];

// ==========================================
// 2. C VIDYA AI AGENTS (AI AGENT SOFTWARE AS A SAAS)
// ==========================================
export const aiAgentsData: ProductService[] = [
  {
    id: "ai-social",
    num: "01",
    name: "C VIDYA AI SOCIAL MEDIA AGENT",
    tagline: "Autonomous Content Creation, Multi-Platform Scheduling & Viral Trend Growth",
    badge: "Autonomous AI Agent",
    aiModel: "Generative Content & Trend AI",
    categoryType: "ai-agent",
    description: "Autonomous AI social media marketing agent to research viral trends, write high-converting copy, generate visual creatives, auto-schedule cross-platform campaigns across LinkedIn, X (Twitter), Instagram, and Facebook, and automate audience engagement.",
    externalLink: "https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/",
    imageUrl: crmImg,
    features: [
      "Autonomous cross-platform multi-channel posting (LinkedIn, X/Twitter, Instagram, Facebook)",
      "AI viral headline copy generator, hashtag trending analyzer & graphic suggestions",
      "Audience sentiment monitoring, automated DM replies & comment nurturing engine",
      "Dynamic content calendar with optimal posting time heatmaps",
      "ROI conversion tracking, lead generation pipelines & monthly growth reports"
    ],
    mockData: {
      title: "C Vidya AI Social Media Autonomous Marketing Engine",
      metrics: [
        { label: "Total Posts Published", value: "4,820", change: "+340 this week", isPositive: true },
        { label: "Audience Engagement", value: "+48.6%", change: "High viral coefficient", isPositive: true },
        { label: "Social Leads Generated", value: "320", change: "+24% conversion rate", isPositive: true },
        { label: "Active Connected Channels", value: "8 Platforms", change: "All synced live", isPositive: true }
      ],
      recentActivity: [
        "AI Agent published viral carousel 'Top 7 SaaS Trends for 2026' on LinkedIn & X (Twitter)",
        "Auto-replied to 42 comments on Instagram reel with personalized demo links",
        "Generated 14-day promotional drip campaign for new product release",
        "Sentiment analyzer detected 98.4% positive brand sentiment on latest announcement"
      ],
      chartData: [
        { name: "Mon", value: 340 },
        { name: "Tue", value: 410 },
        { name: "Wed", value: 390 },
        { name: "Thu", value: 520 },
        { name: "Fri", value: 580 },
        { name: "Sat", value: 460 }
      ]
    }
  },
  {
    id: "ai-support",
    num: "02",
    name: "C VIDYA AI CUSTOMER SUPPORT AGENT",
    tagline: "24/7 Omnichannel RAG, Automated Ticketing & Multi-Channel Resolution",
    badge: "Autonomous AI Agent",
    aiModel: "Neural RAG + Flash 2.5",
    categoryType: "ai-agent",
    description: "Next-generation AI-powered autonomous customer support agent for instant query resolution, smart ticket routing, enterprise knowledge-base RAG search, and human agent handoff.",
    externalLink: "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/",
    imageUrl: crmImg,
    features: [
      "AI-driven instant 24/7 inquiry resolution & automated ticket classification",
      "Custom Knowledge Base RAG integration for instant accurate context retrieval",
      "Omnichannel chat support (Web Widget, WhatsApp API, Email & Mobile)",
      "SLA monitoring, escalation queues, and seamless human agent handover",
      "Customer satisfaction (CSAT) analytics and sentiment intelligence scoring"
    ],
    mockData: {
      title: "C Vidya AI Customer Support Agent Live Neural Console",
      metrics: [
        { label: "Total Inquiries Resolved", value: "1,840", change: "92% Auto-resolved by AI", isPositive: true },
        { label: "Avg Resolution Time", value: "0.8s", change: "Instant response", isPositive: true },
        { label: "Customer CSAT Score", value: "4.9/5", change: "+0.3% this month", isPositive: true },
        { label: "Live Agent Escalations", value: "x12", change: "Human handover queue", isPositive: true }
      ],
      recentActivity: [
        "AI Agent resolved inquiry #CS-9021 'API webhook setup guide' in 0.8s",
        "Knowledge base ingested with 15 new technical troubleshooting guides",
        "Escalation #CS-8904 handed over smoothly to Senior Specialist Rahul",
        "CSAT 5-Star rating received for instant resolution of billing query"
      ],
      chartData: [
        { name: "Mon", value: 120 },
        { name: "Tue", value: 180 },
        { name: "Wed", value: 210 },
        { name: "Thu", value: 280 },
        { name: "Fri", value: 310 },
        { name: "Sat", value: 190 }
      ]
    }
  },
  {
    id: "ai-salesflow",
    num: "03",
    name: "C VIDYA SOLUTIONS SALESFLOW AI AGENT",
    tagline: "Autonomous B2B Lead Scraping, Hyper-Personalized Outreach & Deal Closing",
    badge: "Autonomous AI Agent",
    aiModel: "Autonomous Sales SDR & Pipeline AI",
    categoryType: "ai-agent",
    description: "Autonomous AI sales intelligence & outreach agent to discover verified B2B leads, generate tailored multi-touch email/WhatsApp sequences, qualify prospect intent, and automate meeting bookings.",
    externalLink: "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/",
    imageUrl: crmImg,
    features: [
      "Autonomous B2B prospect discovery & real-time contact validation",
      "Hyper-personalized multi-channel sales sequences (Email, WhatsApp, LinkedIn)",
      "Dynamic value proposition & custom sales pitch generator",
      "Lead intent scoring, automated follow-up cadences & reply sentiment triage",
      "Seamless CRM syncing and instant sales demo appointment booking"
    ],
    mockData: {
      title: "C Vidya Solutions SalesFlow AI Agent Pipeline Engine",
      metrics: [
        { label: "Leads Qualified by AI", value: "1,260", change: "+38% conversion rate", isPositive: true },
        { label: "Outreach Emails Sent", value: "6,420", change: "68.4% open rate", isPositive: true },
        { label: "Sales Demos Booked", value: "94", change: "+28 this week", isPositive: true },
        { label: "Pipeline Value Generated", value: "₹42.5L", change: "High intent deals", isPositive: true }
      ],
      recentActivity: [
        "SalesFlow AI qualified Enterprise prospect 'Apex Logistics' (100+ seats, High Budget)",
        "Dispatched personalized multi-touch drip sequence to 45 verified CFO contacts",
        "Booked product demo on executive calendar for Thursday 02:30 PM",
        "CRM synced 18 warm responses with positive buying intent triggers"
      ],
      chartData: [
        { name: "Mon", value: 210 },
        { name: "Tue", value: 290 },
        { name: "Wed", value: 340 },
        { name: "Thu", value: 410 },
        { name: "Fri", value: 480 },
        { name: "Sat", value: 320 }
      ]
    }
  },
  {
    id: "ai-marketing",
    num: "04",
    name: "C VIDYA AI MARKETING FOR B2B SAAS COMPANIES",
    tagline: "Autonomous B2B SaaS Inbound Demand Gen, SEO Growth & Campaign AI",
    badge: "Autonomous AI Agent",
    aiModel: "B2B SaaS Growth & Marketing AI Engine",
    categoryType: "ai-agent",
    description: "Autonomous AI marketing specialist engineered for B2B SaaS companies to generate high-ranking SEO content, run targeted multi-channel distribution, optimize conversion funnels, and drive qualified pipeline.",
    externalLink: "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/",
    imageUrl: institutesImg,
    features: [
      "AI keyword research, competitor gap analysis & automated SEO content creation",
      "Omnichannel B2B campaign creation for LinkedIn, Twitter/X, and Email newsletters",
      "High-converting landing page copy & value proposition A/B testing",
      "Autonomous lead magnet generation & interactive demo walkthrough scripting",
      "Real-time CAC, MQL-to-SQL velocity & marketing attribution analytics"
    ],
    mockData: {
      title: "C Vidya AI Marketing for B2B SaaS Command Center",
      metrics: [
        { label: "Organic Inbound Traffic", value: "+148%", change: "SEO cluster growth", isPositive: true },
        { label: "B2B Articles Published", value: "32", change: "Top 3 Google SERP", isPositive: true },
        { label: "MQLs Generated", value: "480", change: "+42% this month", isPositive: true },
        { label: "Avg Customer Acquisition Cost", value: "-34%", change: "Via AI automation", isPositive: true }
      ],
      recentActivity: [
        "AI Agent published 4 pillar SEO comparison guides targeting 'Enterprise Cloud ERP'",
        "Dispatched automated B2B nurturing newsletter to 3,200 SaaS founders & CTOs",
        "Generated 12 high-converting LinkedIn carousel graphics and technical thought-leadership copy",
        "Optimized Pricing Page CTA copy, lifting demo booking conversion rate by 24.6%"
      ],
      chartData: [
        { name: "Mon", value: 310 },
        { name: "Tue", value: 420 },
        { name: "Wed", value: 490 },
        { name: "Thu", value: 580 },
        { name: "Fri", value: 650 },
        { name: "Sat", value: 410 }
      ]
    }
  }
];

// Unified servicesData combining both arrays
export const servicesData: ProductService[] = [
  ...saasProductsData,
  ...aiAgentsData
];
