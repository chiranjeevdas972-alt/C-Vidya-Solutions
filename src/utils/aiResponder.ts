// Deep Research Knowledge Base & Smart Offline AI Responder for C Vidya Solutions

export function getSmartAssistantResponse(messages: { role: string; content?: string; text?: string }[]): string {
  if (!messages || messages.length === 0) {
    return "Hello! 👋 Welcome to C Vidya Solutions.\n\nI am your AI Customer Support Assistant. How can I help you today?";
  }

  const lastMsg = messages[messages.length - 1];
  const userText = ((lastMsg.content || lastMsg.text || "").toLowerCase()).trim();

  if (!userText) {
    return "Hello! 👋 Welcome to C Vidya Solutions. How can I assist you today?";
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
    return "Koi baat nahi! 👋 Aap aaram se C Vidya Solutions ke sabhi software products aur AI Agents ko explore kar sakte hain.\n\nAgar aapko Library System, CV Fitness Zone, AgriFusion, Coaching Management, ya hamare 4 Autonomous AI Agents ke baare mein jaankari chahiye ya live demo chahiye, toh main aapki help ke liye yahan hoon. Have a wonderful day!";
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
    return "Hello! 👋 Welcome to **C Vidya Solutions**.\n\nI am your **AI Customer Support Assistant**. I can help you with:\n\n• **7 Flagship SaaS Products** (Library, Gym, Institutes, Coaching, AgriFusion, Jewelry, CRM)\n• **4 Autonomous AI Agents** (Social Media, Support, SalesFlow, B2B SaaS Marketing)\n• **Live Interactive Demos & Sandbox Access**\n• **Custom Pricing & Onboarding Support**\n\nHow can I help you today? Aap Hindi, English, ya Hinglish mein bhi pooch sakte hain!";
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
    return "I am the official **AI Customer Support Assistant** of C Vidya Solutions. I can resolve queries regarding our software architectures, features, pricing, demos, and system support.\n\nIf you would like to speak directly with our executive or leadership team:\n\n📞 **Phone**: 8987766981 / +91 9288517027\n📧 **Email**: cvidyasolutions@gmail.com\n👔 **Founder / Director Desk**: chiranjeev0058@gmail.com\n\nPlease share your name, phone number, and organization, and our team will get in touch with you shortly!";
  }

  // 4. Demo, Trial, or Sandbox Access
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
    return "We would love to provide you with a **Free Live Product Demo & Sandbox Access**!\n\nAll our software products have live interactive cloud environments hosted on high-performance Cloudflare edge nodes.\n\nTo schedule a personalized 1-on-1 walkthrough or receive custom credentials, please share:\n1. **Your Full Name**\n2. **Business / Institute Name**\n3. **Mobile Number**\n4. **Email Address**\n5. **Product of Interest** (e.g. Library, Fitness Zone, AgriFusion, AI Agents)\n6. **City & State**\n\nOur team will set up your environment within 24 hours!";
  }

  // 5. Pricing, Cost, Rates, Subscription Plans
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
    return "**C Vidya Solutions** offers modular, affordable SaaS pricing based on your scale and requirements:\n\n• **Starter Tier**: Designed for single-branch libraries, fitness centers, and local poultry/agri shops.\n• **Growth / Professional Tier**: Designed for multi-batch coaching centers, jewelry retailers, and academic campuses.\n• **Enterprise Custom**: Multi-branch consolidation, dedicated edge instances, custom ERP modules, and priority 24/7 SLA.\n\nPlease let me know which software you are interested in and your approximate number of students/members/users, and we will share exact pricing options!";
  }

  // 6. AI AGENTS SUITE (All 4 Autonomous AI Agents)
  if (
    userText.includes("ai agent") ||
    userText.includes("autonomous agent") ||
    userText.includes("ai saas") ||
    userText.includes("agents")
  ) {
    return "**C Vidya Solutions** offers **4 Autonomous AI Agents** (AI SaaS Suite):\n\n1. **C Vidya AI Social Media Agent**: Autonomous viral trend research, multi-platform scheduling (LinkedIn, X, Instagram, Facebook), and audience engagement automation.\n   🔗 [Live Worker: c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev]\n\n2. **C Vidya AI Customer Support Agent**: 24/7 Omnichannel RAG engine, automated ticket classification, sub-second resolution, and human escalation queues.\n   🔗 [Live Worker: c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev]\n\n3. **C Vidya Solutions SalesFlow AI Agent**: Autonomous B2B lead discovery, email verification, hyper-personalized outreach sequences, and demo calendar booking.\n   🔗 [Live Worker: c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev]\n\n4. **C Vidya AI Marketing for B2B SaaS Companies**: Inbound demand gen engine, competitor gap analysis, automated SEO articles, LinkedIn thought leadership, and MQL pipeline acceleration.\n   🔗 [Live Worker: c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev]\n\nWhich AI Agent would you like to explore or deploy?";
  }

  // 7. AI Social Media Agent
  if (
    userText.includes("social media agent") ||
    userText.includes("ai social") ||
    userText.includes("linkedin post") ||
    userText.includes("instagram agent") ||
    userText.includes("twitter agent")
  ) {
    return "**C Vidya AI Social Media Agent** is an autonomous marketing engine:\n\n• **Viral Trend Research**: Ingests industry signals to identify trending topics.\n• **Multi-Platform Publishing**: Writes high-converting copy and auto-schedules to LinkedIn, X (Twitter), Instagram, and Facebook.\n• **Engagement Nurturing**: Monitors post sentiment, automatically replies to prospect comments, and qualifies DM leads.\n• **Analytics**: Provides conversion tracking and optimal posting time heatmaps.\n\n🔗 Live App: `https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/`";
  }

  // 8. AI Customer Support Agent
  if (
    userText.includes("ai support") ||
    userText.includes("customer support agent") ||
    userText.includes("rag agent") ||
    userText.includes("support bot")
  ) {
    return "**C Vidya AI Customer Support Agent** provides automated 24/7 enterprise service:\n\n• **Sub-Second Resolution**: Instant query answering with Knowledge Base RAG integration.\n• **Omnichannel Support**: Web widgets, WhatsApp Business API, and Email.\n• **Ticket Triage & SLA**: Automated categorization and priority queueing.\n• **Human Agent Escalation**: Smooth handover when complex technical attention is required.\n\n🔗 Live App: `https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/`";
  }

  // 9. SalesFlow AI Agent
  if (
    userText.includes("salesflow") ||
    userText.includes("sales agent") ||
    userText.includes("outreach agent") ||
    userText.includes("sdr agent") ||
    userText.includes("b2b sales")
  ) {
    return "**C Vidya Solutions SalesFlow AI Agent** automates your B2B sales pipeline:\n\n• **Prospect Discovery**: Scrapes and verifies high-intent business leads in real-time.\n• **Hyper-Personalized Outreach**: Multi-touch email, WhatsApp, and LinkedIn sequences tailored to company pain points.\n• **BANT Qualification**: Scores buying intent and budget readiness automatically.\n• **Calendar Demo Booking**: Schedules qualified meetings directly onto sales team calendars.\n\n🔗 Live App: `https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/`";
  }

  // 10. AI Marketing for B2B SaaS Companies
  if (
    userText.includes("marketing agent") ||
    userText.includes("b2b saas marketing") ||
    userText.includes("ai marketing") ||
    userText.includes("seo agent") ||
    userText.includes("content agent")
  ) {
    return "**C Vidya AI Marketing for B2B SaaS Companies** is an autonomous demand gen engine:\n\n• **SEO Content Clusters**: Keyword research, competitor gap analysis, and long-form authoritative articles for Google SERP dominance.\n• **B2B Thought Leadership**: Generates high-converting LinkedIn carousels and technical executive copy.\n• **Lead Magnet & Funnel Automation**: Dynamic landing page copy A/B testing and interactive demo scripts.\n• **CAC & MQL Velocity**: Full-funnel marketing attribution analytics.\n\n🔗 Live App: `https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/`";
  }

  // 11. C Vidya Library Management System
  if (
    userText.includes("library") ||
    userText.includes("kitab") ||
    userText.includes("book") ||
    userText.includes("reading room") ||
    userText.includes("study center")
  ) {
    return "**C Vidya Library Management System** is a complete digital solution for libraries and reading rooms:\n\n• **Student & Member Profiles**: Digital membership passes and reading room seat allocator.\n• **Book Catalog & Barcode/ISBN Scanner**: Instant book check-in/checkout and inventory reconciliation.\n• **Automated Overdue Alerts**: Sends WhatsApp and SMS notifications with fine calculations.\n• **Billing & Ledgers**: Fee collection receipts, expense logs, and cashbooks.\n\n🔗 Live App: `https://v.cvidyasolutions.workers.dev/`\n\nWould you like to schedule a live demo for your library?";
  }

  // 12. CV Fitness Zone (Gym Management)
  if (
    userText.includes("gym") ||
    userText.includes("fitness") ||
    userText.includes("workout") ||
    userText.includes("trainer") ||
    userText.includes("fitzone")
  ) {
    return "**CV Fitness Zone** is designed for modern gyms, crossfit studios, and health clubs:\n\n• **Biometric Turnstile Gates**: Fingerprint and RFID wristband entrance logs with automatic turnstile lock for unpaid memberships.\n• **Membership Plans**: Daily, monthly, quarterly, and annual subscription cycles.\n• **Automated Renewal Invoices**: Instant WhatsApp fee payment reminders.\n• **Diet & Workout Planners**: Personalized macro cards and trainer allocation rosters.\n\n🔗 Live App: `https://fitzone.cvidyasolutions.workers.dev/`\n\nWould you like a live demo for your gym?";
  }

  // 13. Institutes Management Software
  if (
    userText.includes("institute") ||
    userText.includes("school") ||
    userText.includes("college") ||
    userText.includes("campus") ||
    userText.includes("admission")
  ) {
    return "**C Vidya Institutes Management** is an all-in-one ERP for schools and colleges:\n\n• **Admissions CRM Pipeline**: Student intake tracking from application to enrollment.\n• **Fees & Ledger**: Digital fee collection, automated receipts, and cashbook reconciliation.\n• **Attendance & Smart Cards**: Biometric student check-in with instant parent notifications.\n• **Gradebook & Reports**: CBSE/ICSE standard report card generation.\n• **Transport & Dormitory**: School bus GPS tracking and hostel room allocations.";
  }

  // 14. Coaching Management Software
  if (
    userText.includes("coaching") ||
    userText.includes("tuition") ||
    userText.includes("batch") ||
    userText.includes("jee") ||
    userText.includes("neet") ||
    userText.includes("upsc") ||
    userText.includes("mock test")
  ) {
    return "**C Vidya Coaching Management** is tailored for competitive academies (JEE / NEET / UPSC / State Boards):\n\n• **Dynamic Batch Scheduling**: Batch creation, syllabus trackers, and seating rosters.\n• **Biometric Attendance**: Automated SMS alerts to parents when a student is absent.\n• **Offline OMR Mock Test Grader**: Rapid OMR sheet scanning and All-India Rank (AIR) generation.\n• **Doubt Clearing & Mentor Logs**: Ticketed faculty doubt resolution.\n\n🔗 Live App: `https://coaching.cvidyasolutions.workers.dev/`";
  }

  // 15. AgriFusion & FarmFresh Hub (Agriculture, Poultry, Fishery, Goat Farming)
  if (
    userText.includes("farm") ||
    userText.includes("agrifusion") ||
    userText.includes("agriculture") ||
    userText.includes("poultry") ||
    userText.includes("chicken") ||
    userText.includes("chickmart") ||
    userText.includes("goat") ||
    userText.includes("fish") ||
    userText.includes("livestock") ||
    userText.includes("kheti")
  ) {
    return "**AgriFusion & FarmFresh Hub** (*'One Platform. Every Farm. Unlimited Growth.'*):\n\n• **Multi-Farm Management**: Poultry flock cycles, fishery pond water telemetry (pH/DO), goat breeding herds, and livestock health records.\n• **Integrated POS & Accounting**: Fast retail/wholesale point-of-sale billing, customer ledgers, and distributor orders.\n• **Feed Stock & Expense Tracking**: Feed inventory re-order alerts and operational P&L reports.\n\n🔗 Live App: `https://fresh.cvidyasolutions.workers.dev/`\n\nWhich farming activity do you manage?";
  }

  // 16. Jewelry Management Software
  if (
    userText.includes("jewel") ||
    userText.includes("gold") ||
    userText.includes("silver") ||
    userText.includes("bullion") ||
    userText.includes("karigar") ||
    userText.includes("sona")
  ) {
    return "**C Vidya Jewelry Management** is a specialized bullion and jewelry ERP:\n\n• **Live Market Rate Sync**: Automatic daily 24K/22K gold and silver spot price feeds.\n• **Precious Weight Tracking**: Pure metal weight, wastage calculations, and casting logs.\n• **Karigar (Artisan) Workflow**: Task allocations, metal issuances, and balance reconciliation.\n• **In-Store Barcode Billing**: Instant GST-compliant invoice printing and custom order books.\n\n🔗 Live App: `https://jewelry.cvidyasolutions.workers.dev/`";
  }

  // 17. Enterprise CRM
  if (
    userText.includes("crm") ||
    userText.includes("sales pipeline") ||
    userText.includes("leads") ||
    userText.includes("deal") ||
    userText.includes("proposal")
  ) {
    return "**C Vidya Enterprise CRM** streamlines commercial sales and lead management:\n\n• **Drag-and-Drop Kanban**: Visual deal pipeline stages and probability scoring.\n• **VoIP & Interaction Timeline**: Automated call logs, meeting notes, and follow-up alerts.\n• **Quotation PDF Builder**: Instant branded proposal generation.\n• **Sales Rep KPIs**: Conversion rates, cycle times, and revenue attribution.\n\n🔗 Live App: `https://crm.cvidyasolutions.workers.dev/`";
  }

  // 18. Technical Support, Login Issues, Password Reset, Errors
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
    return "**C Vidya Technical Support Guidance**:\n\n• **Login / Password Issues**: Click 'Forgot Password' on your software login portal, enter your registered email/phone, and submit the verification code.\n• **Technical Issue Submission**: Please share:\n  1. Software Product Name\n  2. Registered Email or Mobile Number\n  3. Error Message or description\n  4. Device Type (Mobile / Laptop / Desktop)\n\n🔒 *Security Warning: Never share your password, OTP, or PIN with anyone.* Our technical team will assist you immediately!";
  }

  // 19. Company Details, Founder, Address & STPI Sindri
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
    return "**C Vidya Solutions Official Details**:\n\n• **Founded**: 2025 by **Chiranjeev Das**\n• **Tagline**: *Innovating Software for a Simpler Future*\n• **Official Website**: https://cvidyasolutions.com\n• **Helpline Phone**: 8987766981 / +91 9288517027\n• **Official Email**: cvidyasolutions@gmail.com\n• **Founder Email**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch & Incubation**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand";
  }

  // 20. General / Catch-all Fallback
  return "Thank you for reaching out to **C Vidya Solutions**! 👋\n\nI can provide deep information on our **7 SaaS products** (Library, Gym, Institutes, Coaching, AgriFusion, Jewelry, CRM), **4 Autonomous AI Agents** (Social Media, Support, SalesFlow, B2B Marketing), live demos, pricing, and technical support.\n\nWhat would you like to know more about?";
}
