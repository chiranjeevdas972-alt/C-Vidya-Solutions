import { ProductService } from "./types";

export const servicesData: ProductService[] = [
  {
    id: "library",
    num: "01",
    name: "C VIDYA LIBRARY",
    tagline: "Automated Book Inflow & Student Membership Tracking",
    description: "Complete library management system to manage books, members, issue/return and other library operations.",
    externalLink: "https://v.cvidyasolutions.workers.dev/",
    features: [
      "ISBN barcode scanner and inventory tracking",
      "Automated WhatsApp & SMS notifications for overdue titles",
      "Membership levels and circulation policy configuration",
      "Digital student reading room check-in ledger",
      "Detailed reports on reader habits and popular authors"
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
    description: "Gym & fitness management software to handle members, plans, attendance, trainers and daily activities seamlessly.",
    externalLink: "https://fitzone.cvidyasolutions.workers.dev/",
    features: [
      "Biometric finger scan and facial door access logs",
      "Personalized training diet regimes & goal planners",
      "Flexible active subscription cards (Daily/Monthly/Yearly)",
      "Trainer assignment and private roster timetables",
      "Peak attendance and gym floor traffic visualization"
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
    description: "All-in-one solution for schools and institutes to manage students, fees, attendance, exams and results.",
    features: [
      "End-to-end admission counseling CRM pipeline",
      "Automated academic report cards generator",
      "Instantly downloadable PDF school ledger & cashbooks",
      "School bus route tracking, geo-alerts & dormitory slots",
      "Dedicated portal for Parents to check homework & attendances"
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
    description: "Specially designed for coaching centers to manage batches, students, attendance, fees and performance.",
    externalLink: "https://coaching.cvidyasolutions.workers.dev/",
    features: [
      "Dynamic batch creation and classroom seating logs",
      "Biometric attendance with real-time SMS status sent to parents",
      "OMR offline mock test grading sheets scanner & rank generator",
      "Interactive course completion calendars",
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
    id: "crm",
    num: "05",
    name: "C VIDYA CRM",
    tagline: "Intuitive Sales Funnels & Lead Generation Metrics",
    description: "Customer Relationship Management system to manage leads, sales, customers and improve business relationships.",
    externalLink: "https://crm.cvidyasolutions.workers.dev/",
    features: [
      "Dynamic pipeline cards with simple drag-drop states",
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
  },
  {
    id: "municipal",
    num: "06",
    name: "C VIDYA MUNICIPAL SYSTEM",
    tagline: "E-Governance Portal & Digital Civic Grievance Desks",
    description: "Smart solution for municipal corporations and local bodies to manage records, citizens, complaints and daily operations.",
    features: [
      "Online citizen portal to register complaints (potholes, garbage, leakages)",
      "Digital Registrar for Birth, Marriage & Death certificates",
      "Water tax and building layout validation fee portal",
      "Sanitation workforce inspector dispatch queues",
      "Public notice board broadcasts to specific wards"
    ],
    mockData: {
      title: "Smart Municipal Corp Central Console",
      metrics: [
        { label: "Total Complaints Received", value: "254", change: "Last 30 days", isPositive: true },
        { label: "Grievances Resolved (%)", value: "85.8%", change: "+4% SLA adherence", isPositive: true },
        { label: "Tax Revenue Gathered", value: "₹45.2L", change: "Surpassed year targets", isPositive: true },
        { label: "Active Field Sanitation Crew", value: "14 Teams", change: "Fully deployed today", isPositive: true }
      ],
      recentActivity: [
        "Complaint ticket #M-102 'Water main leakage at Sector 4' resolved in 4 hours",
        "Birth certificate #B-4089 issued for ward 7 resident",
        "Public health notice: Larva eradication schedules rolled for South Ward",
        "Online payment logged: Property tax clearing for survey area #812-A"
      ],
      chartData: [
        { name: "Mon", value: 12 },
        { name: "Tue", value: 18 },
        { name: "Wed", value: 15 },
        { name: "Thu", value: 25 },
        { name: "Fri", value: 22 },
        { name: "Sat", value: 8 }
      ]
    }
  },
  {
    id: "farming",
    num: "07",
    name: "C VIDYA FARMING MANAGEMENT",
    tagline: "Smart Agriculture Harvesting & Storage Allocator",
    description: "Modern farming management software to track crops, resources, expenses and improve agriculture productivity.",
    features: [
      "IoT soil telemetry compatibility (humidity & mineral indicators)",
      "Automated crop-cycle timetable and seed scheduling",
      "Fertilizer consumption trackers & supplier expense loggers",
      "Direct-to-wholesale market pricing spreadsheets and logistics",
      "Livestock feeding schedules and vaccine compliance alerts"
    ],
    mockData: {
      title: "Smart Farms Agronomy Dashboard",
      metrics: [
        { label: "Paddy Field Acres Tracked", value: "420 sqm", change: "Continuous telemetry", isPositive: true },
        { label: "Crop Health Index Score", value: "94/100", change: "Optimal wet condition", isPositive: true },
        { label: "Estimated Harvest Date", value: "June 12", change: "In 23 days approx", isPositive: true },
        { label: "Expended Fertilizer Cost", value: "₹12,400", change: "Within safety budget", isPositive: true }
      ],
      recentActivity: [
        "Crop water requirements: Irrigation valve on Zone B switched on automatically",
        "Sona-Masoori organic nursery fertilizer rotation timeline declared",
        "Livestock record: Vet scheduled vaccination booster for Section A herds",
        "Supplier payment registered: Purchase order #AG-12 for winter seed batches"
      ],
      chartData: [
        { name: "Mon", value: 85 },
        { name: "Tue", value: 88 },
        { name: "Wed", value: 92 },
        { name: "Thu", value: 91 },
        { name: "Fri", value: 94 },
        { name: "Sat", value: 94 }
      ]
    }
  },
  {
    id: "members",
    num: "08",
    name: "C VIDYA MEMBERS MANAGEMENT",
    tagline: "Premium Club Facilities Booking & Subscriptions",
    description: "Membership management solution for clubs, organizations and societies to manage members, subscriptions and activities.",
    features: [
      "Club door access gating with membership NFC barcode cards",
      "Facility booking manager (banquets, tennis courts, conference tables)",
      "Annual member directory and ledger logs",
      "Online subscription payment gateways and auto-renewals",
      "Digital newsletters creator with tracking metrics"
    ],
    mockData: {
      title: "Elite Society & Members Registry Console",
      metrics: [
        { label: "Subscribed Safe Members", value: "780 Profiles", change: "99% active status", isPositive: true },
        { label: "Facility Bookings Today", value: "24 Slots", change: "Community Hall Peak", isPositive: true },
        { label: "Membership Fees Received", value: "₹3.8L", change: "This collection cycle", isPositive: true },
        { label: "Outstanding Dues Reminders", value: "x3 Members", change: "Follow-up initiated", isPositive: false }
      ],
      recentActivity: [
        "Residential block booked community badminton slot for tomorrow 06:00 AM",
        "Member Amrit Raj cleared outstanding tournament registration dues (₹1,200)",
        "Gated pass card #NFC-194 activated for newly added executive resident",
        "Banquets hall lease rules updated for Summer Poolside events"
      ],
      chartData: [
        { name: "Mon", value: 650 },
        { name: "Tue", value: 680 },
        { name: "Wed", value: 710 },
        { name: "Thu", value: 750 },
        { name: "Fri", value: 780 },
        { name: "Sat", value: 720 }
      ]
    }
  }
];
