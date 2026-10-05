const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "../dist");
const templatePath = path.join(distDir, "index.html");

if (!fs.existsSync(templatePath)) {
  console.warn("⚠️ dist/index.html not found, skipping static page generation.");
  process.exit(0);
}

const template = fs.readFileSync(templatePath, "utf-8");

// Static route metadata registry matching src/seoData.ts and src/articleData.ts
const routes = [
  {
    path: "/",
    title: "C Vidya Solutions | Cloud Software, SaaS & AI Automation",
    description: "C Vidya Solutions is a premier technology company delivering cloud software, multi-tenant SaaS suites, and autonomous AI agents for modern enterprises.",
    canonical: "https://cvidyasolutions.com/",
    h1: "Architecting the Future of Enterprise Software & Autonomous AI Automation"
  },
  {
    path: "/software/",
    title: "C Vidya Software Solutions | Enterprise Cloud & SaaS Suites",
    description: "Explore the complete portfolio of C Vidya Solutions software suites: Library Automation, Gym Fitness Zone, Campus ERP, Enterprise CRM, and Fuel Station Management.",
    canonical: "https://cvidyasolutions.com/software/",
    h1: "C Vidya Enterprise Software Solutions"
  },
  {
    path: "/ai-agents/",
    title: "Autonomous AI Agents | C Vidya Solutions AI Automation Suite",
    description: "Discover autonomous AI agents for B2B enterprises: Social Media Marketing AI, 24/7 Customer Support RAG Agent, Outbound SalesFlow SDR, and SaaS Growth Marketing AI.",
    canonical: "https://cvidyasolutions.com/ai-agents/",
    h1: "C Vidya Autonomous AI Agents & Business Automation"
  },
  {
    path: "/services/",
    title: "Services & SaaS Products | C Vidya Solutions Technology Consulting",
    description: "End-to-end technology consulting, custom software engineering, cloud infrastructure modernization, and autonomous AI automation services by C Vidya Solutions.",
    canonical: "https://cvidyasolutions.com/services/",
    h1: "Enterprise Technology Services & Cloud SaaS Products"
  },
  {
    path: "/pricing/",
    title: "Transparent Software & AI Agent Pricing | C Vidya Solutions",
    description: "Explore transparent pricing models for C Vidya software suites and autonomous AI agents. Flexible starter, growth, and enterprise deployment packages.",
    canonical: "https://cvidyasolutions.com/pricing/",
    h1: "Transparent Software & Autonomous AI Pricing"
  },
  {
    path: "/about/",
    title: "About C Vidya Solutions | Company Mission, Leadership & Engineering",
    description: "Learn about C Vidya Solutions: our engineering philosophy, corporate headquarters in Dhanbad, R&D labs, and mission to build scalable digital infrastructure.",
    canonical: "https://cvidyasolutions.com/about/",
    h1: "About C Vidya Solutions"
  },
  {
    path: "/contact/",
    title: "Contact Us & Regional Offices | C Vidya Solutions",
    description: "Get in touch with C Vidya Solutions. Connect with our director desk, schedule an enterprise product demonstration, or visit our regional engineering offices.",
    canonical: "https://cvidyasolutions.com/contact/",
    h1: "Contact C Vidya Solutions"
  },
  {
    path: "/portfolio/",
    title: "Portfolio & Engineering Case Studies | C Vidya Solutions",
    description: "Review real-world deployment case studies and systems architecture diagrams delivered across educational campuses, retail enterprises, and commercial logistics.",
    canonical: "https://cvidyasolutions.com/portfolio/",
    h1: "Enterprise Engineering Portfolio & Case Studies"
  },
  {
    path: "/blog/",
    title: "Technology Insights & Engineering Articles | C Vidya Solutions",
    description: "Technical articles, architectural case studies, and engineering guides on cloud-native SaaS development, biometric access control, and enterprise AI automation.",
    canonical: "https://cvidyasolutions.com/blog/",
    h1: "Engineering Insights & Enterprise Technology Articles"
  },
  {
    path: "/careers/",
    title: "Careers & Open Positions | C Vidya Solutions",
    description: "Join C Vidya Solutions. Explore open software engineering, full-stack development, and artificial intelligence research positions at our R&D hub.",
    canonical: "https://cvidyasolutions.com/careers/",
    h1: "Build the Future With C Vidya Solutions"
  },
  {
    path: "/faq/",
    title: "Frequently Asked Questions | C Vidya Solutions Software & AI",
    description: "Comprehensive answers to common questions regarding deployment timelines, cloud hosting security, multi-tenant billing, and technical support SLAs.",
    canonical: "https://cvidyasolutions.com/faq/",
    h1: "Frequently Asked Questions"
  },
  // Dedicated Product Pages
  {
    path: "/software/library-management/",
    title: "C Vidya Library Management Software | Cloud Library Automation System",
    description: "Cloud library management software for educational institutes, public libraries, and study centers. Automate book circulation, student passes, barcode ISBN scans, and fee tracking.",
    canonical: "https://cvidyasolutions.com/software/library-management/",
    h1: "C Vidya Library Management Software"
  },
  {
    path: "/software/fitness-zone/",
    title: "C Vidya Fitness Management Software | Gym & Fitness Centre Management System",
    description: "Comprehensive gym and health club management software with biometric turnstile gate sync, active member subscriptions, trainer rosters, and automated payment billing.",
    canonical: "https://cvidyasolutions.com/software/fitness-zone/",
    h1: "C Vidya Fitness Zone Management Software"
  },
  {
    path: "/software/institutes-management/",
    title: "C Vidya Institutes Management ERP | Campus Automation System",
    description: "Cloud ERP for schools, colleges, and university campuses. Features online admissions, fee counter registers, gradebook marksheets, and biometric student attendance.",
    canonical: "https://cvidyasolutions.com/software/institutes-management/",
    h1: "C Vidya Institutes Management ERP"
  },
  {
    path: "/software/coaching-management/",
    title: "C Vidya Coaching Management Software | Academy Batch & Test Analytics",
    description: "Dedicated software for coaching institutes, test prep academies, and competitive exam centers with batch schedules, camera OMR sheet grading, and rank cards.",
    canonical: "https://cvidyasolutions.com/software/coaching-management/",
    h1: "C Vidya Coaching Management Software"
  },
  {
    path: "/software/agriculture-management/",
    title: "C Vidya AgriFusion Agribusiness Software | Unified Farm & Livestock Management",
    description: "Comprehensive farm and agribusiness platform managing poultry flock cycles, aquaculture pond water logs, goat herds, crop yields, and direct POS retail billing.",
    canonical: "https://cvidyasolutions.com/software/agriculture-management/",
    h1: "C Vidya AgriFusion Agribusiness Software"
  },
  {
    path: "/software/jewellers-management/",
    title: "C Vidya Jewellers Management Software | Gold & Silver Retail Bullion ERP",
    description: "Retail jewelry and bullion ERP featuring real-time market gold spot rates, gross/net stone weights, Karigar metal loss tracking, and GST HUID invoice printing.",
    canonical: "https://cvidyasolutions.com/software/jewellers-management/",
    h1: "C Vidya Jewellers Management Software"
  },
  {
    path: "/software/enterprise-crm/",
    title: "C Vidya Enterprise CRM Software | Sales Pipeline & Deal Automation",
    description: "Enterprise CRM and sales acceleration pipeline featuring visual Kanban deal stages, multi-touch lead capture, customer greeting workflows, and instant quotation PDFs.",
    canonical: "https://cvidyasolutions.com/software/enterprise-crm/",
    h1: "C Vidya Enterprise CRM Software"
  },
  {
    path: "/software/petrol-pump-management/",
    title: "C Vidya Petrol Pump Fuel Management Suite | Cloud Dealership ERP",
    description: "Automated fuel station management ERP software for petrol and diesel retail dealerships. Reconciles electronic nozzle meters, underground dip tanks, and fleet credit khatas.",
    canonical: "https://cvidyasolutions.com/software/petrol-pump-management/",
    h1: "C Vidya Petrol Pump Fuel Management Suite"
  },
  {
    path: "/software/healthcare-management/",
    title: "C Vidya Care Plus Healthcare Management System | Hospital & Clinic ERP",
    description: "Comprehensive hospital information system (HIS) managing OPD/IPD queue tokens, doctor appointment rosters, digital electronic prescriptions, pharmacy inventory, and lab diagnostics.",
    canonical: "https://cvidyasolutions.com/software/healthcare-management/",
    h1: "C Vidya Care Plus Healthcare Management System"
  },
  {
    path: "/software/pdf-media-tools/",
    title: "C Vidya PDF & Media Tools SaaS | Fast In-Browser Document Processing",
    description: "Browser-edge document utility software providing client-side PDF compression, merging, splitting, watermarking, Word conversion, and multimedia processing with zero data retention.",
    canonical: "https://cvidyasolutions.com/software/pdf-media-tools/",
    h1: "C Vidya PDF & Media Tools SaaS"
  },
  // Dedicated AI Agent Pages
  {
    path: "/ai-agents/customer-support/",
    title: "Autonomous AI Customer Support Agent | 24/7 Enterprise RAG Support",
    description: "Autonomous customer support agent resolving complex enterprise inquiries in under 0.8 seconds using neural RAG retrieval, multi-channel widgets, and automated CRM triage.",
    canonical: "https://cvidyasolutions.com/ai-agents/customer-support/",
    h1: "Autonomous AI Customer Support Agent"
  },
  {
    path: "/ai-agents/sales-flow/",
    title: "C Vidya SalesFlow AI Outbound Agent | Autonomous B2B Prospecting & SDR",
    description: "Autonomous B2B sales development representative AI discovering verified prospects, drafting personalized multi-channel outreach, and booking calendar demos automatically.",
    canonical: "https://cvidyasolutions.com/ai-agents/sales-flow/",
    h1: "C Vidya SalesFlow AI Outbound Agent"
  },
  {
    path: "/ai-agents/social-media/",
    title: "C Vidya AI Social Media Marketing Agent | Trend Research & Scheduling",
    description: "Autonomous social media marketing agent conducting viral trend analysis, authoring high-converting posts, creating visual prompts, and automating publishing across major channels.",
    canonical: "https://cvidyasolutions.com/ai-agents/social-media/",
    h1: "C Vidya AI Social Media Marketing Agent"
  },
  {
    path: "/ai-agents/b2b-marketing/",
    title: "B2B SaaS Growth Marketing AI Agent | Inbound Demand & SEO Pipeline",
    description: "Autonomous inbound growth marketing agent analyzing competitor keyword gaps, generating technical long-form content, and optimizing marketing qualified lead pipelines.",
    canonical: "https://cvidyasolutions.com/ai-agents/b2b-marketing/",
    h1: "B2B SaaS Growth Marketing AI Agent"
  },
  // Dedicated Blog & Topical Guides
  {
    path: "/blog/what-is-library-management-software/",
    title: "What is Library Management Software? Features, Benefits & Guide | C Vidya",
    description: "Learn what library management software is, how it automates book cataloging, barcode scanning, student passes, and fee collection for modern reading rooms and universities.",
    canonical: "https://cvidyasolutions.com/blog/what-is-library-management-software/",
    h1: "What is Library Management Software? Complete Architecture & Features Guide"
  },
  {
    path: "/blog/benefits-cloud-library-management-software/",
    title: "10 Benefits of Cloud Library Management Software | C Vidya",
    description: "Discover how cloud library management software reduces book loss, automates fine tracking, simplifies seat booking, and lowers IT maintenance costs for institutes.",
    canonical: "https://cvidyasolutions.com/blog/benefits-cloud-library-management-software/",
    h1: "10 Major Benefits of Cloud Library Management Software for Institutes"
  },
  {
    path: "/blog/digitize-reading-room-study-centre-guide/",
    title: "How to Digitize a Reading Room & Study Centre | C Vidya",
    description: "Step-by-step practical blueprint for digitizing reading rooms, self-study libraries, and study centers with seat allocation, QR passes, and WhatsApp fee reminders.",
    canonical: "https://cvidyasolutions.com/blog/digitize-reading-room-study-centre-guide/",
    h1: "How to Digitize a Modern Reading Room & Study Centre: Step-by-Step Guide"
  },
  {
    path: "/blog/gym-management-biometric-access-automation/",
    title: "Biometric Turnstile Integration for Gyms | Fitness Automation | C Vidya",
    description: "Learn how syncing biometric fingerprint and RFID turnstile gates with gym management software stops expired member entry, improves cash flow, and automates renewals.",
    canonical: "https://cvidyasolutions.com/blog/gym-management-biometric-access-automation/",
    h1: "Biometric Turnstile Integration for Gyms: Eliminating Revenue Leakage"
  },
  {
    path: "/blog/coaching-institute-omr-test-grading-automation/",
    title: "Automated OMR Test Grading for Coaching Institutes | C Vidya",
    description: "Explore how modern coaching centers scan paper OMR answer sheets via mobile cameras, compute scores, calculate percentiles, and generate All-India Ranks instantly.",
    canonical: "https://cvidyasolutions.com/blog/coaching-institute-omr-test-grading-automation/",
    h1: "How Coaching Institutes Automate OMR Test Grading & All-India Ranks"
  },
  {
    path: "/blog/ai-customer-support-vs-traditional-chatbots/",
    title: "AI Customer Support Agents vs Traditional Chatbots | C Vidya",
    description: "Understand the key differences between frustrating rule-based button chatbots and autonomous AI agents powered by neural RAG knowledge bases and sub-second responses.",
    canonical: "https://cvidyasolutions.com/blog/ai-customer-support-vs-traditional-chatbots/",
    h1: "AI Customer Support Agents vs Traditional Rule-Based Chatbots"
  },
  {
    path: "/blog/what-is-saas-cloud-business-software-guide/",
    title: "What is SaaS? Complete Cloud Business Software Guide | C Vidya",
    description: "Demystifying Software-as-a-Service (SaaS), multi-tenant cloud architecture, subscription billing, and why modern enterprises avoid on-premises legacy software.",
    canonical: "https://cvidyasolutions.com/blog/what-is-saas-cloud-business-software-guide/",
    h1: "What is SaaS? The Ultimate Guide to Cloud Business Software in 2025"
  },
  {
    path: "/blog/autonomous-b2b-sales-outreach-pipeline-guide/",
    title: "Autonomous B2B Sales Outreach & AI SDR Pipeline Guide | C Vidya",
    description: "Learn how autonomous AI sales agents discover verified prospects, execute personalized multichannel outreach, and book calendar demo appointments automatically.",
    canonical: "https://cvidyasolutions.com/blog/autonomous-b2b-sales-outreach-pipeline-guide/",
    h1: "Autonomous B2B Sales Outreach: How AI Agents Accelerate Pipeline Velocity"
  },
  {
    path: "/blog/zero-trust-cloud-edge-architecture-saas/",
    title: "Zero-Trust Security & Cloud Edge Architecture for SaaS | C Vidya",
    description: "Deep dive into zero-trust security, mutual TLS, distributed edge computing, and bank-grade data encryption safeguarding modern enterprise SaaS platforms.",
    canonical: "https://cvidyasolutions.com/blog/zero-trust-cloud-edge-architecture-saas/",
    h1: "Zero-Trust Security & Distributed Cloud Edge Architecture for Modern SaaS"
  },
  // Legal Pages
  {
    path: "/privacy/",
    title: "Privacy Policy | C Vidya Solutions Data Protection",
    description: "Read the C Vidya Solutions Privacy Policy. Understand how we collect, process, encrypt, and protect your enterprise and institutional data.",
    canonical: "https://cvidyasolutions.com/privacy/",
    h1: "Privacy Policy & Data Protection"
  },
  {
    path: "/terms/",
    title: "Terms of Service | C Vidya Solutions Software Agreement",
    description: "Review C Vidya Solutions Terms of Service, licensing conditions, multi-tenant cloud usage policies, and service level commitments.",
    canonical: "https://cvidyasolutions.com/terms/",
    h1: "Terms of Service"
  },
  {
    path: "/billing/",
    title: "Billing & Subscription Terms | C Vidya Solutions",
    description: "Transparent billing policies, GST-compliant invoicing, renewal schedules, and modular software payment terms for C Vidya Solutions.",
    canonical: "https://cvidyasolutions.com/billing/",
    h1: "Billing & Subscription Terms"
  },
  {
    path: "/refund/",
    title: "Refund Policy | C Vidya Solutions Software Licensing",
    description: "Clear and fair refund policies for C Vidya Solutions SaaS subscriptions, module setup fees, and enterprise onboarding agreements.",
    canonical: "https://cvidyasolutions.com/refund/",
    h1: "Refund & Cancellation Policy"
  },
  {
    path: "/cookies/",
    title: "Cookie Policy | C Vidya Solutions Web Privacy",
    description: "Learn about the essential, performance, and analytical cookies utilized across C Vidya Solutions websites and cloud applications.",
    canonical: "https://cvidyasolutions.com/cookies/",
    h1: "Cookie Policy & Web Tracking"
  },
  {
    path: "/disclaimer/",
    title: "Legal & Regulatory Disclaimer | C Vidya Solutions",
    description: "Legal disclaimers, liability limitations, intellectual property notices, and regulatory compliance disclosures for C Vidya Solutions.",
    canonical: "https://cvidyasolutions.com/disclaimer/",
    h1: "Legal & Regulatory Disclaimer"
  },
  {
    path: "/portability/",
    title: "Data Portability & Zero Lock-in Policy | C Vidya Solutions",
    description: "C Vidya Solutions guarantees zero data lock-in. Export complete relational databases in Excel, CSV, and JSON format at any time.",
    canonical: "https://cvidyasolutions.com/portability/",
    h1: "Data Portability & Export Guarantee"
  }
];

let generatedCount = 0;

for (const r of routes) {
  if (r.path === "/") continue;

  let cleanRelative = r.path.replace(/^\/+/, "").replace(/\/+$/, "");
  const targetDir = path.join(distDir, cleanRelative);
  const targetFile = path.join(targetDir, "index.html");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Inject unique SEO tags into template
  let pageHtml = template
    .replace(/<title>.*?<\/title>/i, `<title>${r.title}</title>`)
    .replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${r.description}" />`)
    .replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${r.canonical}" />`)
    .replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${r.title}" />`)
    .replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${r.description}" />`)
    .replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${r.canonical}" />`)
    .replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${r.title}" />`)
    .replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${r.description}" />`);

  // Ensure crawlable H1 is present inside root for crawlers before hydration
  const noscriptFallback = `<div id="root"><noscript><div style="padding:20px;font-family:sans-serif;"><h1>${r.h1}</h1><p>${r.description}</p><p><a href="https://cvidyasolutions.com/">Return to C Vidya Solutions Homepage</a></p></div></noscript></div>`;
  pageHtml = pageHtml.replace(/<div\s+id=["']root["']><\/div>/i, noscriptFallback);

  fs.writeFileSync(targetFile, pageHtml, "utf-8");
  generatedCount++;
}

console.log(`✅ Generated ${generatedCount} static prerendered HTML pages in dist/ directory.`);
