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

// System instructions for C Vidya Solutions Consultant
const SYSTEM_INSTRUCTION = `You are "Vidya AI", the expert product advisor and smart assistant for "C Vidya Solution", a premium technology company established in 2025.
Your goal is to consult visitors, explain the digital product suite, help they choose the appropriate system, and gather client interest.

Here are the key details about C Vidya Solution:
- Tagline: "Innovating Software for a Simpler Future"
- Headquarters: Surunga, Baliapur, Dhanbad, Jharkhand - 828115
- Branch Office & Officer Desk: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand
- Phone: 8987766981
- Office Email: cvidya32@gmail.com
- Officer Direct Email: chiranjeev0058@gmail.com
- Mission: To build intelligent software that makes every type of work simple, fast, and efficient.
- Philosophy: Technology that empowers people, saves time, and creates better opportunities for businesses of all sizes.

We offer the C VIDYA INTEGRATED PRODUCT SUITE (8 core software products):
1. C VIDYA LIBRARY: Complete library management system to manage books, members, issue/return, cataloging, search, and detailed analytical library reports.
2. C VIDYA FITNESS ZONE: Gym, spa and fitness management software to handle members, subscription plans, digital attendance, diet charts, trainers, and seamless daily activity logs.
3. C VIDYA INSTITUTES MANAGEMENT: All-in-one comprehensive school and college/institute portal to manage students, fee collection, attendance metrics, exams schedules, grades, and report cards.
4. C VIDYA COACHING MANAGEMENT: Specially tailored for coaching centers, tuition batches, managing students, schedules, and mock test performance reports.
5. C VIDYA CRM: Customer Relationship Management system to manage sales funnels, high-quality leads, accounts, client outreach, and interaction analytics.
6. C VIDYA MUNICIPAL MANAGEMENT SYSTEM: Smart solutions for municipal corporations, local bodies, record-keeping, citizen grievance registration, waste management, and public taxes.
7. C VIDYA FARMING MANAGEMENT: Modern agriculture-tech farm manager to track crop health, soil data, farming equipment schedules, and expenditure logs to increase crop yields.
8. C VIDYA MEMBERS MANAGEMENT: Elite club management software for societies, gated communities, NGOs, and sports clubs to manage subscriptions, user profiles, and event organization.

Style Guidelines:
- Adopt a professional, polite, warm, and brief Indian corporate advisory tone.
- When an interested user mentions their sector, match them automatically with the corresponding product from our suite of 8.
- If they want to get in touch, suggest submitting a callback request on our live "Contact Us" form below, or provide them C Vidya's official emails.
- Be concise and friendly. Refrain from over-explanation. Let them ask details. Keep responses strictly in elegant human language, formatted in clear markdown.`;

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API: Submit Inquiry
app.post("/api/inquiry", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone are required parameters." });
  }

  const id = `inq_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  const status = "Pending Callback";

  const newInquiry = {
    id,
    name,
    email,
    phone,
    service: service || "General Inquiry",
    message: message || "No custom message provided.",
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
app.get("/api/inquiries", async (req, res) => {
  const { password } = req.query;
  const validPasswords = ["8987766981", "cvidya2026", "cvidya2025"];

  if (!password || !validPasswords.includes(password as string)) {
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

// API: AI Chat Assistant (with Gemini backend proxy)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body; // Expects array of { role: 'user' | 'model', content: string }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "A valid array of conversation messages is required." });
  }

  // Format messages into Gemini API input
  // Gemni SDK expects contents parameter. Let's build content objects for Gemini
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Return a smart fallback mock response when API key isn't provided
      const userMsg = messages[messages.length - 1];
      const userText = (userMsg.content || userMsg.text || "").toLowerCase();
      
      let reply = "Hello! Welcome to C Vidya Solution. How can we help simplify your business operations today?";
      if (userText.includes("library") || userText.includes("book")) {
        reply = "Our **C Vidya Library** management suite is a perfect fit. It automates cataloging, student card check-ins, fine logging, and digital issuance with extreme ease. Would you like to schedule a quick visual demo?";
      } else if (userText.includes("gym") || userText.includes("fitness") || userText.includes("spa")) {
        reply = "The **C Vidya Fitness Zone** software manages memberships, trainer allocation, diet plans, and door-access authentication. You can fill out the contact form below and check our dashboard simulators!";
      } else if (userText.includes("school") || userText.includes("exam") || userText.includes("institute")) {
        reply = "Our **C Vidya Institutes Management** package runs your admissions, automated report cards, fee ledger tracking, and student attendance seamlessly. Would you like a live customized consultation?";
      } else if (userText.includes("coach") || userText.includes("tuition") || userText.includes("batch")) {
        reply = "Our **C Vidya Coaching Management** suite tracks student timetables, fees, scores on offline mock exams, and sends parents continuous progress SMS alerts.";
      } else if (userText.includes("crm") || userText.includes("lead") || userText.includes("sale")) {
        reply = "With **C Vidya CRM**, you get top-tier sales lead tracking, deal pipelines, customer interactions timeline, and sales performance charts. Fill out our callback request form to receive customized pricing details!";
      } else if (userText.includes("municipal") || userText.includes("local") || userText.includes("government")) {
        reply = "The **C Vidya Municipal Management System** streamlines citizen services, records birth/death registers, schedules public works, and aggregates land tax records.";
      } else if (userText.includes("farm") || userText.includes("agriculture") || userText.includes("crop")) {
        reply = "The **C Vidya Farming Management** platform uses sensors, schedules crop rotations, monitors fertilizer expenses, and manages automated harvest storage catalogs.";
      } else if (userText.includes("club") || userText.includes("society") || userText.includes("member")) {
        reply = "Our **C Vidya Members Management** portal tracks recurring club subscriptions, logs custom gate access permissions, and publishes secure community notices.";
      } else if (userText.includes("phone") || userText.includes("contact") || userText.includes("number") || userText.includes("call") || userText.includes("location") || userText.includes("branch") || userText.includes("office") || userText.includes("address") || userText.includes("sindri") || userText.includes("surunga")) {
        reply = "You can securely call our executives directly at **8987766981** or write us at our office desk: **cvidya32@gmail.com** or officer direct: **chiranjeev0058@gmail.com**.\n\nWe have two physical office locations:\n1. **Headquarters:** Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n2. **Branch Office & Officer Desk:** STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand.";
      }
      return res.json({ text: reply, grounded: false });
    }

    const client = getGeminiClient();

    // Map conversation messages into contents structure
    // Each element should be: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedContents = messages.map((m) => {
      const textVal = m.content || m.text || "";
      const roleVal = m.role === "assistant" || m.role === "model" ? "model" : "user";
      return {
        role: roleVal,
        parts: [{ text: textVal }],
      };
    });

    console.log(`Sending prompt to Gemini. Total messages: ${formattedContents.length}`);
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const aiResponseText = response.text || "I apologize, I could not synthesize a consultation response right now. Please reload or get in touch directly!";
    return res.json({ text: aiResponseText, grounded: !!response.candidates?.[0]?.groundingMetadata });

  } catch (error: any) {
    console.error("Gemini API error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "An error occurred with our intelligent services." });
  }
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
    console.log(`C Vidya Solution Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
