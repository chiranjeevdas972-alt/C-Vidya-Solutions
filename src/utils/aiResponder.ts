// Comprehensive Knowledge Base & Bilingual (English & Hinglish) AI Assistant for C Vidya Solutions
// Grounded in deep research of www.cvidyasolutions.com and all production software suites

export function isHinglishQuery(text: string): boolean {
  const t = text.toLowerCase();
  const hinglishTokens = [
    "kya", "kaise", "chahiye", "chahiy", "hai", "hain", "kare", "karna", "karo", "batao",
    "bataiye", "batao na", "batao please", "kitna", "kitne", "milega", "hoga", "dekh", "nahi",
    "nhi", "ha", "haan", "achha", "theek", "bhai", "sir", "namaste", "namaskar", "pranam",
    "kripya", "shukriya", "dhanyawad", "madad", "bataye", "batayen", "paise", "rupya", "rupaye",
    "kharidna", "lagwana", "lagana", "kaam", "chalega", "chalta", "bolo", "kaun", "kaha",
    "kahan", "konsa", "kaunsa", "kaisa", "mera", "meri", "apka", "aapka", "humara", "hamara",
    "kab", "kyu", "kyun", "kisko", "kis", "kaise kare", "kuch", "sabse", "badhiya", "sasta",
    "hume", "humko", "mujhe", "mujhko", "bhi", "toh", "to", "bata", "dikha", "dikhao",
    "kaun hai", "kaha hai", "pata", "purana", "shuru", "kab hua", "kaise hoga", "shikayat"
  ];
  return hinglishTokens.some(w => new RegExp(`(^|\\s)${w}(\\s|\\?|!|\\.|,|$)`, "i").test(t));
}

export function getSmartAssistantResponse(messages: { role: string; content?: string; text?: string }[]): string {
  if (!messages || messages.length === 0) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**.\n\nI am your **C-Vidya AI Customer Support Assistant**. I can assist you with all our **7 SaaS Products**, **4 Autonomous AI Agents**, and **Specialized Services**. You can chat with me in **English** or **Hinglish**! How may I help you today?";
  }

  const lastMsg = messages[messages.length - 1];
  const userText = ((lastMsg.content || lastMsg.text || "").toLowerCase()).trim();

  if (!userText) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**. How can I assist you today? Aap English ya Hinglish dono me pooch sakte hain!";
  }

  const hinglish = isHinglishQuery(userText);

  // 1. Browsing / Casual / No immediate requirement ("dekh rha", "just browsing", "no thanks", etc.)
  if (
    userText.includes("dekh rha") ||
    userText.includes("dekh raha") ||
    userText.includes("dekh rhe") ||
    userText.includes("nahi chahiye") ||
    userText.includes("nhi chahiye") ||
    userText.includes("nhi chahiy") ||
    userText.includes("aise hi") ||
    userText.includes("aise i") ||
    userText.includes("just browsing") ||
    userText.includes("just looking") ||
    userText.includes("no need") ||
    userText.includes("just checking") ||
    userText.includes("not buying") ||
    userText.includes("explore kr") ||
    userText.includes("explore kar") ||
    userText.includes("no thanks")
  ) {
    if (hinglish) {
      return "Koi baat nahi! 👋 Aap aaram se **C Vidya Solutions** ke sabhi software platforms aur AI agents ko explore kijiye.\n\nAgar aapko kisi bhi software (jaise Library, Fitness Zone, Institutes, Coaching, AgriFusion, Jewelers, CRM, Petrol Pump Suite, Care Plus, ya PDF Tools) ka live demo dekhna ho ya koi doubt ho, toh aap kabhi bhi pooch sakte hain. Main hamesha yahan aapki help ke liye available hoon!";
    }
    return "No problem at all! 👋 Take your time exploring **C Vidya Solutions**.\n\nFeel free to explore our **7 SaaS Products**, **4 Autonomous AI Agents**, and specialized platforms like **Petrol Pump Cloud Suite**, **Care Plus Healthcare System**, and **PDF & Media Tools**. Let me know if you would like an interactive live demo or have any questions!";
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
    if (hinglish) {
      return "Namaste! 👋 **C Vidya Solutions** me aapka swagat hai!\n\nMain hoon aapka **C-Vidya AI Assistant**. Main aapko hamare poore software ecosystem me guide kar sakta hoon:\n\n📦 **7 Flagship SaaS Products**:\n1. **C Vidya Library Management** (Seats, barcode, overdue WhatsApp alert)\n2. **C Vidya Fitness Zone** (Biometric turnstile gate, member plans, diet chart)\n3. **C Vidya Institutes Management** (Schools/Colleges ERP, fee ledger, bus GPS)\n4. **C Vidya Coaching Management** (Batches, offline OMR test grading, AIR rank)\n5. **AgriFusion / FarmFresh Hub** (Poultry, fishery, goat farming, livestock)\n6. **C Vidya Jewelers Management** (24K/22K gold rate sync, karigar casting, GST)\n7. **C Vidya Enterprises CRM** (Kanban deals pipeline, automated follow-ups)\n\n🤖 **4 Autonomous AI Agents**:\n1. **C Vidya Social Media Agent** (Auto-posting LinkedIn/Insta/X, trend research)\n2. **C Vidya AI Customer Support Agent** (24/7 RAG support, instant resolution)\n3. **C Vidya Business Sales Flow AI Agent** (B2B leads finding & outreach)\n4. **C Vidya AI Marketing for B2B SaaS** (SEO blogs, LinkedIn thought leadership)\n\n⚡ **Specialized Services**:\n• **Petrol Pump Cloud Software** (Dip variance, nozzle meter, fleet credit khata)\n• **Care Plus Healthcare System** (Hospital OPD/IPD, digital prescriptions, lab)\n• **C Vidya PDF and Media Tools SaaS** (Word to PDF, merge, compress, protect)\n\nAapko kis software ya service ke baare me jaanna hai? Aap Hindi, English, ya Hinglish me pooch sakte hain!";
    }
    return "Hello! 👋 Welcome to **C Vidya Solutions**.\n\nI am your **C-Vidya AI Customer Support Assistant**. I can assist you with our full technology suite:\n\n• **7 Flagship SaaS Products**: Library Management, Fitness Zone, Institutes ERP, Coaching Management, AgriFusion, Jewelers Management, and Enterprises CRM.\n• **4 Autonomous AI Agents**: AI Social Media Agent, AI Customer Support Agent, SalesFlow AI Agent, and B2B SaaS Marketing Agent.\n• **Specialized Platforms**: Cloud Petrol Pump Software, Care Plus Healthcare System, and PDF & Media Tools SaaS.\n\nHow can I help you today? You can ask me about software features, interactive live demos, pricing, or architecture in English or Hinglish!";
  }

  // 2.1 Leadership, Founder & Executive Team
  if (
    userText.includes("chiranjeev") ||
    userText.includes("founder") ||
    userText.includes("director") ||
    userText.includes("ceo") ||
    userText.includes("cto") ||
    userText.includes("sarah jenkins") ||
    userText.includes("marcus chen") ||
    userText.includes("elena rodriguez") ||
    userText.includes("leadership") ||
    userText.includes("malik kaun hai") ||
    userText.includes("owner kaun hai") ||
    userText.includes("team kaun hai")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Leadership & Management Team** 👔:\n\n• **Chiranjeev Das** — **Founder & Director**\n  C Vidya Solutions ke sansthapak aur director hain jinhone company ko enterprise SaaS aur AI automation me aage badhaya.\n  📧 Email: `chiranjeev0058@gmail.com`\n\n• **Sarah Jenkins** — **Chief Executive Officer (CEO)**\n  Enterprise software me 15+ years ka experience, company ki global strategic vision aur client growth ko lead karti hain.\n\n• **Marcus Chen** — **Chief Technology Officer (CTO)**\n  Core deployment pipelines aur R&D division ke head hain, scalable microservices aur distributed cloud architecture ke expert.\n\n• **Elena Rodriguez** — **Head of Operations**\n  Client deliveries aur SLA commitments ko 100% on-time execute karwati hain.\n\nAap hamare founder aur leadership desk se direct contact kar sakte hain: 📞 +91 92885 17027 / 8987766981";
    }
    return "**C Vidya Solutions Leadership Team**:\n\n• **Chiranjeev Das** — **Founder & Director**\n  Steers company vision, indigenous software engineering, and strategic initiatives. Contact: `chiranjeev0058@gmail.com`.\n\n• **Sarah Jenkins** — **Chief Executive Officer (CEO)**\n  Over 15 years in enterprise software, driving global strategy, client value, and executive partnerships.\n\n• **Marcus Chen** — **Chief Technology Officer (CTO)**\n  Architect of core distributed deployment pipelines and head of the AI R&D engineering division.\n\n• **Elena Rodriguez** — **Head of Operations**\n  Directs seamless operational delivery and enterprise SLA fulfillment.\n\nConnect with our leadership desk: 📞 +91 92885 17027 | 📧 `cvidyasolutions@gmail.com`";
  }

  // 2.2 Company History, Legacy & Timeline
  if (
    userText.includes("history") ||
    userText.includes("timeline") ||
    userText.includes("legacy") ||
    userText.includes("kab shuru") ||
    userText.includes("kab bani") ||
    userText.includes("founded") ||
    userText.includes("background")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions ki Yatra & Milestones** 🚀:\n\n• **2018 (Foundation)**: Ek specialized consultancy ke roop me shuruat hui jahan core infrastructure modernization aur databases par kaam hua.\n• **2021 (Expansion)**: Global operations expand huye aur proprietary enterprise data analytics launch ki gayi.\n• **2025 - Present (Innovation)**: Full-scale autonomous AI agents aur 7 Flagship SaaS products launch huye, saath hi STPI Sindri (BIT Sindri Campus) incubation me certified hue.\n\nTagline: *'Innovating Software for a Simpler Future'*";
    }
    return "**C Vidya Solutions Heritage & Timeline**:\n\n• **2018 (Foundation)**: Established as a specialized technology consultancy focusing on core enterprise infrastructure modernization.\n• **2021 (Expansion)**: Scaled operations globally, launching our proprietary business intelligence and analytics practice.\n• **2025 - Present (Innovation)**: Leading indigenous SaaS innovation with Autonomous AI Agents, multitenant cloud software suites, and incubation under STPI Sindri (BIT Sindri Campus).\n\nTagline: *'Innovating Software for a Simpler Future'*";
  }

  // 2.3 Careers, Job Openings & Hiring
  if (
    userText.includes("job") ||
    userText.includes("career") ||
    userText.includes("hiring") ||
    userText.includes("vacancy") ||
    userText.includes("internship") ||
    userText.includes("naukri") ||
    userText.includes("apply") ||
    userText.includes("kaam chahiye")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Careers & Job Openings** 💼:\n\nHamari engineering team grow kar rahi hai aur hum talented developers ko hire kar rahe hain:\n\n1. **Senior Full-Stack Cloud Architect** (Engineering, 4-7 Years exp, Remote / Hybrid Dhanbad HQ)\n2. **Autonomous AI Agent Engineer** (R&D AI Division, 2-5 Years exp, Remote)\n3. **Enterprise UI/UX Systems Designer** (Design Systems, 3+ Years exp, Remote)\n\n• **Apply Kaise Karein?**:\n  - Website: `https://cvidyasolutions.com/careers/` par visit karein.\n  - Ya direct apna resume send karein: `cvidyasolutions@gmail.com`\n  (Subject me Job Title zaroor likhein)";
    }
    return "**Careers at C Vidya Solutions** 💼:\n\nWe are actively recruiting passionate technologists for the following roles:\n\n1. **Senior Full-Stack Cloud Architect** (Engineering, 4-7 Years, Remote / Hybrid Dhanbad HQ)\n2. **Autonomous AI Agent Engineer** (R&D AI Division, 2-5 Years, Remote)\n3. **Enterprise UI/UX Systems Designer** (Design Systems, 3+ Years, Remote)\n\n• **How to Apply**:\nVisit `https://cvidyasolutions.com/careers/` or submit your resume directly to `cvidyasolutions@gmail.com` with the desired position title in the subject line.";
  }

  // 2.4 Social Media Channels
  if (
    userText.includes("youtube") ||
    userText.includes("instagram") ||
    userText.includes("facebook") ||
    userText.includes("twitter") ||
    userText.includes("linkedin") ||
    userText.includes("social media")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Official Social Media Channels** 🌐:\n\n• **YouTube**: https://www.youtube.com/@cvidyasolutions\n• **Facebook**: https://www.facebook.com/profile.php?id=61591206215743\n• **Instagram**: https://www.instagram.com/cvidyasolutions/?hl=en (@cvidyasolutions)\n• **Twitter / X**: https://twitter.com/CVidyaSolutions (@CVidyaSolutions)\n• **LinkedIn**: https://linkedin.com/company/cvidyasolutions\n\nLatest software updates, tutorials aur product walk-throughs ke liye follow karein!";
    }
    return "**C Vidya Solutions Official Social Channels** 🌐:\n\n• **YouTube**: https://www.youtube.com/@cvidyasolutions\n• **Facebook**: https://www.facebook.com/profile.php?id=61591206215743\n• **Instagram**: https://www.instagram.com/cvidyasolutions/?hl=en (@cvidyasolutions)\n• **Twitter / X**: https://twitter.com/CVidyaSolutions (@CVidyaSolutions)\n• **LinkedIn**: https://linkedin.com/company/cvidyasolutions\n\nFollow us for product updates, engineering deep dives, and live demonstrations!";
  }

  // 2.5 Deployment Timelines & Turnkey Setup
  if (
    userText.includes("how long") ||
    userText.includes("kitna time") ||
    userText.includes("kitne din") ||
    userText.includes("setup time") ||
    userText.includes("deployment time") ||
    userText.includes("timing")
  ) {
    if (hinglish) {
      return "**Software Deployment & Setup Timeline** ⏱️:\n\n• **Pre-Built SaaS Modules (Turnkey)**: Sirf **2 se 5 business days** ke andar aapka cloud database setup, branding aur staff training complete ho jati hai!\n• **Custom Enterprise & AI Pipelines**: Complex enterprise integrations aur legacy database migrations me **3 se 6 weeks** ka samay lagta hai with **zero-downtime** guarantee!\n\nAapko kaunsa software deploy karwana hai?";
    }
    return "**System Deployment & Integration Timelines** ⏱️:\n\n• **Turnkey SaaS Platforms**: Pre-built modules (Library, Gym, Coaching, Petrol Pump, etc.) deploy in **2 to 5 business days**, including cloud database provisioning, branding, and team onboarding.\n• **Bespoke Enterprise & AI Pipelines**: Custom microservice migrations and AI agent orchestration typically span **3 to 6 weeks** with guaranteed zero downtime.";
  }

  // 3. Human / Real Person Agent Request
  if (
    userText.includes("human") ||
    userText.includes("real agent") ||
    userText.includes("person") ||
    userText.includes("insan") ||
    userText.includes("banda") ||
    userText.includes("talk to agent") ||
    userText.includes("call me") ||
    userText.includes("baat karni") ||
    userText.includes("call karna")
  ) {
    if (hinglish) {
      return "Main **C Vidya Solutions** ka official AI Customer Support Assistant hoon aur hamare sabhi software aur AI agents ki poori technical jaankari de sakta hoon.\n\nAgar aapko hamari executive team ya founder se direct baat karni hai:\n\n📞 **Helpline Call/WhatsApp**: +91 92885 17027 / 8987766981\n📧 **Official Email**: cvidyasolutions@gmail.com\n👔 **Founder Desk (Chiranjeev Das)**: chiranjeev0058@gmail.com\n📍 **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n🏢 **Branch & Incubation**: STPI Sindri, BIT Sindri Campus, Dhanbad\n\nAap apna **Name**, **Mobile Number**, aur **Software of Interest** yahan likh dijiye, hamari team aapse turant connect karegi!";
    }
    return "I am the official **AI Customer Support Assistant** of C Vidya Solutions. I can answer any question about our software architecture, features, live demos, pricing, and onboarding.\n\nIf you would like to connect directly with our human executive team:\n\n📞 **Helpline**: +91 92885 17027 / 8987766981\n📧 **Official Email**: cvidyasolutions@gmail.com\n👔 **Founder Desk (Chiranjeev Das)**: chiranjeev0058@gmail.com\n📍 **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n🏢 **Incubation & Branch**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n\nPlease share your Name, Mobile Number, and Product of interest, and our executive team will contact you right away!";
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
    userText.includes("kya software") ||
    userText.includes("product list") ||
    userText.includes("services list") ||
    userText.includes("software list")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Complete Software Portfolio**:\n\n📦 **7 Core SaaS Products**:\n1. **C Vidya Library Management**: Study halls, reading room seat allocator, barcode scanner, overdue fine WhatsApp alerts.\n   🔗 [Live: v.cvidyasolutions.workers.dev]\n2. **C Vidya Fitness Zone**: Gym members biometric turnstile gate access, plan renewals, workout & diet plans.\n   🔗 [Live: fitzone.cvidyasolutions.workers.dev]\n3. **C Vidya Institutes Management**: Schools/Colleges ERP, admission CRM, fee cashbooks, GPS bus tracking, gradebooks.\n4. **C Vidya Coaching Management**: Dynamic batch rosters, absent student SMS to parents, offline OMR mock test scanner & AIR ranks.\n   🔗 [Live: coaching.cvidyasolutions.workers.dev]\n5. **AgriFusion (FarmFresh Hub)**: Poultry flock FCR, fish pond telemetry, goat herd breeding, POS retail billing.\n   🔗 [Live: fresh.cvidyasolutions.workers.dev]\n6. **C Vidya Jewelers Management**: Live 24K/22K gold rate sync, karigar metal casting logs, GST barcode billing.\n   🔗 [Live: jewelry.cvidyasolutions.workers.dev]\n7. **C Vidya Enterprises CRM**: Drag-and-drop Kanban deals, automated follow-ups, VoIP call logs, quote PDF generator.\n   🔗 [Live: crm.cvidyasolutions.workers.dev]\n\n🤖 **4 Autonomous AI Agents**:\n1. **C Vidya Social Media Agent**: Auto viral content scheduling for LinkedIn, X, Insta & Facebook.\n2. **C Vidya AI Customer Support Agent**: 24/7 RAG support, sub-second query resolution.\n3. **C Vidya Business Sales Flow AI Agent**: Automated B2B lead discovery & personalized outreach.\n4. **C Vidya AI Marketing for B2B SaaS**: SEO content clusters & LinkedIn thought leadership.\n\n⚡ **Specialized Platforms**:\n1. **Petrol Pump Cloud Software**: Shift nozzle reconciliation, tank dip variance, fleet credit khata.\n2. **Care Plus Healthcare System**: Hospital OPD/IPD, digital prescriptions, pharmacy POS, lab tests.\n3. **C Vidya PDF and Media Tools SaaS**: Word to PDF conversion, merge, split, compress, watermark.\n\nAapko kis software ka live demo test karna hai?";
    }
    return "**C Vidya Solutions Ecosystem Overview**:\n\n📦 **7 Flagship SaaS Products**:\n1. **C Vidya Library Management**: ISBN barcode scanning, reading room seat allocator, overdue WhatsApp alerts, fine ledgers. [v.cvidyasolutions.workers.dev]\n2. **C Vidya Fitness Zone**: Biometric turnstile access control, subscription renewals, automated fee lockout, workout & diet planner. [fitzone.cvidyasolutions.workers.dev]\n3. **C Vidya Institutes Management**: Admissions CRM, school/college fee collection, CBSE/ICSE gradebooks, GPS bus tracking, hostel management.\n4. **C Vidya Coaching Management**: Batch scheduling, biometric attendance alerts, offline OMR mock test grading, AIR rank generator. [coaching.cvidyasolutions.workers.dev]\n5. **AgriFusion (FarmFresh Hub)**: Poultry flock FCR, fishery pond telemetry, goat herd cycles, POS retail/wholesale billing. [fresh.cvidyasolutions.workers.dev]\n6. **C Vidya Jewelers Management**: 24K/22K live gold/silver rate sync, karat weight calculation, Karigar casting logs, GST barcode billing. [jewelry.cvidyasolutions.workers.dev]\n7. **C Vidya Enterprises CRM**: Drag-and-drop Kanban deal pipeline, automated follow-ups, VoIP logs, quotation PDF builder. [crm.cvidyasolutions.workers.dev]\n\n🤖 **4 Autonomous AI Agents**:\n1. **C Vidya Social Media Agent**: Viral trend research, automated multi-channel posting, comment sentiment replies.\n2. **C Vidya AI Customer Support Agent**: 24/7 RAG support, sub-second query resolution, omnichannel widget integration.\n3. **C Vidya Business Sales Flow AI Agent**: Automated B2B prospect discovery, personalized cold outreach, demo calendar booking.\n4. **C Vidya AI Marketing for B2B SaaS Companies**: SEO keyword clustering, technical blogs, LinkedIn thought leadership, CAC/MQL analytics.\n\n⚡ **Other Specialized Services**:\n1. **C Vidya Cloud-Based Software Petrol Pump Site**: Shift reconciliation, nozzle meter counters, tank dip-to-sale variance, fleet credit khata.\n2. **Care Plus Healthcare System**: Hospital OPD/IPD queue, digital prescriptions, pharmacy inventory, lab pathology reports, bed allocation.\n3. **C Vidya PDF and Media Tools SaaS**: High-speed Word to PDF, merge, split, compress, watermark, protect, media conversion tools.\n\nWhich software or service would you like to explore or test in a live demo?";
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
    userText.includes("how to try") ||
    userText.includes("free trial")
  ) {
    if (hinglish) {
      return "Hamare sabhi software aur AI agents ke liye **Free Interactive Live Demos & Sandbox Access** available hai! 🚀\n\nAap website par kisi bhi product card ke **'Click here'** button par tap karke live demo turant test kar sakte hain.\n\nAgar aapko customized walkthrough ya 1-on-1 demo session schedule karna hai, toh kripya ye details share kijiye:\n1. **Aapka Full Name**\n2. **Business / Institute ka Name**\n3. **Mobile / WhatsApp Number**\n4. **Email Address**\n5. **Kaunsa Software chahiye** (Library, Gym, Petrol Pump, Care Plus, AgriFusion, Coaching, AI Agent, etc.)\n6. **City aur State**\n\nHamari tech team 24 hours ke andar aapse connect karke personalized demo arrange karegi!";
    }
    return "We provide **Free Interactive Live Demos & Sandbox Access** for all our software products and AI agents!\n\nYou can click the **'Click here'** button on any product card across the website to launch the live environment directly.\n\nTo schedule a personalized 1-on-1 walkthrough or receive custom credentials, please share:\n1. **Your Full Name**\n2. **Business / Institution Name**\n3. **Mobile Number**\n4. **Email Address**\n5. **Product of Interest** (e.g., Library, Gym, Petrol Pump, Care Plus, AgriFusion, Coaching, AI Agents, PDF Tools)\n6. **City & State**\n\nOur team will set up your environment within 24 hours!";
  }

  // 6. Pricing, Cost, Rates, Subscription Plans & GST
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
    userText.includes("billing") ||
    userText.includes("gst")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Pricing & Plans** 💳:\n\nHamare software plans modular aur affordable hain, jo aapke business size aur student/member count par depend karte hain:\n\n• **Starter Tier (Single Location)**: Single-branch library, local gym studio, clinic ya individual farm ke liye modular annual plan. 1000 records, POS billing aur SMS/WhatsApp alerts included.\n• **Growth / Professional Tier (Most Popular)**: Multi-batch coaching, busy fuel stations, jewelry showroom aur growing hospitals ke liye. Biometric hardware integration, GST ledgers aur 24/7 SLA included.\n• **Enterprise Custom Tier**: Multi-campus school networks, hospital chains aur dedicated cloud edge deployments ke liye.\n\n🧾 **GST Compliance**: Hamare sabhi invoices 100% GST-compliant hote hain registered GSTIN number ke saath.\n\nAapko kis software ka quote chahiye? Apna business type aur approximate users batayein!";
    }
    return "**C Vidya Solutions Pricing & Tiers** 💳:\n\nOur SaaS solutions follow modular, pay-as-you-grow plans tailored to your operational volume:\n\n• **Starter Tier (Single Branch)**: Modular per-module pricing billed annually for single-branch libraries, local fitness studios, small clinics, and individual farms. Includes up to 1,000 active records, essential POS, and SMS/WhatsApp notifications.\n• **Growth / Professional Tier (Most Popular)**: Volume-based pricing for multi-batch coaching centers, high-traffic fuel stations, jewelry retailers, and clinics. Includes biometric turnstile hardware integration, automated GST tax ledgers, and priority 24/7 SLA.\n• **Enterprise Custom Tier**: Multi-tenant deployments for multi-campus academic complexes, hospital chains, and dedicated enterprise pipelines.\n\n🧾 **GST Invoicing**: All subscriptions include 100% GST-compliant corporate invoices.\n\nPlease share your interested software product and approximate operational volume for an instant custom quotation!";
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
    if (hinglish) {
      return "**C Vidya Library Management System** reading libraries, study centers aur colleges ke liye ek complete automated cloud solution hai:\n\n• **Seat Allotment System**: Reading room me morning, evening ya full-day shift ke hisab se seats allocate karein.\n• **Barcode & ISBN Scanning**: Kitabon ka fast check-in aur check-out, title/author/rack ke hisab se instant search.\n• **Automated Overdue Alerts**: Kitab return na karne par students ko automatic WhatsApp aur SMS alert aur fine calculation.\n• **Fees & Digital Receipts**: Monthly/quarterly subscription fees collect karein, online payment lein aur digital ID card banayein.\n• **Reader Analytics**: Konse students regular hain aur kaunsi books popular hain, sab ek dashboard me dekhein.\n\n🔗 Live App Link: `https://v.cvidyasolutions.workers.dev/`\n\nKya aapko apni library ke liye live demo test karna hai?";
    }
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
    if (hinglish) {
      return "**C Vidya Fitness Zone** modern gyms, fitness centers aur crossfit clubs ke liye ek powerful operating system hai:\n\n• **Biometric Turnstile Gate Control**: Fingerprint ya RFID wristband lagakar turnstile gate se direct connect karein. Fees expire hote hi gate automatically entry block kar deta hai!\n• **Flexible Membership Plans**: Monthly, quarterly, yearly, couple aur Personal Training (PT) plans manage karein.\n• **Automated WhatsApp Renewal**: Fees due hone se pehle WhatsApp par automatic renewal reminder aur UPI payment link bhejta hai.\n• **Custom Workout & Diet Cards**: Har member ke liye customized diet plan aur daily progressive exercise routine set karein.\n• **Trainer Commission & Floor Heatmap**: Trainers ki monthly commission, attendance aur peak gym hours ka live analytics.\n\n🔗 Live App Link: `https://fitzone.cvidyasolutions.workers.dev/`\n\nKya aap apne gym ke liye live demo dekhna chahenge?";
    }
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
    if (hinglish) {
      return "**C Vidya Institutes Management** K-12 schools, degree colleges aur multi-campus institutions ke liye banaya gaya modern cloud ERP hai:\n\n• **Admissions CRM**: Naye students ki inquiry se lekar registration aur document verification tak ka poora automated flow.\n• **Fee Collection & Cashbook**: Class-wise fee structures, installment management, concessions aur digital fee receipts.\n• **Biometric Attendance & Parent SMS**: Student aur faculty ki attendance lagte hi parents ke mobile par instant WhatsApp/SMS notification.\n• **CBSE/ICSE Gradebook Generator**: Automated exam marksheet, report card generator aur grading ledger.\n• **GPS School Bus Tracking**: Live bus route map, driver assignment, aur geo-fencing boarding alerts parents ke liye.\n• **Hostel & Dormitory Management**: Hostel room allocation, mess fees, aur student gate-pass monitoring.";
    }
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
    if (hinglish) {
      return "**C Vidya Coaching Management** competitive exam institutes (JEE, NEET, UPSC, SSC, Banking, State Boards) ke liye specially designed hai:\n\n• **Batch Scheduling & Rosters**: Naye batches banayein, classroom seating charts set karein aur batch transfer manage karein.\n• **Biometric Attendance Alerts**: Student agar class me absent hota hai, toh parents ko turant automated SMS alert jaata hai.\n• **Offline OMR Mock Test Scanner**: Offline exam ki OMR answer sheets ko camera/scanner se scan karke instant marks, percentile aur All-India Rank (AIR) generate karein!\n• **Performance Analytics**: Har student ke weak aur strong topics ka detailed diagnostic scorecard banayein.\n• **Faculty Doubt Tracker**: Students ke doubts subject mentors ko assign karke resolve karein.\n\n🔗 Live App Link: `https://coaching.cvidyasolutions.workers.dev/`\n\nKya aapko OMR scanner ya batch scheduling ka live demo dekhna hai?";
    }
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
    userText.includes("fishery") ||
    userText.includes("murgi") ||
    userText.includes("machli")
  ) {
    if (hinglish) {
      return "**AgriFusion (FarmFresh Hub)** - *'One Platform. Every Farm. Unlimited Growth.'*\n\nYe poultry, fishery, goat farming aur agriculture business ke liye all-in-one software hai:\n\n• **Poultry Farming**: Har batch ki feed intake, mortality rate aur Feed Conversion Ratio (FCR) track karein.\n• **Fishery / Aquaculture**: Pond water quality parameters (pH, Dissolved Oxygen, temperature) aur feeding schedule manage karein.\n• **Goat & Livestock Farming**: Breed records, vaccination schedules aur herd health logs maintain karein.\n• **Weighing Scale & Retail POS**: Live digital weighing scale connect karke fresh chicken, meat, fish aur eggs ka instant billing karein.\n• **Distributor Credit Khata**: Wholesalers aur distributors ka udhari (credit) khata aur daily payment collection manage karein.\n• **Farm P&L Accounting**: Har batch ka total kharcha, feed cost aur final net profit auto-calculate karein.\n\n🔗 Live App Link: `https://fresh.cvidyasolutions.workers.dev/`\n\nAap kaunse farming business ko manage karte hain?";
    }
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
    userText.includes("chandi") ||
    userText.includes("jewellery")
  ) {
    if (hinglish) {
      return "**C Vidya Jewelers Management** jewelry showrooms aur bullion traders ke liye specialized ERP software hai:\n\n• **Live Gold & Silver Rate Sync**: 24K, 22K aur 18K sona-chandi ke live market rates automatically system me update hote hain.\n• **Precision Weight & Wastage**: Gross weight, net weight, stone weight aur karigar wastage (ghat) ka exact calculation.\n• **Karigar (Artisan) Ledger**: Raw metal issue karna, craftsmanship loss check karna aur scrap metal reconciliation.\n• **Custom Bridal Orders**: Shadi aur festive bespoke jewelry orders, customer design photos aur advance payment tracking.\n• **GST Barcode Billing & HUID**: Hallmarking compliant barcode labels print karein aur instant tax-compliant GST bill banayein.\n\n🔗 Live App Link: `https://jewelry.cvidyasolutions.workers.dev/`\n\nKya aap apne jewelry showroom ke liye live demo dekhna chahenge?";
    }
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
    if (hinglish) {
      return "**C Vidya Enterprises CRM** sales teams aur B2B companies ke liye modern lead qualification aur deals closing platform hai:\n\n• **Visual Kanban Pipeline**: Naye leads se lekar deal close hone tak har stage ko drag-and-drop board par monitor karein.\n• **Omnichannel Lead Capture**: Website forms, WhatsApp messages, aur inbound telephone calls se leads auto-capture karein.\n• **Automated Follow-ups**: Sales reps ke liye automated task reminders, meetings calendar, aur call recording notes.\n• **Instant Quotation PDF**: Company logo aur pricing ke saath professional PDF proposal aur quote 1 minute me generate karein.\n• **Sales Velocity Analytics**: Kaunsa sales rep kitne deals close kar raha hai aur conversion rate kya hai, sab clear charts me dekhein.\n\n🔗 Live App Link: `https://crm.cvidyasolutions.workers.dev/`\n\nKya aapko CRM ka live demo test karna hai?";
    }
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
    if (hinglish) {
      return "**C Vidya Solutions ke 4 Autonomous AI Agents** 🤖:\n\n1. **C Vidya Social Media Agent**:\n   Trending topics research karke high-quality posts generate karta hai aur LinkedIn, X (Twitter), Instagram aur Facebook par auto-schedule karta hai. Comments ka automated reply bhi deta hai!\n   🔗 Live: `https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/`\n\n2. **C Vidya AI Customer Support Agent**:\n   Aapki company ke knowledge base par 24/7 autonomous support provide karta hai (<0.8 second reply speed). Website, WhatsApp aur Email par easily integrate ho jata hai!\n   🔗 Live: `https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/`\n\n3. **C Vidya Business Sales Flow AI Agent**:\n   Aapke target B2B clients ki email dhundhta hai, personalized outreach email/WhatsApp sequences bhejta hai aur direct sales meetings calendar me book karta hai!\n   🔗 Live: `https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/`\n\n4. **C Vidya AI Marketing for B2B SaaS**:\n   High-ranking SEO articles, competitor keyword gap analysis aur LinkedIn thought leadership content auto-create karke inbound traffic badhata hai!\n   🔗 Live: `https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/`\n\nAapko apne business ke liye kaunsa AI Agent deploy karna hai?";
    }
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
    if (hinglish) {
      return "**C Vidya Social Media Agent** aapke brand ke liye 24/7 autonomous social media manager ki tarah kaam karta hai:\n\n• **Viral Trend Ingestion**: Internet par trending topics scan karke engaging post ideas nikalta hai.\n• **Multi-Platform Auto-Posting**: LinkedIn, Instagram, Facebook aur X (Twitter) par ek sath post schedule aur publish karta hai.\n• **Smart Comment Replies**: Audience ke comments ka sentiment analyze karke polite aur personalized replies deta hai.\n• **DM Lead Capture**: DMs me aane wale interested prospects se lead information capture karta hai.\n\n🔗 Live App Link: `https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/`";
    }
    return "**C Vidya Social Media Agent** is an autonomous growth engine for your brand:\n\n• **Viral Trend Ingestion**: Scans industry trends to identify high-performing content hooks.\n• **Cross-Platform Scheduling**: Creates engaging copy and auto-publishes to LinkedIn, X (Twitter), Instagram, and Facebook.\n• **Comment & DM Nurturing**: Monitors sentiment, replies to prospect comments, and captures qualified leads from DMs.\n• **Audience Analytics**: Provides posting time heatmaps and engagement velocity metrics.\n\n🔗 Live App: `https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/`";
  }

  // 8.3 C Vidya AI Customer Support Agent
  if (
    userText.includes("ai support") ||
    userText.includes("customer support agent") ||
    userText.includes("rag agent") ||
    userText.includes("support bot")
  ) {
    if (hinglish) {
      return "**C Vidya AI Customer Support Agent** companies ko 24/7 autonomous customer service provide karta hai:\n\n• **Sub-Second RAG Accuracy**: Aapke company docs aur knowledge base ko scan karke 0.8 second ke andar accurate answer deta hai.\n• **Omnichannel Deployment**: Website chat widget, WhatsApp Business API aur Email support par instantly connect hota hai.\n• **Smart Ticket Triage**: Important aur urgent queries ko pehchan kar priority mark karta hai.\n• **Human Agent Escalation**: Agar customer ko human executive se baat karni ho, toh poori chat summary ke saath transfer kar deta hai.\n\n🔗 Live App Link: `https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/`";
    }
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
    if (hinglish) {
      return "**C Vidya Business Sales Flow AI Agent** aapke liye autonomous AI Sales Development Representative (SDR) ki tarah kaam karta hai:\n\n• **B2B Prospect Discovery**: Targeted industries aur companies ke decision-makers ki verified business emails find karta hai.\n• **Hyper-Personalized Outreach**: Har prospect ke liye personalized cold email, LinkedIn message aur WhatsApp sequences bhejta hai.\n• **BANT Qualification**: Lead ka budget, authority, need aur timeline qualify karta hai.\n• **Direct Calendar Booking**: Interested clients ki demo meetings aapke sales team ke Google/Outlook calendar me book kar deta hai.\n\n🔗 Live App Link: `https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/`";
    }
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
    if (hinglish) {
      return "**C Vidya AI Marketing for B2B SaaS Companies** ek autonomous inbound demand generation machine hai:\n\n• **SEO Content Clusters**: Competitor gap analysis karke high-intent keywords par top-ranking technical articles likhta hai.\n• **Thought Leadership**: Founders aur executives ke liye authoritative LinkedIn carousels aur newsletters tayar karta hai.\n• **High-Converting Copy**: Landing pages, case studies aur email lead nurturing sequences craft karta hai.\n• **Attribution & MQL Velocity**: Customer Acquisition Cost (CAC) aur Qualified Leads pipeline ko real-time measure karta hai.\n\n🔗 Live App Link: `https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/`";
    }
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
    if (hinglish) {
      return "**C Vidya Cloud-Based Software Petrol Pump Site** retail petrol/diesel dealerships (IOCL, BPCL, HPCL, Nayara, Shell, Reliance) ke liye best cloud ERP hai:\n\n• **Shift Opening & Closing Nozzle Totalizer**: Har shift ke shuru aur khatam hone par nozzle meter readings dalkar exact litre sale auto-calculate karein.\n• **Underground Tank Dips & Variance Audit**: Tank ki physical dip aur meter sale ka comparison karke daily temperature/evaporation loss aur leak audit turant karein.\n• **Fleet Credit Khata (Udhari Challan / Slip)**: Transporters, trucks aur corporate vehicles ka slip/challan billing karein aur WhatsApp par automated payment statement aur balance reminder bhejein.\n• **Lubricants & AdBlue / DEF Stock**: Engine oil, grease aur DEF stock manage karein with minimum stock re-order alerts.\n• **Cashier Shift Settlement**: Har salesman ka cash, UPI/card payment aur short/excess balance clear reconcile karein.\n• **Instant GST Fuel Invoicing**: Vehicle number aur GST number ke saath compliant bills print karein.\n\n🔗 Live Worker Link: `https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/`\n\nKya aapko apne petrol pump station ke liye live demo setup karwana hai?";
    }
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
    if (hinglish) {
      return "**Care Plus Healthcare System** hospitals, clinics, nursing homes aur diagnostic centers ke liye ek integrated Hospital Information System (HIS) hai:\n\n• **OPD Queue Tokens & IPD Admissions**: Patients registration, token queue display, aur IPD ward/ICU bed allocation.\n• **Digital Prescriptions (EMR/EHR)**: Doctors ke liye fast drug templates, dosage frequency, allergy warnings aur print/WhatsApp prescription.\n• **In-House Pharmacy POS**: Dawaon ka batch number, expiry date alerts aur retail POS billing.\n• **Pathology & Diagnostic Lab**: Test booking, sample barcode tracking, automated lab test report generation.\n• **Hospital Billing & Insurance TPA**: Room charges, doctor visit fees, surgery bills, aur Ayushman Bharat / TPA cashless claims.\n• **Electronic Medical Records**: Har patient ka permanent digital medical history record.\n\n🔗 Live Worker Link: `https://care-plus.cvidyasolutions.workers.dev/`\n\nKya aap apne hospital ya clinic ke liye live walkthrough dekhna chahte hain?";
    }
    return "**Care Plus Healthcare System** is an integrated Hospital Information System (HIS) & Clinical Practice ERP:\n\n• **OPD & IPD Management**: Patient registration, appointment scheduling, queue tokens, and IPD bed/ward/ICU allocation.\n• **Digital Prescription Generator (EMR/EHR)**: Quick-entry diagnosis templates, drug dosage guides, allergy warnings, and printed/WhatsApp digital prescriptions.\n• **In-House Pharmacy POS**: Medicine inventory management, batch number tracking, expiry date alerts, and retail billing.\n• **Pathology & Diagnostic Laboratory**: Test booking, sample collection barcodes, automated lab report generation, and diagnostic history.\n• **Billing & Insurance TPA**: Consolidated hospitalization billing, room tariffs, doctor visit fees, and Ayushman Bharat / TPA claims.\n• **Electronic Medical Records**: Lifelong patient medical histories, clinical charts, and discharge summaries.\n\n🔗 Live Worker: `https://care-plus.cvidyasolutions.workers.dev/`\n\nWould you like to schedule a personalized walkthrough for your hospital, clinic, or diagnostic center?";
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
    if (hinglish) {
      return "**C Vidya PDF and Media Tools SaaS** high-speed digital document transformation aur media processing suite hai:\n\n• **Word to PDF Converter**: `.docx` files ko original formatting aur fonts ke saath high-speed PDF me convert karein.\n• **Complete PDF Suite**:\n  - **Merge PDF**: Multiple PDFs ko ek file me combine karein.\n  - **Split PDF**: Specific pages alag karein.\n  - **Compress PDF**: File size chhota karein bina quality kharab kiye.\n  - **Watermark & Protect**: Custom logo watermark lagayein aur password security dalein.\n• **Media & Image Tools**: PNG, JPG, WebP format conversion aur optimization.\n• **100% Privacy Guarantee**: Client-side edge processing hoti hai, aapka data kisi server par store nahi hota.\n\n🔗 Live Worker Link: `https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/`\n\nKya aapko koi document abhi convert karna hai?";
    }
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
    userText.includes("old data") ||
    userText.includes("purana data")
  ) {
    if (hinglish) {
      return "Haan, bilkul! **C Vidya Solutions** ke sabhi software me seamless data migration support milta hai:\n\n• **1-Click Excel / CSV Import**: Aapke purane students, members, book lists, medicines, ya customers ka data Excel sheet ke through direct upload ho jata hai.\n• **Free Migration Support**: Hamari technical engineering team purane system se C Vidya me data transfer karne me bilkul free help karti hai taaki aapka kaam ek din bhi na ruke.\n\nAapko kis software me data import karwana hai?";
    }
    return "Yes, absolutely! **C Vidya Solutions** supports seamless data import:\n\n• **Bulk Excel / CSV Import**: Upload existing student records, member lists, book catalogs, inventory items, or client khata balances in one click.\n• **Free Migration Assistance**: Our engineering team provides complimentary data cleansing and onboarding support to ensure zero downtime when switching from legacy software.\n\nWhich software are you planning to migrate data into?";
  }

  // Cloud Architecture & Security
  if (
    userText.includes("security") ||
    userText.includes("safe") ||
    userText.includes("cloud") ||
    userText.includes("backup") ||
    userText.includes("stpi") ||
    userText.includes("server") ||
    userText.includes("surakshit")
  ) {
    if (hinglish) {
      return "**C Vidya Cloud Security & Infrastructure**:\n\n• **Cloudflare Global Edge**: India aur worldwide <50ms latency aur 99.99% uptime guarantee.\n• **Bank-Grade Encryption**: End-to-end TLS 1.3 in-transit aur AES-256 database encryption.\n• **Automatic Daily Backups**: Daily automated cloud backups taaki aapka data hamesha 100% safe aur recoverable rahe.\n• **Role-Based Access (RBAC)**: Admin, Staff, Accountant aur Customers ke alag-alag permissions taaki koi unauthorized access na ho.\n• **STPI Government Incubation**: C Vidya Solutions Software Technology Parks of India (STPI Sindri, BIT Sindri Campus) dwara supported aur certified hai.";
    }
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
    if (hinglish) {
      return "**C Vidya Technical Support Guidance**:\n\n• **Login / Password Problem**: Login page par 'Forgot Password' par tap karke apna registered email/mobile dalein aur OTP se password reset karein.\n• **Support Ticket**: Agar koi error aa raha hai, toh kripya ye share kijiye:\n  1. Software ka Naam\n  2. Registered Email ya Mobile Number\n  3. Device Type (Mobile ya Laptop/Desktop)\n  4. Error Message ya description\n\n🔒 *Security Note: Kabhi bhi apna password ya OTP kisi ke saath share na karein.* Hamari support team turant aapko assist karegi!";
    }
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
    userText.includes("director") ||
    userText.includes("pata") ||
    userText.includes("kaha hai")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Official Company Details**:\n\n• **Founder & Director**: **Chiranjeev Das**\n• **Established**: 2025\n• **Tagline**: *Innovating Software for a Simpler Future*\n• **Official Website**: https://cvidyasolutions.com\n• **Helpline Mobile**: +91 92885 17027 / 8987766981\n• **Official Email**: cvidyasolutions@gmail.com\n• **Founder Desk**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch & Incubation Center**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n• **Social Media**: YouTube (@cvidyasolutions), Facebook, Instagram, LinkedIn & X (@CVidyaSolutions)";
    }
    return "**C Vidya Solutions Official Details**:\n\n• **Founded**: 2025 by **Chiranjeev Das** (Founder & Director)\n• **Tagline**: *Innovating Software for a Simpler Future*\n• **Official Website**: https://cvidyasolutions.com\n• **Helpline Phone**: +91 92885 17027 / 8987766981\n• **Official Email**: cvidyasolutions@gmail.com\n• **Founder Desk**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch & Incubation**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n• **Social**: YouTube, Facebook, Instagram, LinkedIn, and Twitter/X";
  }

  // 11. General Catch-All Fallback
  if (hinglish) {
    return "**C Vidya Solutions** me connect karne ke liye dhanyawad! 👋\n\nMain aapko in sabhi me help kar sakta hoon:\n• **7 Flagship SaaS Products** (Library, Gym Fitness Zone, Institutes, Coaching, AgriFusion, Jewelers, CRM)\n• **4 Autonomous AI Agents** (Social Media, Support, SalesFlow, B2B Marketing)\n• **Specialized Services** (Petrol Pump Site, Care Plus Healthcare System, PDF & Media Tools)\n• **Live Interactive Demos, Pricing Plans, aur Onboarding Support**\n\nAapko kis baare me jaankari chahiye? Mujhe bataiye, main turant guide karunga!";
  }

  return "Thank you for reaching out to **C Vidya Solutions**! 👋\n\nI can assist you with:\n• **7 Flagship SaaS Products** (Library, Gym, Institute, Coaching, AgriFusion, Jewelers, Enterprises CRM)\n• **4 Autonomous AI Agents** (Social Media, Support, SalesFlow, B2B Marketing)\n• **Specialized Services** (Petrol Pump Site, Care Plus Healthcare System, PDF & Media Tools SaaS)\n• **Live Interactive Demos, Pricing Plans, and Onboarding Support**\n\nWhat would you like to know more about today? You can ask in English or Hinglish!";
}
