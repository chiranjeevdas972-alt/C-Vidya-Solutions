export interface CareerRole {
  title: string;
  category: string;
  type: "Full-Time" | "Internship" | "Graduate Program";
  description: string;
  location: string;
}

export const CATEGORIES = [
  "All",
  "Software Development",
  "AI and Data",
  "Cloud Infrastructure",
  "Quality and Assurance",
  "Cyber Security",
  "Design",
  "Product & Management",
  "Customer Services & Support",
  "Sales & Marketing",
  "Corporate Functions",
  "Graduate Program",
  "Internship Opportunities"
] as const;

export const rolesData: CareerRole[] = [
  // Engineering & Software Developer (Career Inside)
  { title: "Software Engineer", category: "Software Development", type: "Full-Time", description: "Design scalable backend systems, secure APIs, and database migrations for C Vidya school modules.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Software Developer", category: "Software Development", type: "Full-Time", description: "Maintain and optimize high-fidelity client dashboards, OMR engines, and core CRM tools.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Full-Stack Developer", category: "Software Development", type: "Full-Time", description: "Own full-stack architecture utilizing modern React/Vite interfaces and Express server endpoints.", location: "Dhanbad HQ" },
  { title: "Front-End Developer", category: "Software Development", type: "Full-Time", description: "Develop pixel-perfect web layouts, micro-animations, and responsive layouts with Tailwind CSS.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Back-End Developer", category: "Software Development", type: "Full-Time", description: "Implement rate-limiting algorithms, NoSQL queries, and secure Firestore structural rules.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Java Developer", category: "Software Development", type: "Full-Time", description: "Maintain robust server integrations, core school database schemas, and billing log pipelines.", location: "Dhanbad HQ" },
  { title: "Python Developer", category: "Software Development", type: "Full-Time", description: "Write optical character recognition models for offline OMR sheets and AI chat integrations.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "PHP Developer", category: "Software Development", type: "Full-Time", description: "Support regional civic body portals, MySQL database records, and citizen logging panels.", location: "Dhanbad HQ" },
  { title: ".NET Developer", category: "Software Development", type: "Full-Time", description: "Maintain robust offline windows integrations for desktop biometric scanner hardware.", location: "Dhanbad HQ" },
  { title: "Mobile App Developer", category: "Software Development", type: "Full-Time", description: "Architect and build native/hybrid cross-platform wrappers for parent and student apps.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Android Developer", category: "Software Development", type: "Full-Time", description: "Develop native Android apps with Kotlin and Compose for gym scanners and parent check-ins.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "iOS Developer", category: "Software Development", type: "Full-Time", description: "Deliver premium Swift iOS apps designed for private school owners and institutional directors.", location: "Dhanbad HQ" },
  { title: "Flutter Developer", category: "Software Development", type: "Full-Time", description: "Compile high-performance Android & iOS client applications from a single secure codebase.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Desktop Application Developer", category: "Software Development", type: "Full-Time", description: "Build standalone system controllers to synchronize hardware biometrics and local memory caches.", location: "Dhanbad HQ" },
  { title: "API Developer", category: "Software Development", type: "Full-Time", description: "Design, test, and throttle secure microservices for WhatsApp billing and SMS gateways.", location: "STPI Branch, BIT Sindri Campus" },

  // AI and Data
  { title: "AI Engineer", category: "AI and Data", type: "Full-Time", description: "Embed real-time Gemini model routing systems into our custom CRM administrative panel.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Machine Learning Engineer", category: "AI and Data", type: "Full-Time", description: "Train and evaluate advanced computer vision models to accurately grade physical OMR sheets.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Data Scientist", category: "AI and Data", type: "Full-Time", description: "Generate predictive modeling for school dropouts and fee payment behavior patterns.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Data Analyst", category: "AI and Data", type: "Full-Time", description: "Sift through civic complaint records to build optimized route mappings for municipality ward workers.", location: "Dhanbad HQ" },
  { title: "Business Intelligence Analyst", category: "AI and Data", type: "Full-Time", description: "Synthesize operational library charts and coaching leads info into clean executive boards.", location: "Dhanbad HQ" },
  { title: "Prompt Engineer", category: "AI and Data", type: "Full-Time", description: "Develop and test precise prompt architectures to guide our smart voice support assistant.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Generative AI Specialist", category: "AI and Data", type: "Full-Time", description: "Create customized automatic content generation models to assist school teachers with question papers.", location: "STPI Branch, BIT Sindri Campus" },

  // Cloud Infrastructure
  { title: "DevOps Engineer", category: "Cloud Infrastructure", type: "Full-Time", description: "Maintain secure container deployments, load-balancers, and auto-scaling scripts on Google Cloud.", location: "Dhanbad HQ" },
  { title: "Cloud Engineer", category: "Cloud Infrastructure", type: "Full-Time", description: "Configure Firestore regional clusters, CDN caching headers, and WAF protection.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Site Reliability Engineer", category: "Cloud Infrastructure", type: "Full-Time", description: "Maximize uptime of high-priority e-Governance portals during civic registration phases.", location: "Dhanbad HQ" },
  { title: "Systems Administrator", category: "Cloud Infrastructure", type: "Full-Time", description: "Oversee internal Linux servers, backup routines, and VPN access controls for developers.", location: "Dhanbad HQ" },
  { title: "Network Engineer", category: "Cloud Infrastructure", type: "Full-Time", description: "Design reliable high-speed network topologies for school campus smart card scanner clusters.", location: "STPI Branch, BIT Sindri Campus" },

  // Quality and Assurance
  { title: "QA Engineer", category: "Quality and Assurance", type: "Full-Time", description: "Author complete test plans, run regression tests, and maintain comprehensive issue trackers.", location: "Dhanbad HQ" },
  { title: "Manual Test Engineer", category: "Quality and Assurance", type: "Full-Time", description: "Thoroughly verify multi-tab forms, biometric logins, and ledger download operations manually.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Automation Test Engineer", category: "Quality and Assurance", type: "Full-Time", description: "Script end-to-end user flow test sequences utilizing Playwright and Selenium frameworks.", location: "Dhanbad HQ" },
  { title: "Performance Engineer", category: "Quality and Assurance", type: "Full-Time", description: "Execute synthetic stress tests to benchmark concurrent Firestore document reads and writes.", location: "STPI Branch, BIT Sindri Campus" },

  // Cyber Security
  { title: "Cyber Security Analyst", category: "Cyber Security", type: "Full-Time", description: "Audit active system firewall logs, cross-site scripting guards, and token decoders.", location: "Dhanbad HQ" },
  { title: "Information Security Engineer", category: "Cyber Security", type: "Full-Time", description: "Design access policies to guarantee full compliance with IT Act 2000 privacy principles.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Penetration Tester", category: "Cyber Security", type: "Full-Time", description: "Conduct scheduled black-box and white-box hacking simulations across client SaaS routers.", location: "Dhanbad HQ" },
  { title: "SOC Analyst", category: "Cyber Security", type: "Full-Time", description: "Monitor incoming routing traffic for DDoS indications, automated bots, and brute-force attempts.", location: "Dhanbad HQ" },

  // Design
  { title: "UI Designer", category: "Design", type: "Full-Time", description: "Develop pixel-perfect web UI interfaces using C Vidya's premium navy-gold visual identity guidelines.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "UX Designer", category: "Design", type: "Full-Time", description: "Map out highly intuitive student, gym-member, and citizen complaint dashboard user journeys.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "UI/UX Designer", category: "Design", type: "Full-Time", description: "Combine visual components and structural user feedback into high-performance web templates.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Graphic Designer", category: "Design", type: "Full-Time", description: "Design high-fidelity brochures, digital display banners, and physical hardware instruction guides.", location: "Dhanbad HQ" },
  { title: "Motion Graphic Designer", category: "Design", type: "Full-Time", description: "Design graceful entrance animations, interactive hover indicators, and responsive dashboard loaders.", location: "STPI Branch, BIT Sindri Campus" },

  // Product and Management
  { title: "Product Manager", category: "Product & Management", type: "Full-Time", description: "Steer product vision, prioritize feature updates, and translate institutional user demands into roadmap steps.", location: "Dhanbad HQ" },
  { title: "Associate Product Manager", category: "Product & Management", type: "Full-Time", description: "Own localized features, write detailed spec documents, and test final user-facing flows.", location: "Dhanbad HQ" },
  { title: "Project Manager", category: "Product & Management", type: "Full-Time", description: "Coordinate project schedules, manage on-site biometric installations, and track milestone delivery.", location: "Dhanbad HQ" },
  { title: "Scrum Master", category: "Product & Management", type: "Full-Time", description: "Remove team blockers, lead agile daily standups, and facilitate sprint retrospective sessions.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Business Analyst", category: "Product & Management", type: "Full-Time", description: "Map operational client workflows to identify automation gaps across schools and municipal bodies.", location: "Dhanbad HQ" },
  { title: "Technical Consultant", category: "Product & Management", type: "Full-Time", description: "Advise enterprise organizations and local colleges on SaaS implementation and API scaling best-practices.", location: "Dhanbad HQ" },

  // Customer Services and Support
  { title: "Technical Support Engineer", category: "Customer Services & Support", type: "Full-Time", description: "Resolve remote and on-site hardware connection issues, local database sync bugs, and barcode scanner faults.", location: "Dhanbad HQ" },
  { title: "Customer Success Executive", category: "Customer Services & Support", type: "Full-Time", description: "Direct school administrator onboarding, ensuring rapid adoption and 100% platform utility satisfaction.", location: "Dhanbad HQ" },
  { title: "Customer Support Executive", category: "Customer Services & Support", type: "Full-Time", description: "Answer phone hotlines, log client tickets, and coordinate technical resolver efforts.", location: "Dhanbad HQ" },
  { title: "Application Support Engineer", category: "Customer Services & Support", type: "Full-Time", description: "Diagnose specific database read/write faults and check automated WhatsApp billing status updates.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Implementation Engineer", category: "Customer Services & Support", type: "Full-Time", description: "Manage physical school campus hardware mounts, RFID card issuers, and local server setups.", location: "Dhanbad HQ" },

  // Sales and Marketing
  { title: "Business Development Executive", category: "Sales & Marketing", type: "Full-Time", description: "Drive client outreach programs to introduce C Vidya software suites to Jharkhand's institutes.", location: "Dhanbad HQ" },
  { title: "Business Development Manager", category: "Sales & Marketing", type: "Full-Time", description: "Oversee regional sales pipelines, prepare high-level enterprise contracts, and achieve growth milestones.", location: "Dhanbad HQ" },
  { title: "Sales Executive", category: "Sales & Marketing", type: "Full-Time", description: "Deliver compelling, highly detailed live software product demonstrations to institutional clients.", location: "Dhanbad HQ" },
  { title: "Sales Manager", category: "Sales & Marketing", type: "Full-Time", description: "Lead, mentor, and track the outbound corporate sales and institutional callback scheduling team.", location: "Dhanbad HQ" },
  { title: "Digital Marketing Executive", category: "Sales & Marketing", type: "Full-Time", description: "Coordinate paid social campaigns and design targeted leads pipelines for private coaching clients.", location: "Dhanbad HQ" },
  { title: "SEO Executive", category: "Sales & Marketing", type: "Full-Time", description: "Improve organic search rankings and visibility for library software and e-Governance keywords.", location: "Dhanbad HQ" },
  { title: "Social Media Manager", category: "Sales & Marketing", type: "Full-Time", description: "Curate professional announcements, share success stories, and manage C Vidya LinkedIn profiles.", location: "Dhanbad HQ" },
  { title: "Content Writer", category: "Sales & Marketing", type: "Full-Time", description: "Draft high-quality, readable blog articles, software tutorials, and informational posts.", location: "Dhanbad HQ" },
  { title: "Technical Content Writer", category: "Sales & Marketing", type: "Full-Time", description: "Author highly structured software manuals, security checklists, and developer integration specs.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Email Marketing Manager", category: "Sales & Marketing", type: "Full-Time", description: "Build and execute monthly educational updates to direct email campaigns for school directors.", location: "Dhanbad HQ" },

  // Corporate Functions
  { title: "HR Executive", category: "Corporate Functions", type: "Full-Time", description: "Manage employee records, drive positive team cultures, and execute onboarding schedules.", location: "Dhanbad HQ" },
  { title: "Talent Acquisition Specialist", category: "Corporate Functions", type: "Full-Time", description: "Oversee campus recruitment programs at BIT Sindri and top engineering institutes in Jharkhand.", location: "Dhanbad HQ" },
  { title: "Finance Executive", category: "Corporate Functions", type: "Full-Time", description: "Monitor company payment entries, compile GST files, and process staff payroll systems.", location: "Dhanbad HQ" },
  { title: "Accountant", category: "Corporate Functions", type: "Full-Time", description: "Audit ledgers, balance internal books, and document regional municipal client subscription orders.", location: "Dhanbad HQ" },
  { title: "Legal Executive / Officer", category: "Corporate Functions", type: "Full-Time", description: "Draft SaaS service-level agreements, non-disclosure contracts, and legal compliance structures.", location: "Dhanbad HQ" },

  // Graduate Program
  { title: "Graduate Engineer GET", category: "Graduate Program", type: "Graduate Program", description: "Participate in an immersive engineering rotational track across back-end, design, and security teams.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Software Engineer Trainee", category: "Graduate Program", type: "Graduate Program", description: "Accelerate your coding abilities under the close guidance of our senior product developers.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Management Trainee", category: "Graduate Program", type: "Graduate Program", description: "Own operations and sales coordinator cycles, paving a direct path to executive project leadership.", location: "Dhanbad HQ" },

  // Internship Opportunities
  { title: "Software Development Intern", category: "Internship Opportunities", type: "Internship", description: "Learn to write clean React components, manage states, and build test suites under guidance.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Full Stack Development Intern", category: "Internship Opportunities", type: "Internship", description: "Support both client-side component creation and backend Express server endpoint routing.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Front-End Developer Intern", category: "Internship Opportunities", type: "Internship", description: "Learn responsive layout engineering and motion state transitions inside our R&D wing.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Back-End Developer Intern", category: "Internship Opportunities", type: "Internship", description: "Gain skills in configuring secure Cloud Firestore queries and backend API logging systems.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Mobile App Development Intern", category: "Internship Opportunities", type: "Internship", description: "Collaborate on testing and deploying Android and iOS hybrid school-parent app wrappers.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Python Developer Intern", category: "Internship Opportunities", type: "Internship", description: "Help test simple script operations for offline student OMR image scan recognition.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Java Developer Intern", category: "Internship Opportunities", type: "Internship", description: "Learn to build and debug legacy databases and secure school inventory registries.", location: "Dhanbad HQ" },
  { title: "AI and Machine Learning Intern", category: "Internship Opportunities", type: "Internship", description: "Test custom prompt models and fine-tune NLP responses for our Vidya AI assistant.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Data Science Intern", category: "Internship Opportunities", type: "Internship", description: "Analyze library circulation statistics to find optimal student borrowing patterns.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Data Analytics Intern", category: "Internship Opportunities", type: "Internship", description: "Help construct weekly performance and metric sheets for gym and coaching leads.", location: "Dhanbad HQ" },
  { title: "DevOps Intern", category: "Internship Opportunities", type: "Internship", description: "Understand CI/CD pipelines and learn automated container compilation flows on the cloud.", location: "Dhanbad HQ" },
  { title: "Cloud Computing Intern", category: "Internship Opportunities", type: "Internship", description: "Gain hands-on experience monitoring database latency and caching parameters.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Cyber Security Intern", category: "Internship Opportunities", type: "Internship", description: "Participate in penetration testing exercises on simulated web sandboxes.", location: "Dhanbad HQ" },
  { title: "QA Testing Intern", category: "Internship Opportunities", type: "Internship", description: "Document bug reproduction workflows and help run regression tests manually.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "UI/UX Designer Intern", category: "Internship Opportunities", type: "Internship", description: "Build interface wireframes and interactive flowcharts for our upcoming municipal features.", location: "STPI Branch, BIT Sindri Campus" },
  { title: "Graphic Designing Intern", category: "Internship Opportunities", type: "Internship", description: "Design visual cards and digital illustrations for client success handbooks.", location: "Dhanbad HQ" },
  { title: "Business Internship", category: "Internship Opportunities", type: "Internship", description: "Work directly on project coordination, client setups, and office operations.", location: "Dhanbad HQ" },
  { title: "Business Analytics Intern", category: "Internship Opportunities", type: "Internship", description: "Collect, sort, and visualize metrics on callback conversions and regional inquiries.", location: "Dhanbad HQ" },
  { title: "Product Management Intern", category: "Internship Opportunities", type: "Internship", description: "Assist in gathering user specifications and drafting initial product feature sheets.", location: "Dhanbad HQ" },
  { title: "Digital Marketing Intern", category: "Internship Opportunities", type: "Internship", description: "Support social media calendar curation, banner layouts, and audience reports.", location: "Dhanbad HQ" },
  { title: "SEO Intern", category: "Internship Opportunities", type: "Internship", description: "Perform on-page keyword analysis and metadata updates for the institutional landing pages.", location: "Dhanbad HQ" },
  { title: "Content Writing Intern", category: "Internship Opportunities", type: "Internship", description: "Draft simple software tutorials, feature articles, and release update descriptions.", location: "Dhanbad HQ" },
  { title: "Technical Support Intern", category: "Internship Opportunities", type: "Internship", description: "Assist in troubleshooting barcode readers and smart biometric terminal configurations.", location: "Dhanbad HQ" },
  { title: "HR Intern", category: "Internship Opportunities", type: "Internship", description: "Screen incoming resumes, schedule candidate interviews, and draft team briefs.", location: "Dhanbad HQ" },
  { title: "Sales and Business Development Intern", category: "Internship Opportunities", type: "Internship", description: "Participate in school survey programs in Dhanbad to evaluate current software adoption rates.", location: "Dhanbad HQ" }
];
