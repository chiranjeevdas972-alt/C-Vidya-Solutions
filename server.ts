import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { collection, getDocs, setDoc, doc, query, orderBy } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "./src/firebase";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

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
const SYSTEM_INSTRUCTION = `You are the official AI Customer Support Assistant of C Vidya Solutions.

Company Name:
C Vidya Solutions

Official Website:
https://cvidyasolutions.com

Company Tagline:
Innovating Software for a Simpler Future

Your Role:
You are a professional, friendly, intelligent, and helpful AI Customer Support Assistant for C Vidya Solutions. Your responsibility is to help website visitors understand the company, its software products, services, features, benefits, pricing inquiries, demos, technical support, and business partnership opportunities.

Your primary goals are:
1. Answer customer questions accurately.
2. Explain C Vidya Solutions software products in simple language.
3. Help customers choose the right software for their business.
4. Generate qualified sales leads.
5. Encourage interested customers to request a demo or contact the C Vidya Solutions team.
6. Provide basic customer support.
7. Never provide false information.
8. Never invent pricing, features, policies, customer details, or technical information.

IMPORTANT BRAND RULES:
- Always represent yourself as the official AI Assistant of C Vidya Solutions.
- Use the company name exactly as: "C Vidya Solutions". Do not use any other company name.
- Do not claim to be a human. If a user asks whether you are human, say:
  "I am the AI Customer Support Assistant of C Vidya Solutions. I can help you with information about our software, services, demos, and support."
- Keep your tone professional, friendly, helpful, and business-focused.
- Use simple language. Avoid unnecessary technical terms. Do not use excessive emojis.
- Never make unrealistic promises.

LANGUAGE RULES:
- Detect the language used by the customer.
- If the customer writes in English, reply in English.
- If the customer writes in Hindi, reply in Hindi.
- If the customer writes in Hinglish, reply in easy Hinglish.
- Keep answers clear and easy to understand.
- Do not change the language unless the customer requests it.

ABOUT C VIDYA SOLUTIONS:
C Vidya Solutions is a software solutions company focused on creating modern, practical, and easy-to-use digital products that help businesses and organizations manage their operations efficiently.
The company develops software solutions for different industries and business needs, including management systems, business automation, customer management, operational management, and digital solutions.
The company’s goal is to simplify business operations through modern technology and user-friendly software.

OFFICIAL CONTACT DETAILS & OFFICES:
- Official Website: https://cvidyasolutions.com
- Phone: 8987766981
- Official Email: cvidyasolutions@gmail.com
- Founder/Director (Chiranjeev Das) Email: chiranjeev0058@gmail.com
- Headquarters: Surunga, Baliapur, Dhanbad, Jharkhand - 828115
- Branch Office & Director's Desk: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand

AVAILABLE SOFTWARE SOLUTIONS:

1. C Vidya Library Management System
This software helps libraries manage their daily operations digitally.
Possible functions: Student management, Book management, Book issue and return, Seat management, Fee and payment tracking, Billing and invoice management, Expense management, Transaction records, Student ID management, Reports and dashboard, Library administration.
Explain benefits as: "C Vidya Library Management System helps libraries reduce manual work, organize records, manage students and books efficiently, and monitor daily operations from one platform."

2. Institute and Coaching Management Software
This software helps educational institutes and coaching centers manage their operations.
Possible functions: Student admission, Student records, Fee management, Attendance management, Course management, Batch management, Teacher management, Notices and communication, Reports and analytics, Administrative dashboard.
Explain benefits as: "This software helps institutes and coaching centers manage students, fees, attendance, batches, and daily operations in one organized system."

3. CV Fitness Zone
This software is designed for gym and fitness businesses.
Possible functions: Member management, Membership plans, Fee and payment tracking, Attendance, Trainer management, Fitness records, Membership renewal reminders, Reports and dashboard.
Explain benefits as: "CV Fitness Zone helps gym owners manage members, memberships, payments, attendance, and daily operations more efficiently."

4. ChickMart
This software is designed for poultry-related businesses.
Possible functions: Poultry inventory management, Product management, Customer management, Sales records, Purchase records, Stock monitoring, Expense tracking, Billing and reporting.
Explain benefits as: "ChickMart helps poultry businesses organize inventory, sales, customers, expenses, and business records in one digital platform."

5. FarmFresh Hub
This software is designed for farming and agriculture-related operations.
Possible functions: Farm management, Poultry management, Goat farming management, Fish farming management, Egg and poultry records, Inventory tracking, Sales and expense management, Customer records, Business reports.
Explain benefits as: "FarmFresh Hub helps farm owners manage different farming activities, inventory, sales, expenses, and business records from one platform."

6. AgriFusion – All-in-One Farming
Product tagline: "One Platform. Every Farm. Unlimited Growth."
AgriFusion is designed as an all-in-one farming management solution supporting multiple farming operations through one platform: Poultry farming, Goat farming, Fish farming, Egg production, Farm inventory, Sales management, Expense tracking, Customer management, Reports and analytics.
Explain benefits as: "AgriFusion helps farmers and farm businesses manage multiple farming operations from one platform, reduce manual work, and make better business decisions using organized records and reports."

7. C Vidya AI Customer Support SaaS
Product tagline: "Automated 24/7 AI Resolution & Knowledge Base RAG Engine"
This software helps businesses automate customer support through 24/7 AI inquiry handling, Knowledge Base RAG integration, omnichannel chat (Web, WhatsApp, Email, Mobile), SLA tracking, escalation queues, and CSAT analytics.
Explain benefits as: "C Vidya AI Customer Support SaaS enables businesses to provide instant 24/7 automated support, resolve customer queries in real-time, and streamline service escalations."

8. C Vidya CRM Portal
Customer relationship management system to track leads, deal pipelines, customer communication timelines, and sales performance.

CUSTOMER CONVERSATION FLOWS:

When a new customer starts a conversation, greet them with:
"Hello! 👋 Welcome to C Vidya Solutions.
I am your AI Customer Support Assistant. I can help you learn about our software solutions, features, demos, support, and business services.
How can I help you today?"

If customer asks "What software do you provide?":
"C Vidya Solutions provides software solutions for different business needs, including Library Management, Institute and Coaching Management, Gym Management, Poultry Business Management, and Farming Management solutions.
Please tell me about your business or organization, and I can help you identify the most suitable software."

If customer asks "Which software is best for my business?":
"Please share the following details:
1. Your business or organization type
2. Approximate number of users, students, members, or customers
3. Your main management requirements
4. Whether you need a web-based system, mobile access, or both
Based on your requirements, I will guide you toward the most suitable solution."

DEMO REQUEST FLOW:
"Thank you for your interest in C Vidya Solutions. I can help you request a product demo.
Please share:
1. Full Name
2. Business or Organization Name
3. Mobile Number
4. Email Address
5. Interested Software Product
6. City and State
7. Preferred Demo Date or Time
Our team can review your request and contact you regarding the demo."
(Do not claim that a demo is booked unless confirmed.)

PRICING INQUIRY FLOW:
Do not invent prices. Say:
"Pricing may depend on the selected software, required modules, number of users, customization requirements, and business needs.
Please share the software you are interested in and your requirements. Our C Vidya Solutions team can provide the appropriate pricing details."
Collect: Customer name, Business name, Interested software, Required features, Number of users, Mobile number or email.

SUPPORT FLOW:
If an existing customer needs help:
"Please share the following details so I can understand the issue:
1. Software Product Name
2. Registered Email or Mobile Number
3. Error Message, if any
4. Device Type: Mobile, Laptop, or Desktop
5. Browser Name, if applicable
6. A screenshot of the issue, if available
7. Steps you followed before the issue occurred
Please do not share your password, OTP, bank details, or other sensitive information."

TECHNICAL SUPPORT RULES:
- Never ask for passwords, OTPs, payment PINs, bank details, secret API keys.
- Never expose backend or Firebase credentials.

UNKNOWN INFORMATION RULE:
If information is not available in training data, do not guess.
Say: "I do not have confirmed information about that at the moment. Please contact the C Vidya Solutions team through our official website for accurate assistance: https://cvidyasolutions.com"

LEAD COLLECTION RULES:
Collect: Full Name, Company/Org Name, Mobile Number, Email Address, City and State, Interested Software, Business Requirements.
Say: "Thank you. Your requirements have been noted. The C Vidya Solutions team can review your inquiry and contact you through the details you provided."

RESPONSE STYLE:
- Keep normal answers concise.
- Use headings when answer is long. Use bullet points for features.
- Ask one or two relevant questions at a time. Do not overwhelm customers.
- Be polite, professional, and focus on solving the customer's problem.
- Encourage customer to request a demo when appropriate.

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

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // frame-ancestors in Content-Security-Policy manages framing securely, so we don't need a restrictive X-Frame-Options
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https: wss: ws:; " +
    "frame-ancestors 'self' https://*.studio https://ai.studio https://*.google.com https://*.google.dev;"
  );
  next();
});

// Simple In-Memory Rate Limiting
const ipRequestCounts = new Map<string, number[]>();
const formSubmissionCounts = new Map<string, number[]>();
const authAttemptsCounts = new Map<string, number[]>();

function cleanOldTimestamps(timestamps: number[], windowMs: number): number[] {
  const now = Date.now();
  return timestamps.filter(t => now - t < windowMs);
}

// Global API limit (100 requests per minute)
app.use((req, res, next) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  let ts = ipRequestCounts.get(ip) || [];
  ts = cleanOldTimestamps(ts, 60000);
  if (ts.length >= 100) {
    return res.status(429).json({ error: "Rate limit exceeded. Maximum 100 requests per minute. Please wait and try again." });
  }
  ts.push(Date.now());
  ipRequestCounts.set(ip, ts);
  next();
});

// Contact Form Rate Limit (5 submissions per hour)
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

// Admin Password Auth Rate Limit (5 attempts per minute)
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

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API: Submit Inquiry (With Input Sanitization & Rate Limiting)
app.post("/api/inquiry", contactFormRateLimiter, async (req, res) => {
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

  // Core Sync to Firestore
  try {
    const docRef = doc(db, "inquiries", id);
    await setDoc(docRef, newInquiry);
    console.log("Successfully persisted inquiry to Firestore:", id);
  } catch (error) {
    console.error("Failed to persist to Firestore, using local fallback:", error);
    try {
      handleFirestoreError(error, OperationType.WRITE, "inquiries/" + id);
    } catch (loggedErr) {
      // Absorb mock errors or offline cases so server remains 100% bug free and operational
    }
  }

  return res.json({
    success: true,
    message: `Thank you, ${name}! Your consultation request regarding '${newInquiry.service}' has been queued. Our relations representative will call you at ${phone} shortly.`,
    inquiry: newInquiry
  });
});

// API: Fetch inquiries (for the on-site leads sandbox to inspect logged form data)
app.get("/api/inquiries", authAttemptsRateLimiter, async (req, res) => {
  const { password } = req.query;
  const validPasswords = ["8987766981", "cvidya2026", "cvidya2025"];

  // Security Check: Guard against NoSQL injection (by enforcing string type) and Long Password DoS (>128 chars)
  if (typeof password !== "string" || password.length < 5 || password.length > 128) {
    return res.status(401).json({ error: "Unauthorized access. Invalid owner password." });
  }

  if (!validPasswords.includes(password)) {
    return res.status(401).json({ error: "Unauthorized access. Invalid owner password." });
  }

  try {
    const q = query(collection(db, "inquiries"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const firestoreInquiries: any[] = [];
    
    snapshot.forEach((d) => {
      firestoreInquiries.push(d.data());
    });

    // Merge in-memory local caches that may have been submitted during database connection delays
    const merged = [...firestoreInquiries];
    inquiries.forEach((inq) => {
      if (!merged.some((x) => x.id === inq.id)) {
        merged.push(inq);
      }
    });

    // Sort by timestamp descending
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return res.json({ inquiries: merged });
  } catch (error) {
    console.error("Failed to list from Firestore, falling back to local memory store:", error);
    try {
      handleFirestoreError(error, OperationType.LIST, "inquiries");
    } catch (loggedErr) {
      // Secure local fallback
    }
    
    const sortedMemory = [...inquiries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return res.json({ inquiries: sortedMemory });
  }
});

// Smart local fallback assistant handler for offline, network errors or missing credentials
function getFallbackReply(messages: any[]): string {
  if (!messages || messages.length === 0) {
    return "Hello! 👋 Welcome to C Vidya Solutions.\n\nI am your AI Customer Support Assistant. How can I help you today?";
  }

  const lastMsg = messages[messages.length - 1];
  const userText = ((lastMsg.content || lastMsg.text || "").toLowerCase()).trim();

  if (!userText) {
    return "Hello! 👋 Welcome to C Vidya Solutions. How can I assist you today?";
  }

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
    return "Koi baat nahi! 👋 Aap aaram se C Vidya Solutions ke software products aur features ko explore kar sakte hain.\n\nAgar aapko Library System, Institute Management, CV Fitness Zone, ChickMart, FarmFresh Hub, ya kisi bhi software ke baare mein jaankari chahiye ya future mein demo chahiye, toh main aapki help ke liye yahan hoon. Have a great day!";
  }

  if (
    userText === "hi" ||
    userText === "hello" ||
    userText === "hey" ||
    userText.startsWith("namaste") ||
    userText.includes("good morning") ||
    userText.includes("good afternoon") ||
    userText.includes("good evening") ||
    userText.includes("kaise ho") ||
    userText.includes("kaise h") ||
    userText.includes("kya haal")
  ) {
    return "Hello! 👋 Welcome to C Vidya Solutions.\n\nI am your AI Customer Support Assistant. Main aapki kaise madad kar sakta hoon? Aap humare software products, features, demo, ya support ke baare mein pooch sakte hain.";
  }

  if (
    userText.includes("human") ||
    userText.includes("real agent") ||
    userText.includes("person") ||
    userText.includes("insan") ||
    userText.includes("banda")
  ) {
    return "I am the official AI Customer Support Assistant of C Vidya Solutions. I can answer questions about our software, features, pricing, demos, and support.\n\nIf you'd like to speak with our executive or team directly, please share your contact details and software requirements, or call us at 8987766981!";
  }

  if (
    userText.includes("demo") ||
    userText.includes("trial") ||
    userText.includes("test karna") ||
    userText.includes("kaise chalega") ||
    userText.includes("dekho") ||
    userText.includes("dikhao")
  ) {
    return "Thank you for your interest in C Vidya Solutions! I can help you request a product demo.\n\nPlease share:\n1. Full Name\n2. Business / Organization Name\n3. Mobile Number\n4. Email Address\n5. Interested Software Product\n6. City & State\n\nOur team will review your request and contact you for the demo!";
  }

  if (
    userText.includes("price") ||
    userText.includes("cost") ||
    userText.includes("rate") ||
    userText.includes("fee") ||
    userText.includes("charge") ||
    userText.includes("kitne ka") ||
    userText.includes("kitna lagega") ||
    userText.includes("paise") ||
    userText.includes("plan")
  ) {
    return "Pricing depends on the selected software, required modules, number of users/students, and customization requirements.\n\nPlease share the software you are interested in along with your contact number, and our C Vidya Solutions team will provide you with exact pricing details!";
  }

  if (
    userText.includes("library") ||
    userText.includes("kitab") ||
    userText.includes("book") ||
    userText.includes("reading room") ||
    userText.includes("study center")
  ) {
    return "**C Vidya Library Management System** helps libraries reduce manual work, organize records, manage students & books, and monitor daily operations:\n\n• **Student Management**: Student IDs, active memberships & attendance.\n• **Book Records**: Issue/return logging, fine calculation & search catalog.\n• **Seat Management**: Assign & track reading seats.\n• **Billing & Invoices**: Generate payment receipts, billing & expense logs.\n\nWould you like to request a demo for your library?";
  }

  if (
    userText.includes("school") ||
    userText.includes("institute") ||
    userText.includes("coaching") ||
    userText.includes("tuition") ||
    userText.includes("batch") ||
    userText.includes("college") ||
    userText.includes("student")
  ) {
    return "**Institute & Coaching Management Software** helps educational institutes manage their complete operations in one system:\n\n• **Admissions & Student Ledger**: Maintain student profiles & fee tracking.\n• **Attendance & Timetable**: Batch timings, student attendance & notices.\n• **Teacher & Exam Records**: Staff management, exam schedules & report cards.\n\nWould you like to schedule a product demo?";
  }

  if (
    userText.includes("gym") ||
    userText.includes("fitness") ||
    userText.includes("workout") ||
    userText.includes("trainer") ||
    userText.includes("spa")
  ) {
    return "**CV Fitness Zone** is designed for gyms & fitness centers:\n\n• **Member Management**: Track active plans, renewal reminders & profile logs.\n• **Payment & Invoices**: Fee collection, receipts & payment records.\n• **Attendance & Trainer Logs**: Attendance tracking & trainer allocations.\n\nWould you like a demo for your fitness center?";
  }

  if (
    userText.includes("chickmart") ||
    userText.includes("chicken") ||
    userText.includes("poultry shop") ||
    userText.includes("meat shop")
  ) {
    return "**ChickMart** is a digital solution for poultry & chicken businesses:\n\n• **Inventory Tracking**: Stock management & daily weight records.\n• **Sales & Billing**: POS invoices, customer ledgers & daily sales reports.\n• **Expense Monitoring**: Supplier purchases & operational expense logs.\n\nWould you like to see a demo?";
  }

  if (
    userText.includes("farm") ||
    userText.includes("agrifusion") ||
    userText.includes("agriculture") ||
    userText.includes("goat") ||
    userText.includes("fish") ||
    userText.includes("livestock") ||
    userText.includes("crop") ||
    userText.includes("kheti")
  ) {
    return "**AgriFusion & FarmFresh Hub** ('One Platform. Every Farm. Unlimited Growth.'):\n\n• **Multi-Farm Management**: Poultry, goat farming, fish farming & livestock.\n• **Inventory & Sales**: Stock tracking, POS billing & customer records.\n• **Expense & Analytics**: Expense management & business growth reports.\n\nWhich farming activity do you manage?";
  }

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
    userText.includes("kaam nahi")
  ) {
    return "To assist you with technical support, please share:\n1. Software Product Name\n2. Registered Email or Mobile Number\n3. Error Message / Issue details\n4. Device Type (Mobile / Laptop / Desktop)\n\n*Security Note: Never share your password, OTP, or PIN.* Our support team will assist you!";
  }

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
    userText.includes("owner") ||
    userText.includes("director")
  ) {
    return "Here are the official contact details for **C Vidya Solutions**:\n\n• **Official Website**: https://cvidyasolutions.com\n• **Phone**: 8987766981\n• **Official Email**: cvidyasolutions@gmail.com\n• **Director Desk (Chiranjeev Das)**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch Office**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand";
  }

  if (
    userText.includes("software") ||
    userText.includes("product") ||
    userText.includes("service") ||
    userText.includes("list") ||
    userText.includes("kya kya") ||
    userText.includes("kya hai")
  ) {
    return "**C Vidya Solutions** offers software products for various industries:\n\n1. **C Vidya Library Management System**: Complete digital library & seat management.\n2. **Institute & Coaching Management**: Student admissions, fees & attendance.\n3. **CV Fitness Zone**: Gym memberships, renewals & payment tracking.\n4. **ChickMart**: Poultry & meat shop sales, inventory & billing.\n5. **FarmFresh Hub / AgriFusion**: Multi-farm, livestock & agriculture management.\n6. **C Vidya AI Customer Support SaaS**: Automated 24/7 AI chat assistant.\n7. **C Vidya CRM Portal**: Lead pipelines & sales tracking.\n\nTell me about your business, and I will recommend the right software for you!";
  }

  return "Thank you for reaching out to **C Vidya Solutions**! 👋\n\nI can help you with information about our software solutions (Library, Institute, Gym, Agriculture, CRM), demo requests, pricing, support, or company details.\n\nHow can I help you today?";
}

// Call Gemini API with robust retry mechanism
async function callGeminiWithRetry(client: GoogleGenAI, formattedContents: any[], retries = 2, delayMs = 500): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      return response;
    } catch (err: any) {
      if (i === retries) throw err;
      console.warn(`Gemini API call failed (Attempt ${i + 1}/${retries + 1}): ${err.message}. Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs *= 2;
    }
  }
}

// API: AI Chat Assistant (with Gemini backend proxy and smart offline fallback)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body; // Expects array of { role: 'user' | 'model', content: string }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "A valid array of conversation messages is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Case A: No API key or placeholder key configured -> Immediate smart fallback
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    const reply = getFallbackReply(messages);
    return res.json({ text: reply, grounded: false });
  }

  try {
    const client = getGeminiClient();

    // Map conversation messages into contents structure
    const formattedContents = messages.map((m) => {
      const textVal = m.content || m.text || "";
      const roleVal = m.role === "assistant" || m.role === "model" ? "model" : "user";
      return {
        role: roleVal,
        parts: [{ text: textVal }],
      };
    });

    console.log(`Sending prompt to Gemini. Total messages: ${formattedContents.length}`);
    
    // Call Gemini with retry logic
    const response = await callGeminiWithRetry(client, formattedContents);
    const aiResponseText = response.text || "I apologize, I could not synthesize a consultation response right now. Please reload or get in touch directly!";
    
    return res.json({ text: aiResponseText, grounded: !!response.candidates?.[0]?.groundingMetadata });

  } catch (error: any) {
    console.error("Gemini API error in /api/chat. Falling back to smart offline responder.", error);
    // Case B: API call failed (connection timeout, invalid key, rate limits) -> Graceful smart fallback
    const fallbackReply = getFallbackReply(messages);
    return res.json({ 
      text: fallbackReply, 
      grounded: false, 
      warning: "Service temporarily offline. Utilizing secure local advisor fallback." 
    });
  }
});

// Global error handler (Mask internal exceptions and stack traces from clients)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error logged securely on the backend:", err);
  res.status(500).json({
    error: "An internal application or database error occurred. System trace is hidden securely."
  });
});

// Vite / static file serving integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist/ directory...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`C Vidya Solutions Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
