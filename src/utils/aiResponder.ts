// Comprehensive Verified Knowledge Base & Trilingual (English, Hindi & Hinglish) Central AI Business Assistant for C Vidya Solutions
// Grounded strictly in verified company, software, AI service, and operational data from www.cvidyasolutions.com

export function isHindiDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

export function isHinglishQuery(text: string): boolean {
  if (isHindiDevanagari(text)) return true;
  const t = text.toLowerCase();
  const hinglishTokens = [
    "kya", "kaise", "chahiye", "chahiy", "chahie", "hai", "hain", "kare", "karna", "karo", "batao",
    "bataiye", "batao na", "batao please", "kitna", "kitne", "milega", "hoga", "dekh", "nahi",
    "nahin", "nhi", "ha", "haan", "achha", "achcha", "accha", "theek", "bhai", "sir", "namaste",
    "namaskar", "pranam", "kripya", "shukriya", "dhanyawad", "madad", "bataye", "batayen", "paise",
    "rupya", "rupaye", "kharidna", "lagwana", "lagana", "kaam", "chalega", "chalta", "bolo", "kaun",
    "kaha", "kahan", "konsa", "kaunsa", "kaisa", "mera", "meri", "apka", "aapka", "humara", "hamara",
    "kab", "kyu", "kyun", "kisko", "kis", "kaise kare", "kuch", "kuchh", "chij", "cheez", "sabse",
    "badhiya", "sasta", "hume", "humko", "mujhe", "mujhko", "bhi", "toh", "to", "bata", "dikha",
    "dikhao", "kaun hai", "kaha hai", "pata", "purana", "shuru", "kab hua", "kaise hoga", "shikayat",
    "abhi", "ek bar", "yaar", "dost"
  ];
  return hinglishTokens.some(w => new RegExp(`(^|\\s)${w}(\\s|\\?|!|\\.|,|$)`, "i").test(t));
}

export function detectLanguageMode(text: string): "hi" | "hinglish" | "en" {
  if (isHindiDevanagari(text)) return "hi";
  if (isHinglishQuery(text)) return "hinglish";
  return "en";
}

export interface AssistantReplyOptions {
  gender?: "female" | "male";
  preferredLanguage?: "en" | "hi" | "hinglish";
}

export function adaptGenderGrammar(text: string, gender: "female" | "male" = "female"): string {
  if (gender !== "female") return text;
  return text
    .replace(/\bkar sakta hoon\b/gi, "kar sakti hoon")
    .replace(/\bkar sakta hu\b/gi, "kar sakti hu")
    .replace(/\bbata sakta hoon\b/gi, "bata sakti hoon")
    .replace(/\bdikha sakta hoon\b/gi, "dikha sakti hoon")
    .replace(/\bde sakta hoon\b/gi, "de sakti hoon")
    .replace(/\bshare karta hoon\b/gi, "share karti hoon")
    .replace(/\bkarta hoon\b/gi, "karti hoon")
    .replace(/\braha hoon\b/gi, "rahi hoon")
    .replace(/\bkarunga\b/gi, "karungi")
    .replace(/\bbataunga\b/gi, "bataungi")
    .replace(/\bdunga\b/gi, "dungi")
    .replace(/\bmain hoon aapka\b/gi, "main hoon aapki")
    .replace(/सकता हूँ/g, "सकती हूँ")
    .replace(/करता हूँ/g, "करती हूँ")
    .replace(/बताता हूँ/g, "बताती हूँ")
    .replace(/रहा हूँ/g, "रही हूँ")
    .replace(/करूँगा/g, "करूँगी")
    .replace(/बताऊँगा/g, "बताऊँगी");
}

export interface ExtractedChatLead {
  hasContactOrIntent: boolean;
  name: string;
  company: string;
  phone: string;
  email: string;
  cityCountry: string;
  businessType: string;
  productOfInterest: string;
  requirements: string;
  followUpTask?: string;
}

export function extractStructuredLeadFromChat(
  messagesOrText: { role: string; content?: string; text?: string }[] | string
): ExtractedChatLead {
  const userTexts =
    typeof messagesOrText === "string"
      ? [messagesOrText.trim()].filter(Boolean)
      : messagesOrText
          .filter((m) => m.role === "user")
          .map((m) => (m.content || m.text || "").trim())
          .filter(Boolean);
  const combined = userTexts.join(" | ");
  const lower = combined.toLowerCase();

  const phoneMatch = combined.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/);
  const emailMatch = combined.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  let productOfInterest = "General Software / AI Inquiry";
  if (lower.includes("library") || lower.includes("book") || lower.includes("लाइब्रेरी")) productOfInterest = "C Vidya Library Management";
  else if (lower.includes("gym") || lower.includes("fitness") || lower.includes("जिम")) productOfInterest = "C Vidya Fitness Zone";
  else if (lower.includes("institute") || lower.includes("school") || lower.includes("college") || lower.includes("स्कूल")) productOfInterest = "C Vidya Institutes Management";
  else if (lower.includes("coaching") || lower.includes("omr") || lower.includes("कोचिंग")) productOfInterest = "C Vidya Coaching Management";
  else if (lower.includes("agri") || lower.includes("farm") || lower.includes("poultry") || lower.includes("फार्म")) productOfInterest = "AgriFusion / FarmFresh Hub";
  else if (lower.includes("jewel") || lower.includes("gold") || lower.includes("ज्वेलरी")) productOfInterest = "C Vidya Jewelers Management";
  else if (lower.includes("crm") || lower.includes("pipeline")) productOfInterest = "C Vidya Enterprises CRM";
  else if (lower.includes("petrol") || lower.includes("fuel") || lower.includes("पेट्रोल")) productOfInterest = "C Vidya Petrol Pump Cloud Suite";
  else if (lower.includes("hospital") || lower.includes("clinic") || lower.includes("care plus") || lower.includes("अस्पताल")) productOfInterest = "Care Plus Healthcare System";
  else if (lower.includes("pdf") || lower.includes("media")) productOfInterest = "C Vidya PDF & Media Tools SaaS";
  else if (lower.includes("ai agent") || lower.includes("salesflow") || lower.includes("social media agent")) productOfInterest = "C Vidya Autonomous AI Agents";

  let businessType = "Commercial / Institutional";
  if (lower.includes("library") || lower.includes("study")) businessType = "Library / Reading Room";
  else if (lower.includes("gym") || lower.includes("fitness")) businessType = "Gym / Fitness Center";
  else if (lower.includes("school") || lower.includes("college") || lower.includes("coaching")) businessType = "Educational Institute / Academy";
  else if (lower.includes("petrol") || lower.includes("fuel")) businessType = "Fuel Retail Station";
  else if (lower.includes("hospital") || lower.includes("clinic")) businessType = "Healthcare / Clinic";
  else if (lower.includes("farm") || lower.includes("poultry")) businessType = "Agribusiness / Poultry";
  else if (lower.includes("jewel")) businessType = "Jewelry Showroom";

  const nameMatch = combined.match(/(?:my name is|i am|name\s*[:=-]|mera naam)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+){0,2})/i);
  const companyMatch = combined.match(/(?:from|company|organization|institute|business|gym|school|library)\s*(?:name|is|:|-)?\s*([A-Z][a-zA-Z0-9\s&.,-]{2,40}?)(?:\s+in\s+|\.|,|;|$)/);
  const cityMatch = combined.match(/\b(?:located in|city|in)\s+([A-Z][a-zA-Z]{2,20})\b/);

  const isTaskIntent =
    lower.includes("follow-up") ||
    lower.includes("follow up") ||
    lower.includes("callback") ||
    lower.includes("call back") ||
    lower.includes("demo") ||
    lower.includes("schedule");

  const latestMsg = userTexts[userTexts.length - 1] || "";

  return {
    hasContactOrIntent: Boolean(phoneMatch || emailMatch),
    name: nameMatch?.[1]?.trim() || "Website Visitor",
    company: companyMatch?.[1]?.trim() || "Not Specified",
    phone: phoneMatch?.[0]?.trim() || "Not Provided",
    email: emailMatch?.[0]?.trim() || "Not Provided",
    cityCountry: cityMatch?.[1]?.trim() || "India",
    businessType,
    productOfInterest,
    requirements: latestMsg.slice(0, 500),
    followUpTask: isTaskIntent ? `Schedule demo / follow-up for ${productOfInterest}` : undefined,
  };
}

export function normalizeVoiceAndChatQuery(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\bsee\s+with\s+the\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bsee\s+with\s+a\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bsee\s+with\s+the\b/gi, "C Vidya")
    .replace(/\b(?:see|sea|si|sri|shri)\s+vid(?:ya|hya)\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\b(?:see|sea|si|sri|shri)\s+vid(?:ya|hya)\b/gi, "C Vidya")
    .replace(/\bc\s*vid(?:ya|hya)\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bc\s*vid(?:ya|hya)\b/gi, "C Vidya")
    .replace(/सी\s*विध्या/g, "सी विद्या");
}

export function getSmartAssistantResponse(
  messages: { role: string; content?: string; text?: string }[],
  options?: AssistantReplyOptions
): string {
  const gender = options?.gender || "female";
  const reply = getSmartAssistantResponseCore(messages, options);
  return adaptGenderGrammar(reply, gender);
}

function getSmartAssistantResponseCore(
  messages: { role: string; content?: string; text?: string }[],
  options?: AssistantReplyOptions
): string {
  if (!messages || messages.length === 0) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**.\n\nI am your **C-Vidya Central AI Business Assistant**. I can assist you with all our **7 SaaS Products**, **4 Autonomous AI Agents**, **Specialized Services**, **Lead Qualification**, **CRM Workflows**, and **HR Screening**. You can chat or speak with me in **English**, **Hindi (हिंदी)**, or **Hinglish**! How may I help you today?";
  }

  const lastMsg = messages[messages.length - 1];
  const rawUserText = normalizeVoiceAndChatQuery((lastMsg.content || lastMsg.text || "").trim());
  const userText = rawUserText.toLowerCase();

  if (!userText) {
    return "Hello! 👋 Welcome to **C Vidya Solutions**. How can I assist you today? Aap English, Hindi (हिंदी), ya Hinglish me pooch sakte hain!";
  }

  const detectedLang = detectLanguageMode(rawUserText);
  // When the user explicitly selects 'hi' or 'en' in the chatbot UI, strictly honor 'hi' or 'en' (never Hinglish)
  const langMode: "hi" | "hinglish" | "en" =
    options?.preferredLanguage === "hi"
      ? "hi"
      : options?.preferredLanguage === "en"
      ? detectedLang === "hi"
        ? "hi"
        : "en"
      : options?.preferredLanguage === "hinglish"
      ? "hinglish"
      : detectedLang;
  const hinglish = langMode === "hinglish" || langMode === "hi";

  // 0. Contact details provided (Phone Number or Email) -> Confirm & Route to contact@cvidyasolutions.com
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/.test(userText);
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(userText);
  if (hasPhone || hasEmail) {
    if (langMode === "hi") {
      return "बहुत-बहुत धन्यवाद! 🙏 आपकी संपर्क जानकारी सफलतापूर्वक दर्ज कर ली गई है और हमारे आधिकारिक ईमेल (**contact@cvidyasolutions.com**) तथा संस्थापक/निदेशक डेस्क (**चिरंजीव दास**) को भेज दी गई है।\n\n📞 **सीधा हेल्पलाइन नंबर**: +91 92885 17027 / 8987766981\n📧 **आधिकारिक ईमेल**: contact@cvidyasolutions.com\n\nहमारी टीम जल्द ही कॉल या WhatsApp के माध्यम से आपसे संपर्क करेगी और आपके लिए लाइव डेमो की व्यवस्था करेगी।";
    }
    if (hinglish) {
      return "Bahut bahut dhanyawad! 🙏 Aapki contact details successfully capture kar li gayi hain aur hamari official email desk (**contact@cvidyasolutions.com**) tatha Founder/Director desk (**Chiranjeev Das**) ko forward kar di gayi hain.\n\n📞 **Helpline Direct**: +91 92885 17027 / 8987766981\n📧 **Connected Email**: contact@cvidyasolutions.com\n\nHamari technical relations team aapse jald hi call ya WhatsApp par connect karegi aur aapke required software ka personalized live demo arrange karegi. Kya aapko kisi specific feature ke baare me pehle se jaanna hai?";
    }
    return "Thank you very much! 🙏 Your contact details have been successfully captured and dispatched directly to our official inbox at **contact@cvidyasolutions.com** and the Director's desk (**Chiranjeev Das**).\n\n📞 **Direct Helpline**: +91 92885 17027 / 8987766981\n📧 **Connected Email**: contact@cvidyasolutions.com\n\nOur client relations team will reach out to you shortly via phone/WhatsApp to schedule your personalized live demo walkthrough. Would you like to know more about any specific software module in the meantime?";
  }

  // 0.05 Easy Explanation / What is C Vidya Solutions / Website Overview
  // Handles queries like:
  // - "www.cvidyasolutions.com ko dekho aur mujhe easy way batao."
  // - "What is the C Vidya solutions?" / "What is C Vidya Solutions?" / "What is the see with the solution?"
  // - "C Vidya Solutions kya hai?" / "सी विद्या सॉल्यूशंस क्या है?"
  const isAskingAboutCompanyOrEasyWay =
    userText.includes("easy way") ||
    userText.includes("aasan bhasha") ||
    userText.includes("saral bhasha") ||
    userText.includes("आसान भाषा") ||
    userText.includes("सरल भाषा") ||
    userText.includes("cvidyasolutions.com") ||
    userText.includes("what is c vidya") ||
    userText.includes("what is the c vidya") ||
    userText.includes("about c vidya") ||
    userText.includes("tell me about c vidya") ||
    userText.includes("explain c vidya") ||
    userText.includes("c vidya solutions kya hai") ||
    userText.includes("c vidya kya hai") ||
    userText.includes("c vidya kya karta hai") ||
    userText.includes("सी विद्या सॉल्यूशंस क्या है") ||
    userText.includes("सी विद्या क्या है") ||
    (userText.includes("c vidya") &&
      !userText.includes("library") &&
      !userText.includes("gym") &&
      !userText.includes("fitness") &&
      !userText.includes("institute") &&
      !userText.includes("coaching") &&
      !userText.includes("agri") &&
      !userText.includes("farm") &&
      !userText.includes("jewel") &&
      !userText.includes("crm") &&
      !userText.includes("petrol") &&
      !userText.includes("care plus") &&
      !userText.includes("pdf") &&
      !userText.includes("social media") &&
      !userText.includes("salesflow") &&
      !userText.includes("price") &&
      !userText.includes("cost") &&
      (userText.includes("what") ||
        userText.includes("kya") ||
        userText.includes("batao") ||
        userText.includes("bataiye") ||
        userText.includes("explain") ||
        userText.includes("overview") ||
        userText.includes("क्या") ||
        userText.includes("बताएं") ||
        userText.includes("बताओ")));

  if (isAskingAboutCompanyOrEasyWay) {
    if (langMode === "hi") {
      return "**C Vidya Solutions (www.cvidyasolutions.com) — आसान और सरल शब्दों में पूरी जानकारी** 🚀:\n\n**C Vidya Solutions** एक आधुनिक सॉफ्टवेयर और आर्टिफिशियल इंटेलिजेंस (AI) कंपनी है (संस्थापक व निदेशक: **चिरंजीव दास**, STPI सिंदरी, धनबाद द्वारा प्रमाणित)। हमारा काम किसी भी व्यवसाय, स्कूल, कोचिंग, लाइब्रेरी, जिम, अस्पताल या पेट्रोल पंप के रोज़मर्रा के काम को **100% डिजिटल और ऑटोमैटिक** बनाना है।\n\nआसान भाषा में हमारे **3 मुख्य हिस्से** हैं:\n\n1. 📦 **7 रेडीमेड बिजनेस सॉफ्टवेयर (SaaS Products)**:\n   • **Library Management**: लाइब्रेरी सीट आवंटन, बारकोड बुक इश्यू/रिटर्न और फीस अलर्ट।\n   • **CV Fitness Zone (Gym)**: बायोमेट्रिक फिंगरप्रिंट गेट (फीस खत्म होने पर गेट ऑटो-लॉक) और डाइट चार्ट।\n   • **Institutes Management**: स्कूल/कॉलेज की फीस, एडमिशन, रिजल्ट और बस GPS ट्रैकिंग।\n   • **Coaching Management**: बैच शेड्यूल, पेरेंट्स को SMS और OMR शीट कैमरा स्कैनर।\n   • **AgriFusion (FarmFresh Hub)**: पोल्ट्री, मछली पालन और कृषि हिसाब-किताब सॉफ्टवेयर।\n   • **Jewelers Management**: लाइव 24K/22K सोने-चांदी के रेट, कारीगर कास्टिंग और GST बिलिंग।\n   • **Enterprises CRM**: सेल्स टीम के लिए लीड्स, फॉलो-अप और कोटेशन PDF सॉफ्टवेयर।\n\n2. 🤖 **4 ऑटोनॉमस AI एजेंट्स (24/7 स्मार्ट ऑटोमेशन)**:\n   • **AI Customer Support Agent**: 24/7 ग्राहकों के सवालों का तुरंत जवाब देता है।\n   • **SalesFlow AI Agent**: नए B2B क्लाइंट्स ढूंढता है और मीटिंग बुक करता है।\n   • **Social Media Agent**: LinkedIn, Instagram, Facebook और X पर ऑटोमैटिक पोस्ट करता है।\n   • **B2B Marketing Agent**: वेबसाइट को Google पर रैंक कराने के लिए SEO आर्टिकल्स लिखता है।\n\n3. ⚡ **3 विशेष इंडस्ट्री प्लेटफॉर्म**:\n   • **Petrol Pump Cloud ERP**: नोजल मीटर रीडिंग, अंडरग्राउंड टैंक डिप ऑडिट और उधारी (Credit Khata) बिलिंग।\n   • **Care Plus Healthcare System**: अस्पताल OPD/IPD, डॉक्टर प्रिस्क्रिप्शन, मेडिकल स्टोर और लैब रिपोर्ट।\n   • **PDF & Media Tools SaaS**: Word से PDF कन्वर्ट, मर्ज, कंप्रेस और पासवर्ड प्रोटेक्शन।\n\n📞 **संपर्क / WhatsApp**: +91 92885 17027 / 8987766981\n🌐 **वेबसाइट**: `https://cvidyasolutions.com`\n\nबताइए, आप अपने किस व्यवसाय के लिए सॉफ्टवेयर या डेमो देखना चाहते हैं?";
    }
    if (hinglish) {
      return "**C Vidya Solutions (www.cvidyasolutions.com) — Easy Way (Aasan Bhasha) Me Poori Jaankari** 🚀:\n\n**C Vidya Solutions** ek modern Cloud Software aur AI Automation company hai (Founder & Director: **Chiranjeev Das**, STPI Sindri, BIT Sindri Campus, Dhanbad me incubated). Hamara main kaam businesses, schools, libraries, gyms, hospitals aur petrol pumps ke daily paper-work aur hisab-kitab ko **100% digital, fast aur automatic** banana hai.\n\nEasy way me samjhein toh **www.cvidyasolutions.com** par aapko **3 main cheezein** milti hain:\n\n1. 📦 **7 Ready-to-Use Business Software (SaaS Suites)**:\n   • **Library Management**: Study hall seat booking, book barcode scan, aur WhatsApp fee/fine reminder.\n   • **CV Fitness Zone (Gym)**: Biometric gate control (membership khatam hote hi gate auto-lock) + diet/workout plan.\n   • **Institutes Management**: School/College admission, fee receipt, marksheet aur live GPS bus tracking.\n   • **Coaching Management**: Batch management, absent SMS aur camera se OMR test sheet checking.\n   • **AgriFusion (FarmFresh Hub)**: Poultry, fish farming, goat farming aur POS billing.\n   • **Jewelers Management**: Live 24K/22K gold rate sync, karigar ledger aur GST barcode billing.\n   • **Enterprises CRM**: Sales pipeline, client follow-ups aur instant quotation PDF builder.\n\n2. 🤖 **4 Autonomous AI Agents (24/7 Smart Digital Employees)**:\n   • **AI Customer Support Agent**: Website aur WhatsApp par 24/7 customers ke sawalon ka 0.8 second me jawab deta hai.\n   • **SalesFlow AI Agent**: B2B clients ki email dhundh kar automatic outreach aur demo meeting book karta hai.\n   • **Social Media Agent**: LinkedIn, Instagram, Facebook aur X par trending posts auto-publish karta hai.\n   • **B2B SaaS Marketing Agent**: SEO blogs aur articles likh kar Google ranking aur leads badhata hai.\n\n3. ⚡ **3 Specialized Industry Platforms**:\n   • **Petrol Pump Cloud Software**: Shift nozzle meter, tank dip leak audit aur truck/fleet Credit Khata.\n   • **Care Plus Healthcare System**: Hospital OPD/IPD token, digital doctor prescription, pharmacy aur pathology lab.\n   • **PDF & Media Tools SaaS**: Word to PDF converter, merge, split, compress aur document lock.\n\n💡 **Sabse Easy Step**: Website par kisi bhi software ke **'Try Now'** button par click karke aap turant free live demo chala kar dekh sakte hain!\n\n📞 **Helpline / WhatsApp**: +91 92885 17027 / 8987766981\n📧 **Email**: `info@cvidyasolutions.com`\n\nAapko apne kis kaam ya business ke liye software dekhna hai?";
    }
    return "**C Vidya Solutions (www.cvidyasolutions.com) — Explained Simply** 🚀:\n\n**C Vidya Solutions** is an enterprise Cloud SaaS and AI Automation company founded by **Chiranjeev Das** and incubated at **STPI Sindri (BIT Sindri Campus, Dhanbad)**. Our mission—*'Innovating Software for a Simpler Future'*—is to replace manual paperwork with fast, automated digital platforms for businesses and institutions.\n\nIn simple terms, our ecosystem is built around **3 core pillars**:\n\n1. 📦 **7 Flagship Business SaaS Products**:\n   • **C Vidya Library Management**: Reading room seat allocation, ISBN barcode scanning, and automated WhatsApp fee/overdue alerts.\n   • **C Vidya Fitness Zone (Gym)**: Biometric turnstile gate access (auto-locks expired members), UPI renewal links, and diet/workout planners.\n   • **C Vidya Institutes Management**: Complete School/College ERP for admissions, fee ledgers, CBSE/ICSE report cards, and GPS bus tracking.\n   • **C Vidya Coaching Management**: Batch rosters, parent attendance SMS, and camera-based OMR mock test grading with AIR ranks.\n   • **AgriFusion (FarmFresh Hub)**: All-in-one poultry, fishery, goat farming, and retail POS management.\n   • **C Vidya Jewelers Management**: Live 24K/22K gold rate sync, karigar casting logs, and GST hallmark barcode billing.\n   • **C Vidya Enterprises CRM**: Drag-and-drop Kanban sales pipelines, automated follow-ups, and instant PDF quotes.\n\n2. 🤖 **4 Autonomous AI Agents (24/7 Digital Workforce)**:\n   • **AI Customer Support Agent**: 24/7 instant query resolution (<0.8s) across Web, WhatsApp, and Email.\n   • **Business Sales Flow AI Agent**: Finds B2B prospects, sends personalized outreach, and books calendar demos.\n   • **Social Media Agent**: Researches viral trends and auto-publishes across LinkedIn, X, Instagram, and Facebook.\n   • **AI Marketing for B2B SaaS**: Generates SEO keyword clusters, technical blogs, and inbound leads.\n\n3. ⚡ **3 Specialized Industry Suites**:\n   • **Petrol Pump Cloud Software**: Nozzle meter shift readings, underground tank dip variance audits, and fleet Credit Khata.\n   • **Care Plus Healthcare System**: Hospital OPD/IPD management, digital prescriptions (EMR), pharmacy POS, and pathology lab reports.\n   • **C Vidya PDF & Media Tools SaaS**: High-speed Word-to-PDF conversion, merge, split, compress, and password protection.\n\n🌐 **Official Website**: `https://cvidyasolutions.com`\n📞 **Direct Helpline / WhatsApp**: +91 92885 17027 / 8987766981\n\nWhich software or AI agent would you like to explore or try in a live demo today?";
  }

  // 0.08 Casual Human Conversation: "Mujhe software abhi Nahin chahie Ek Bar Kuchh Achcha chij batao" / "kuch achcha batao" / "tell me something good"
  const isNoSoftwareNeededNow =
    userText.includes("nahi chahiye") ||
    userText.includes("nahin chahie") ||
    userText.includes("nahin chahiye") ||
    userText.includes("nahi chahie") ||
    userText.includes("nhi chahiye") ||
    userText.includes("nhi chahiy") ||
    userText.includes("don't need software") ||
    userText.includes("do not need software") ||
    /नहीं\s*चाहिए/.test(userText) ||
    /नही\s*चाहिए/.test(userText) ||
    userText.includes("नहींचाहिए") ||
    userText.includes("नहीचाहिए");

  const isAskingSomethingGoodOrInteresting =
    userText.includes("achha chij") ||
    userText.includes("achcha chij") ||
    userText.includes("accha chij") ||
    userText.includes("achha cheez") ||
    userText.includes("achcha cheez") ||
    userText.includes("kuchh achcha") ||
    userText.includes("kuch achcha") ||
    userText.includes("kuchh achha") ||
    userText.includes("kuch achha") ||
    userText.includes("kuch nayi baat") ||
    userText.includes("achhi baat") ||
    userText.includes("acchi baat") ||
    userText.includes("something good") ||
    userText.includes("something nice") ||
    userText.includes("something interesting") ||
    userText.includes("motivate") ||
    userText.includes("अच्छी बात") ||
    userText.includes("अच्छा चीज") ||
    userText.includes("अच्छी चीज") ||
    userText.includes("कुछ अच्छा") ||
    userText.includes("यह बताओ") ||
    userText.includes("ये बताओ");

  if (
    (isNoSoftwareNeededNow && isAskingSomethingGoodOrInteresting) ||
    (!userText.includes("future") &&
      !userText.includes("software") &&
      isAskingSomethingGoodOrInteresting)
  ) {
    if (langMode === "hi") {
      return "बिल्कुल, कोई बात नहीं! 😊 ज़रूरी नहीं कि हम सिर्फ सॉफ्टवेयर की ही बात करें।\n\nएक बहुत अच्छी और सकारात्मक बात आपके साथ साझा करता हूँ: आज के समय में इंसान की सबसे बड़ी ताकत उसका 'समय' और 'सीखने की आदत' है। जो व्यक्ति हर दिन खुद को थोड़ा बेहतर बनाता है और अपने काम को स्मार्ट तरीके से करता है, उसे आगे बढ़ने से कोई नहीं रोक सकता।\n\nवैसे बताइए, आज आपका दिन कैसा चल रहा है और आप किस क्षेत्र में काम करते हैं?";
    }
    if (hinglish) {
      return "Bilkul, koi baat nahi! 😊 Zaroori nahi ki hum sirf software ki hi baat karein.\n\nEk bahut achhi aur positive baat aapke saath share karta hoon: Zindagi aur kaam me sabse badi taqat 'Time' aur 'Consistency' hoti hai—jo insan har din thoda naya seekhta hai aur apne kaam ko smart tarike se karta hai, wo hamesha sabse aage rehta hai.\n\nWaise aap bataiye, aaj aapka din kaisa chal raha hai aur aap kis field ya kaam se jude hain?";
    }
    return "No problem at all! 😊 We don't always have to talk about software.\n\nHere is a great thought for the day: The biggest superpower in both life and business is consistency—taking small, smart steps every single day compounds into extraordinary results over time.\n\nHow is your day going so far, and what kind of work or interests are you passionate about?";
  }

  // 0.1 Future-Ready Technology, Innovation & Advantages ("ishhmme future ke liye kuchh achha cheez hain kya", "future scope", "advance features")
  if (
    userText.includes("future") ||
    userText.includes("bhavishya") ||
    userText.includes("भविष्य") ||
    userText.includes("aage ke liye") ||
    userText.includes("achha cheez") ||
    userText.includes("achha chij") ||
    userText.includes("achcha chij") ||
    userText.includes("achcha cheez") ||
    userText.includes("kuchh achha") ||
    userText.includes("kuch achha") ||
    userText.includes("kuchh achcha") ||
    userText.includes("kuch achcha") ||
    userText.includes("kya achha") ||
    userText.includes("advance") ||
    userText.includes("scope") ||
    userText.includes("technology") ||
    userText.includes("kyu use kare") ||
    userText.includes("why choose") ||
    userText.includes("kya khas") ||
    userText.includes("kya fayda") ||
    userText.includes("benefits") ||
    userText.includes("advantage") ||
    userText.includes("फायदा")
  ) {
    if (langMode === "hi") {
      return "हाँ, बिल्कुल! **C Vidya Solutions** को भविष्य की आधुनिक तकनीक (Future-Ready Technology) को ध्यान में रखकर बनाया गया है। हमारा विज़न है: *'Innovating Software for a Simpler Future'*। 🚀\n\nइसमें भविष्य के लिए सबसे बेहतरीन और एडवांस सुविधाएँ हैं:\n1. 🤖 **4 ऑटोनॉमस AI एजेंट्स**: 24/7 कस्टमर सपोर्ट (<0.8 सेकंड रिस्पॉन्स), ऑटोमैटिक B2B लीड जनरेशन (SalesFlow) और सोशल मीडिया/SEO ऑटोमेशन।\n2. ⚡ **अल्ट्रा-फास्ट क्लाउडफ्लेयर एज नेटवर्क**: <50ms स्पीड, 99.99% अपटाइम, बैंक-ग्रेड TLS 1.3 एन्क्रिप्शन और STPI सिंदरी (भारत सरकार) प्रमाणन।\n3. 🚪 **स्मार्ट हार्डवेयर व IoT इंटीग्रेशन**: जिम में बायोमेट्रिक टर्नस्टाइल गेट ऑटो-लॉक, कोचिंग में कैमरा OMR शीट स्कैनर और पेट्रोल पंप में टैंक डिप ऑडिट।\n4. 📈 **मॉड्यूलर पे-एज़-यू-ग्रो मॉडल**: 100% GST-अनुपालित बिलिंग और कभी भी Excel/CSV में डेटा एक्सपोर्ट करने की सुविधा।\n\n📞 **हेल्पलाइन**: +91 92885 17027 | 🌐 `https://cvidyasolutions.com`";
    }
    if (hinglish) {
      return "Haan, bilkul! **C Vidya Solutions** ko aane wale bhavishya (Future-Ready Technology) ko dhyan me rakhkar hi develop kiya gaya hai. Hamara vision hai: *'Innovating Software for a Simpler Future'*. 🚀\n\nIsme future ke liye sabse advance aur behtareen cheezein ye hain:\n\n1. 🤖 **Autonomous AI Agents (Agli Peedhi ka Automation)**:\n   • **AI Customer Support Agent**: 24/7 bina kisi insani deri ke 0.8 second me customers ke sawalon ka sahi jawab deta hai.\n   • **SalesFlow AI Agent**: B2B clients ki verified emails dhundhta hai aur direct calendar meetings book karta hai.\n   • **Social Media & B2B Marketing Agents**: Trending viral topics scan karke LinkedIn, X aur Insta par automated high-converting posts aur SEO articles generate karte hain.\n\n2. ⚡ **Ultra-Fast Global Edge Cloud Architecture**:\n   • Hamara system **Cloudflare Global Edge Nodes** par chalta hai—matlab <50ms ultra-fast speed aur 99.99% uptime guarantee (server kabhi down nahi hoga).\n   • **Bank-Grade Data Security**: TLS 1.3 encryption, daily automated cloud backups, aur zero-trust role-based access.\n   • **STPI Sindri Certification**: Government of India ke Software Technology Parks of India dwara certified aur incubated.\n\n3. 🚪 **Smart Hardware IoT Automations**:\n   • **CV Fitness Zone (Gym)**: Biometric fingerprint / RFID se gate connect hota hai; fees khatam hote hi gate automatically lock ho jata hai aur WhatsApp par UPI renewal link chala jata hai!\n   • **Coaching & Institutes**: Paper OMR answer sheets ko camera se scan karke 1 second me All-India Rank (AIR) calculate karta hai, aur GPS bus tracking live parents ko dikhata hai.\n   • **Petrol Pump Cloud ERP**: Underground tank dip aur meter sale ka automated density audit, jisse fuel leakage ya theft ka zero chance rehta hai.\n\n4. 📈 **Modular Pay-As-You-Grow Model**:\n   • Zero lock-in policy: Aap apna data Excel/CSV me kabhi bhi export kar sakte hain, aur jaise-jaise business badhega, modules bina kisi technical jhanjhat ke upgrade hote jayenge.\n\n🌐 **Official Website**: `https://cvidyasolutions.com`\n📞 **Helpline Call/WhatsApp**: +91 92885 17027 / 8987766981\n📧 **Official Emails**: `info@cvidyasolutions.com`, `sales@cvidyasolutions.com`\n\nAapko kis business ya field ke liye future-ready software dekhna hai? Mujhe batayein, main live demo link share karunga!";
    }
    return "Yes, absolutely! **C Vidya Solutions** is architected from the ground up for the future of enterprise software, driven by our motto: *'Innovating Software for a Simpler Future'*. 🚀\n\nHere are the standout future-ready capabilities built into our ecosystem:\n\n1. 🤖 **Autonomous AI Agent Systems**:\n   • **24/7 AI Customer Support**: Sub-0.8s query resolution powered by neural RAG knowledge bases.\n   • **SalesFlow AI Agent**: Autonomous B2B prospect discovery, customized multi-touch outreach, and direct calendar demo booking.\n   • **Social Media & SEO Marketing Agents**: Continuous viral trend research, automated multi-channel publishing, and organic inbound pipeline generation.\n\n2. ⚡ **Next-Gen Cloudflare Edge Architecture**:\n   • Distributed edge microservices delivering sub-50ms latency across India and global hubs with a 99.99% uptime SLA.\n   • Bank-grade TLS 1.3 in-transit and AES-256 database encryption with automated daily snapshots.\n   • Incubated and certified under Software Technology Parks of India (STPI Sindri, BIT Sindri Campus).\n\n3. 🎯 **Deep Hardware & IoT Integration**:\n   • **Biometric Turnstiles (Gym)**: Automated entry lockout for expired plans and instant WhatsApp UPI renewal links.\n   • **Computer Vision OMR Grading (Coaching)**: Camera-based answer sheet grading with instantaneous All-India Rank (AIR) computation.\n   • **Fuel Telemetry (Petrol Pump)**: Automated underground tank dip-to-sale density variance audits.\n\n4. 📈 **Modular Pay-As-You-Grow SaaS**:\n   • Seamless scalability from single branch to national multi-campus chains with zero data lock-in and 100% GST-compliant billing.\n\n🌐 **Website**: `https://cvidyasolutions.com`\n📞 **Helpline**: +91 92885 17027 / 8987766981\n📧 **Official Emails**: `info@cvidyasolutions.com`, `sales@cvidyasolutions.com`\n\nWhich software or AI agent would you like to test in a live demo?";
  }

  // 1. Browsing / Casual / No immediate requirement ("dekh rha", "nahin chahie", "just browsing", "no thanks", etc.)
  if (
    isNoSoftwareNeededNow ||
    userText.includes("dekh rha") ||
    userText.includes("dekh raha") ||
    userText.includes("dekh rhe") ||
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
    if (langMode === "hi") {
      return "बिल्कुल, कोई बात नहीं! 😊 आप आराम से देखिए और जब भी आपका मन हो, हम किसी भी विषय पर बात कर सकते हैं। अगर आपको कभी भी कोई जानकारी या मदद चाहिए हो, तो मैं यहीं हूँ!";
    }
    if (hinglish) {
      return "Bilkul, koi baat nahi! 😊 Aap aaram se explore kijiye, abhi software lene ki koi jaldi nahi hai. Agar aapko waise hi kuch poochna ho, kisi technology ke baare me baat karni ho, ya kabhi baad me demo dekhna ho, toh bejhijhak bataiyega—main hamesha aapki madad ke liye yahan hoon!";
    }
    return "No problem at all! 😊 There is no rush to get any software right now. Feel free to look around at your own pace, ask me any general questions, or just chat whenever you need help!";
  }

  // 1.5 Feedback, Appreciation, Suggestions, Compliments & Thank You (Real Human Conversational Replies)
  if (
    userText.includes("feedback") ||
    userText.includes("suggestion") ||
    userText.includes("review") ||
    userText.includes("thank you") ||
    userText.includes("thanks") ||
    userText.includes("dhanyawad") ||
    userText.includes("shukriya") ||
    userText.includes("धन्यवाद") ||
    userText.includes("शुक्रिया") ||
    userText.includes("bahut achha") ||
    userText.includes("bahut badhiya") ||
    userText.includes("nice software") ||
    userText.includes("good work") ||
    userText.includes("great job") ||
    userText.includes("awesome") ||
    userText.includes("excellent") ||
    userText.includes("superb") ||
    userText.includes("impress") ||
    userText.includes("love your") ||
    userText.includes("achha laga") ||
    userText.includes("pasand aaya") ||
    userText.includes("बहुत अच्छा") ||
    userText.includes("बढ़िया") ||
    userText.includes("सुझाव") ||
    userText.includes("फीडबैक") ||
    userText === "good" ||
    userText === "nice" ||
    userText === "great" ||
    userText === "ok" ||
    userText === "okay" ||
    userText === "theek hai" ||
    userText === "acha" ||
    userText === "achha"
  ) {
    if (langMode === "hi") {
      return "आपकी बहुमूल्य प्रतिक्रिया और सराहना के लिए दिल से बहुत-बहुत धन्यवाद! 🙏\n\nहमें खुशी है कि आपको C Vidya Solutions का काम और सॉफ्टवेयर पसंद आया। आपकी हर राय और सुझाव हमारे लिए बेहद महत्वपूर्ण है और हम इसे सीधे अपने संस्थापक चिरंजीव दास व इंजीनियरिंग टीम के साथ साझा करते हैं।\n\nअगर आपके मन में कोई और सवाल है, कोई नया फीचर सुझाव है, या आप किसी सॉफ्टवेयर का लाइव डेमो देखना चाहते हैं, तो कृपया बेझिझक बताइए—मैं आपकी मदद के लिए यहाँ हूँ!";
    }
    if (hinglish) {
      return "Aapke valuable feedback aur appreciation ke liye dil se bahut-bahut dhanyawad! 🙏\n\nHumein bahut khushi hui ki aapko C Vidya Solutions pasand aaya. Aapka har feedback aur suggestion hamari team aur Founder Chiranjeev Das ke liye bahut maayne rakhta hai taaki hum apne software ko aur behtar bana sakein.\n\nAgar aapke paas koi aur suggestion hai, koi sawal hai, ya aap kisi software ka free trial / live demo dekhna chahte hain, toh bilkul batayein—main aapki poori madad karunga!";
    }
    return "Thank you so much for your kind words and valuable feedback! 🙏\n\nIt truly means a lot to our entire team and our founder, Chiranjeev Das, at C Vidya Solutions. We build every software suite with a focus on real-world simplicity, speed, and reliability, and hearing directly from you helps us keep improving.\n\nIf you have any additional suggestions, questions about our software, or would like to try a live interactive demo, just let me know—I am right here to help you!";
  }

  // 2. Greetings & Small Talk (English, Hindi, Hinglish)
  if (
    userText === "hi" ||
    userText === "hello" ||
    userText === "hey" ||
    userText.startsWith("namaste") ||
    userText.startsWith("namaskar") ||
    userText.startsWith("pranam") ||
    userText.includes("नमस्ते") ||
    userText.includes("नमस्कार") ||
    userText.includes("प्रणाम") ||
    userText.includes("good morning") ||
    userText.includes("good afternoon") ||
    userText.includes("good evening") ||
    userText.includes("kaise ho") ||
    userText.includes("kaise h") ||
    userText.includes("kya haal") ||
    userText.includes("how are you") ||
    userText.includes("कैसे हो") ||
    userText.includes("what's up") ||
    userText.includes("whats up")
  ) {
    if (langMode === "hi") {
      return "नमस्ते! 👋 मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद! C Vidya Solutions में आपका हार्दिक स्वागत है।\n\nबताइए, आज मैं आपकी कैसे मदद कर सकता हूँ? आप हमारे किसी भी बिजनेस सॉफ्टवेयर (जैसे लाइब्रेरी, जिम फिटनेस ज़ोन, स्कूल/इंस्टीट्यूट ERP, कोचिंग, एग्रीफ्यूज़न, ज्वेलर्स, CRM, पेट्रोल पंप, केयर प्लस हॉस्पिटल या PDF टूल्स), लाइव डेमो या प्राइसिंग के बारे में हिंदी, इंग्लिश या हिंग्लिश में बात कर सकते हैं।";
    }
    if (hinglish) {
      return "Namaste! 👋 Main bilkul badhiya hoon, poochne ke liye shukriya! C Vidya Solutions me aapka swagat hai.\n\nBatayein, aaj main aapki kis tarah se help kar sakta hoon? Aap hamare kisi bhi software (Library, Gym Fitness Zone, School/Institute ERP, Coaching, AgriFusion, Jewelers, CRM, Petrol Pump, Care Plus Hospital, ya PDF Tools), AI agents, ya live demo ke baare me aaram se pooch sakte hain!";
    }
    return "Hello! 👋 I am doing great, thank you for asking! Welcome to C Vidya Solutions.\n\nHow can I help you today? Feel free to ask me anything about our business software suites (Library, Fitness Zone, Institutes ERP, Coaching, AgriFusion, Jewelers, Enterprises CRM, Petrol Pump Cloud, Care Plus Healthcare, or PDF Tools), AI automation agents, pricing, or live demos—or share your feedback anytime!";
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
    userText.includes("team kaun hai") ||
    userText.includes("चिरंजीव") ||
    userText.includes("संस्थापक") ||
    userText.includes("मालिक")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Solutions नेतृत्व और प्रबंधन टीम** 👔:\n\n• **चिरंजीव दास (Chiranjeev Das)** — **Founder & Director**\n  C Vidya Solutions के संस्थापक और निदेशक। ईमेल: `chiranjeev0058@gmail.com`\n• **Sarah Jenkins** — **Chief Executive Officer (CEO)**\n• **Marcus Chen** — **Chief Technology Officer (CTO)**\n• **Elena Rodriguez** — **Head of Operations**\n\nसीधा संपर्क: 📞 +91 92885 17027 / 8987766981 | 📧 `info@cvidyasolutions.com`";
    }
    if (hinglish) {
      return "**C Vidya Solutions Leadership & Management Team** 👔:\n\n• **Chiranjeev Das** — **Founder & Director**\n  C Vidya Solutions ke sansthapak aur director hain jinhone company ko enterprise SaaS aur AI automation me aage badhaya.\n  📧 Email: `chiranjeev0058@gmail.com`\n\n• **Sarah Jenkins** — **Chief Executive Officer (CEO)**\n  Enterprise software me 15+ years ka experience, company ki global strategic vision aur client growth ko lead karti hain.\n\n• **Marcus Chen** — **Chief Technology Officer (CTO)**\n  Core deployment pipelines aur R&D division ke head hain, scalable microservices aur distributed cloud architecture ke expert.\n\n• **Elena Rodriguez** — **Head of Operations**\n  Client deliveries aur SLA commitments ko 100% on-time execute karwati hain.\n\nAap hamare founder aur leadership desk se direct contact kar sakte hain: 📞 +91 92885 17027 / 8987766981";
    }
    return "**C Vidya Solutions Leadership Team**:\n\n• **Chiranjeev Das** — **Founder & Director**\n  Steers company vision, indigenous software engineering, and strategic initiatives. Contact: `chiranjeev0058@gmail.com`.\n\n• **Sarah Jenkins** — **Chief Executive Officer (CEO)**\n  Over 15 years in enterprise software, driving global strategy, client value, and executive partnerships.\n\n• **Marcus Chen** — **Chief Technology Officer (CTO)**\n  Architect of core distributed deployment pipelines and head of the AI R&D engineering division.\n\n• **Elena Rodriguez** — **Head of Operations**\n  Directs seamless operational delivery and enterprise SLA fulfillment.\n\nConnect with our leadership desk: 📞 +91 92885 17027 | 📧 `info@cvidyasolutions.com`";
  }

  // 2.2 Company History, Legacy & Timeline
  if (
    userText.includes("history") ||
    userText.includes("timeline") ||
    userText.includes("legacy") ||
    userText.includes("kab shuru") ||
    userText.includes("kab bani") ||
    userText.includes("founded") ||
    userText.includes("background") ||
    userText.includes("इतिहास")
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
    userText.includes("नौकरी") ||
    userText.includes("apply") ||
    userText.includes("kaam chahiye")
  ) {
    if (hinglish) {
      return "**C Vidya Solutions Careers & Job Openings** 💼:\n\nHamari engineering team grow kar rahi hai aur hum talented developers ko hire kar rahe hain:\n\n1. **Senior Full-Stack Cloud Architect** (Engineering, 4-7 Years exp, Remote / Hybrid Dhanbad HQ)\n2. **Autonomous AI Agent Engineer** (R&D AI Division, 2-5 Years exp, Remote)\n3. **Enterprise UI/UX Systems Designer** (Design Systems, 3+ Years exp, Remote)\n\n• **Apply Kaise Karein?**:\n  - Website: `https://cvidyasolutions.com/careers/` par visit karein.\n  - Ya direct apna resume send karein: `careers@cvidyasolutions.com`\n  (Subject me Job Title zaroor likhein)";
    }
    return "**Careers at C Vidya Solutions** 💼:\n\nWe are actively recruiting passionate technologists for the following roles:\n\n1. **Senior Full-Stack Cloud Architect** (Engineering, 4-7 Years, Remote / Hybrid Dhanbad HQ)\n2. **Autonomous AI Agent Engineer** (R&D AI Division, 2-5 Years, Remote)\n3. **Enterprise UI/UX Systems Designer** (Design Systems, 3+ Years, Remote)\n\n• **How to Apply**:\nVisit `https://cvidyasolutions.com/careers/` or submit your resume directly to `careers@cvidyasolutions.com` with the desired position title in the subject line.";
  }

  // 2.4 Social Media Channels
  if (
    userText.includes("youtube") ||
    userText.includes("instagram") ||
    userText.includes("facebook") ||
    userText.includes("twitter") ||
    userText.includes("linkedin") ||
    (userText.includes("social media") && !userText.includes("agent"))
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
      return "Main **C Vidya Solutions** ka official AI Customer Support Assistant hoon aur hamare sabhi software aur AI agents ki poori technical jaankari de sakta hoon.\n\nAgar aapko hamari executive team ya founder se direct baat karni hai:\n\n📞 **Helpline Call/WhatsApp**: +91 92885 17027 / 8987766981\n📧 **Official Emails**: info@cvidyasolutions.com, contact@cvidyasolutions.com\n👔 **Founder Desk (Chiranjeev Das)**: chiranjeev0058@gmail.com\n📍 **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n🏢 **Branch & Incubation**: STPI Sindri, BIT Sindri Campus, Dhanbad\n\nAap apna **Name**, **Mobile Number**, aur **Software of Interest** yahan likh dijiye, hamari team aapse turant connect karegi!";
    }
    return "I am the official **AI Customer Support Assistant** of C Vidya Solutions. I can answer any question about our software architecture, features, live demos, pricing, and onboarding.\n\nIf you would like to connect directly with our human executive team:\n\n📞 **Helpline**: +91 92885 17027 / 8987766981\n📧 **Official Emails**: info@cvidyasolutions.com, contact@cvidyasolutions.com\n👔 **Founder Desk (Chiranjeev Das)**: chiranjeev0058@gmail.com\n📍 **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n🏢 **Incubation & Branch**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n\nPlease share your Name, Mobile Number, and Product of interest, and our executive team will contact you right away!";
  }

  // 4. All Software / Products Overview ("all software", "what software", "list of software", "all products", "services", "kya kya software", "सॉफ्टवेयर")
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
    userText.includes("software list") ||
    userText.includes("सभी सॉफ्टवेयर") ||
    userText.includes("सॉफ्टवेयर की जानकारी")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Solutions का संपूर्ण सॉफ्टवेयर पोर्टफोलियो**:\n\n📦 **7 प्रमुख SaaS सॉफ्टवेयर**:\n1. **C Vidya Library Management**: स्टडी हॉल सीट आवंटन, बारकोड स्कैनर, ओवरड्यू फाइन WhatsApp अलर्ट।\n2. **C Vidya Fitness Zone**: जिम बायोमेट्रिक टर्नस्टाइल गेट एक्सेस, मेंबरशिप रिन्यूअल, वर्कआउट व डाइट चार्ट।\n3. **C Vidya Institutes Management**: स्कूल/कॉलेज ERP, एडमिशन CRM, फीस कैशबुक, GPS बस ट्रैकिंग, रिपोर्ट कार्ड।\n4. **C Vidya Coaching Management**: बैच शेड्यूल, पेरेंट्स SMS अलर्ट, ऑफलाइन OMR मॉक टेस्ट स्कैनर व AIR रैंक।\n5. **AgriFusion (FarmFresh Hub)**: पोल्ट्री, मछली पालन, बकरी पालन और रिटेल POS बिलिंग।\n6. **C Vidya Jewelers Management**: लाइव 24K/22K गोल्ड रेट सिंक, कारीगर कास्टिंग और GST बारकोड बिलिंग।\n7. **C Vidya Enterprises CRM**: विजुअल कानबान डील पाइपलाइन, ऑटोमैटिक फॉलो-अप और कोटेशन PDF बिल्डर।\n\n🤖 **4 ऑटोनॉमस AI एजेंट्स**:\n1. **Social Media Agent** | 2. **AI Customer Support Agent** | 3. **Business Sales Flow AI Agent** | 4. **AI Marketing for B2B SaaS**\n\n⚡ **विशेष इंडस्ट्री प्लेटफॉर्म**:\n1. **Petrol Pump Cloud Software** | 2. **Care Plus Healthcare System** | 3. **C Vidya PDF & Media Tools SaaS**\n\nआप किस सॉफ्टवेयर का लाइव डेमो टेस्ट करना चाहते हैं?";
    }
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
    userText.includes("dikhao") ||
    userText.includes("live link") ||
    userText.includes("how to try") ||
    userText.includes("free trial") ||
    userText.includes("डेमो") ||
    userText.includes("ट्रायल")
  ) {
    if (langMode === "hi") {
      return "हमारे सभी सॉफ्टवेयर और AI एजेंट्स के लिए **फ्री इंटरैक्टिव लाइव डेमो (Free Live Demo)** उपलब्ध है! 🚀\n\nआप वेबसाइट पर किसी भी सॉफ्टवेयर कार्ड के **'Try Now'** बटन पर क्लिक करके तुरंत लाइव डेमो चलाकर देख सकते हैं।\n\nयदि आप 1-ऑन-1 पर्सनलाइज्ड डेमो चाहते हैं, तो कृपया अपना **नाम, मोबाइल नंबर, ईमेल, शहर और सॉफ्टवेयर का नाम** साझा करें!";
    }
    if (hinglish) {
      return "Hamare sabhi software aur AI agents ke liye **Free Interactive Live Demos & Sandbox Access** available hai! 🚀\n\nAap website par kisi bhi product card ke **'Try Now'** button par tap karke live demo turant test kar sakte hain.\n\nAgar aapko customized walkthrough ya 1-on-1 demo session schedule karna hai, toh kripya ye details share kijiye:\n1. **Aapka Full Name**\n2. **Business / Institute ka Name**\n3. **Mobile / WhatsApp Number**\n4. **Email Address**\n5. **Kaunsa Software chahiye** (Library, Gym, Petrol Pump, Care Plus, AgriFusion, Coaching, AI Agent, etc.)\n6. **City aur State**\n\nHamari tech team 24 hours ke andar aapse connect karke personalized demo arrange karegi!";
    }
    return "We provide **Free Interactive Live Demos & Sandbox Access** for all our software products and AI agents!\n\nYou can click the **'Try Now'** button on any product card across the website to launch the live environment directly.\n\nTo schedule a personalized 1-on-1 walkthrough or receive custom credentials, please share:\n1. **Your Full Name**\n2. **Business / Institution Name**\n3. **Mobile Number**\n4. **Email Address**\n5. **Product of Interest** (e.g., Library, Gym, Petrol Pump, Care Plus, AgriFusion, Coaching, AI Agents, PDF Tools)\n6. **City & State**\n\nOur team will set up your environment within 24 hours!";
  }

  // 6. Pricing, Cost, Rates, Subscription Plans & GST
  if (
    userText.includes("price") ||
    userText.includes("pricing") ||
    userText.includes("cost") ||
    /\brate(s)?\b/i.test(userText) ||
    /\bfee(s)?\b/i.test(userText) ||
    userText.includes("charge") ||
    userText.includes("kitne ka") ||
    userText.includes("kitna lagega") ||
    userText.includes("paise") ||
    /\bplan(s)?\b/i.test(userText) ||
    userText.includes("subscription") ||
    userText.includes("billing") ||
    userText.includes("gst") ||
    userText.includes("कीमत") ||
    userText.includes("प्राइस") ||
    userText.includes("शुल्क")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Solutions — मूल्य और सब्सक्रिप्शन प्लान (Pricing & Tiers)** 💳:\n\nहमारे सभी सॉफ्टवेयर प्लान मॉड्यूलर और किफायती हैं:\n• **स्टार्टर प्लान (Single Branch)**: एकल शाखा लाइब्रेरी, जिम, क्लिनिक या फार्म के लिए उपयुक्त (1,000 सक्रिय रिकॉर्ड्स, POS बिलिंग और SMS/WhatsApp अलर्ट सहित)।\n• **ग्रोथ / प्रोफेशनल प्लान (Most Popular)**: मल्टी-बैच कोचिंग, पेट्रोल पंप, ज्वेलरी शोरूम और अस्पतालों के लिए (बायोमेट्रिक हार्डवेयर इंटीग्रेशन, GST लेजर और 24/7 सपोर्ट सहित)।\n• **एंटरप्राइज कस्टम प्लान**: बड़े स्कूल समूहों, मल्टी-ब्रांच संस्थानों और कस्टम AI एजेंट पाइपलाइन के लिए।\n\n🧾 **GST इनवॉइस**: सभी बिल 100% GST-अनुपालित होते हैं। सटीक कोटेशन के लिए कृपया अपना व्यवसाय प्रकार और उपयोगकर्ता संख्या साझा करें!";
    }
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
    userText.includes("study center") ||
    userText.includes("लाइब्रेरी") ||
    userText.includes("पुस्तकालय") ||
    userText.includes("किताब")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Library Management System** रीडिंग लाइब्रेरी, स्टडी सेंटर और कॉलेजों के लिए एक पूर्णतः ऑटोमेटेड क्लाउड सॉफ्टवेयर है:\n\n• **सीट आवंटन (Seat Allotment)**: सुबह, शाम या पूरे दिन की शिफ्ट के अनुसार स्टडी रूम सीट्स आवंटित करें।\n• **बारकोड व ISBN स्कैनिंग**: किताबों का तेज़ इश्यू और रिटर्न, शीर्षक या लेखक से तुरंत खोज।\n• **ऑटोमैटिक WhatsApp अलर्ट**: किताब देरी से लौटाने या फीस ड्यू होने पर छात्रों को ऑटोमैटिक WhatsApp और SMS रिमाइंडर।\n• **फीस व डिजिटल रसीद**: मासिक/त्रैमासिक शुल्क संग्रह, ऑनलाइन पेमेंट और डिजिटल आईडी कार्ड।\n\n🔗 लाइव ऐप लिंक: `https://v.cvidyasolutions.workers.dev/`\n\nक्या आप अपनी लाइब्रेरी के लिए लाइव डेमो देखना चाहेंगे?";
    }
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
    userText.includes("bodybuilding") ||
    userText.includes("जिम") ||
    userText.includes("फिटनेस")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Fitness Zone** आधुनिक जिम और फिटनेस क्लबों के लिए एक शक्तिशाली मैनेजमेंट सॉफ्टवेयर है:\n\n• **बायोमेट्रिक टर्नस्टाइल गेट कंट्रोल**: फिंगरप्रिंट या RFID से गेट कनेक्ट करें; मेंबरशिप समाप्त होते ही गेट अपने-आप लॉक हो जाता है!\n• **मेंबरशिप प्लान**: मासिक, त्रैमासिक, वार्षिक और पर्सनल ट्रेनिंग (PT) प्लान आसानी से मैनेज करें।\n• **ऑटोमैटिक WhatsApp रिन्यूअल**: फीस समाप्त होने से पहले ऑटोमैटिक रिमाइंडर और UPI पेमेंट लिंक भेजता है।\n• **वर्कआउट व डाइट चार्ट**: प्रत्येक सदस्य के लिए कस्टम डाइट और एक्सरसाइज प्लान।\n\n🔗 लाइव ऐप लिंक: `https://fitzone.cvidyasolutions.workers.dev/`\n\nक्या आप अपने जिम के लिए लाइव डेमो देखना चाहेंगे?";
    }
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
    userText.includes("स्कूल") ||
    userText.includes("कॉलेज") ||
    userText.includes("विद्यालय") ||
    (userText.includes("institute") && !userText.includes("coaching"))
  ) {
    if (langMode === "hi") {
      return "**C Vidya Institutes Management** स्कूलों, डिग्री कॉलेजों और शैक्षणिक संस्थानों के लिए ऑल-इन-वन क्लाउड ERP है:\n\n• **एडमिशन CRM**: नए छात्रों की पूछताछ से लेकर नामांकन और दस्तावेज़ सत्यापन तक पूरा फ्लो।\n• **फीस व कैशबुक**: कक्षा-वार शुल्क संरचना, किस्त (Installment) प्रबंधन और डिजिटल फीस रसीद।\n• **बायोमेट्रिक उपस्थिति व पेरेंट्स SMS**: छात्र के आने या अनुपस्थित रहने पर माता-पिता को तुरंत WhatsApp/SMS सूचना।\n• **परीक्षा व रिपोर्ट कार्ड**: CBSE/ICSE और स्टेट बोर्ड पैटर्न पर ऑटोमैटिक मार्कशीट जनरेटर।\n• **GPS स्कूल बस ट्रैकिंग व हॉस्टल प्रबंधन**: लाइव बस लोकेशन और हॉस्टल रूम/मेस बिलिंग।";
    }
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
    userText.includes("mock test") ||
    userText.includes("कोचिंग") ||
    userText.includes("ट्यूशन")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Coaching Management** प्रतियोगी परीक्षा संस्थानों (JEE, NEET, UPSC, SSC, Banking) के लिए विशेष रूप से तैयार किया गया है:\n\n• **बैच शेड्यूलिंग**: बैच निर्माण, सिलेबस ट्रैकर और क्लासरूम क्षमता प्रबंधन।\n• **बायोमेट्रिक उपस्थिति व SMS**: छात्र के क्लास मिस करने पर माता-पिता को ऑटोमैटिक SMS अलर्ट।\n• **ऑफलाइन OMR मॉक टेस्ट स्कैनर**: OMR उत्तर पुस्तिकाओं को कैमरे से स्कैन करके तुरंत अंक, पर्सेंटाइल और All-India Rank (AIR) जनरेट करें!\n• **परफॉरमेंस एनालिटिक्स**: छात्र के कमजोर और मजबूत विषयों का विस्तृत स्कोरकार्ड।\n\n🔗 लाइव ऐप लिंक: `https://coaching.cvidyasolutions.workers.dev/`";
    }
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
    userText.includes("machli") ||
    userText.includes("फार्म") ||
    userText.includes("पोल्ट्री") ||
    userText.includes("कृषि") ||
    userText.includes("मछली") ||
    userText.includes("मुर्गी")
  ) {
    if (langMode === "hi") {
      return "**AgriFusion (FarmFresh Hub)** — *'One Platform. Every Farm. Unlimited Growth.'*\n\nयह पोल्ट्री, मछली पालन, बकरी पालन और कृषि व्यवसाय के लिए ऑल-इन-वन सॉफ्टवेयर है:\n• **पोल्ट्री फार्मिंग**: फ़ीड खपत, मृत्यु दर और FCR (Feed Conversion Ratio) ट्रैकिंग।\n• **मछली पालन (Aquaculture)**: तालाब के पानी की गुणवत्ता (pH, ऑक्सीजन, तापमान) और फीडिंग शेड्यूल।\n• **बकरी व पशुपालन**: नस्ल रिकॉर्ड, टीकाकरण और स्वास्थ्य लॉग।\n• **रिटेल POS व उधारी खाता**: डिजिटल कांटे से जोड़कर ताज़ा चिकन, मछली व अंडों की बिलिंग और डिस्ट्रीब्यूटर खाता।\n\n🔗 लाइव ऐप लिंक: `https://fresh.cvidyasolutions.workers.dev/`";
    }
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
    userText.includes("jewellery") ||
    userText.includes("ज्वेलरी") ||
    userText.includes("सोना") ||
    userText.includes("चांदी") ||
    userText.includes("आभूषण")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Jewelers Management** ज्वेलरी शोरूम और सर्राफा व्यापारियों के लिए विशेष ERP सॉफ्टवेयर है:\n\n• **लाइव सोने-चांदी के भाव**: 24K, 22K और 18K सोने व चांदी के लाइव मार्केट रेट सिंक।\n• **सटीक वजन व मेकिंग चार्ज**: ग्रॉस वेट, नेट वेट, स्टोन वेट और कारीगर घחת (Wastage) की गणना।\n• **कारीगर लेजर व कस्टम ऑर्डर**: कारीगर को दिए गए सोने का हिसाब और ब्राइडल आभूषण ऑर्डर ट्रैकिंग।\n• **GST बारकोड व HUID बिलिंग**: हॉलमार्क बारकोड लेबल और टैक्स-अनुपालित GST बिल प्रिंटिंग।\n\n🔗 लाइव ऐप लिंक: `https://jewelry.cvidyasolutions.workers.dev/`";
    }
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
    if (langMode === "hi") {
      return "**C Vidya Enterprises CRM** सेल्स टीमों और कंपनियों के लिए आधुनिक लीड मैनेजमेंट और डील क्लोजिंग प्लेटफॉर्म है:\n\n• **विजुअल कानबान पाइपलाइन**: नई लीड्स से लेकर डील क्लोज होने तक हर स्टेज को ड्रैग-एंड-ड्रॉप बोर्ड पर ट्रैक करें।\n• **ऑटोमैटिक फॉलो-अप व रिमाइंडर**: मीटिंग शेड्यूल, कॉल लॉग्स और टास्क रिमाइंडर।\n• **इंस्टेंट कोटेशन PDF**: कंपनी लोगो और GST के साथ 1 मिनट में प्रोफेशनल PDF कोटेशन बनाएं।\n\n🔗 लाइव ऐप लिंक: `https://crm.cvidyasolutions.workers.dev/`";
    }
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
    userText.includes("agents") ||
    userText.includes("एआई एजेंट")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Solutions के 4 ऑटोनॉमस AI एजेंट्स** 🤖:\n\n1. **C Vidya Social Media Agent**: ट्रेंडिंग विषयों पर पोस्ट बनाकर LinkedIn, X, Instagram और Facebook पर ऑटो-पब्लिश करता है।\n2. **C Vidya AI Customer Support Agent**: 24/7 ग्राहकों के सवालों का <0.8 सेकंड में सटीक उत्तर देता है।\n3. **C Vidya Business Sales Flow AI Agent**: टारगेट B2B क्लाइंट्स के ईमेल ढूंढकर ऑटोमैटिक आउटरीच और डेमो मीटिंग बुक करता है।\n4. **C Vidya AI Marketing for B2B SaaS**: SEO कीवर्ड क्लस्टर और टेक्निकल ब्लॉग्स लिखकर ऑर्गेनिक ट्रैफिक बढ़ाता है।";
    }
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
    userText.includes("credit khata") ||
    userText.includes("पेट्रोल") ||
    userText.includes("डीजल")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Cloud-Based Software Petrol Pump Site** पेट्रोल और डीजल पंप डीलरशिप (IOCL, BPCL, HPCL, Nayara, Reliance) के लिए संपूर्ण क्लाउड ERP है:\n\n• **शिफ्ट नोजल मीटर रीडिंग**: ओपनिंग और क्लोजिंग मीटर रीडिंग से प्रति नोजल ऑटोमैटिक बिक्री गणना।\n• **अंडरग्राउंड टैंक डिप व वेरिएंस ऑडिट**: फिजिकल डिप और मीटर सेल का मिलान करके लीकेज या वाष्पीकरण की तुरंत जांच।\n• **फ्लीट क्रेडिट खाता (उधारी बिलिंग)**: ट्रांसपोर्टर्स और गाड़ियों की पर्ची/चालान बिलिंग और ऑटोमैटिक WhatsApp पेमेंट रिमाइंडर।\n• **लुब्रिकेंट्स व कैशियर हिसाब**: इंजन ऑयल स्टॉक और शिफ्ट कैश/UPI मिलान।\n\n🔗 लाइव लिंक: `https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/`";
    }
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
    userText.includes("pharmacy") ||
    userText.includes("अस्पताल") ||
    userText.includes("क्लिनिक") ||
    userText.includes("डॉक्टर")
  ) {
    if (langMode === "hi") {
      return "**Care Plus Healthcare System** अस्पतालों, नर्सिंग होम, क्लिनिक और डायग्नोस्टिक सेंटरों के लिए एकीकृत हॉस्पिटल मैनेजमेंट सिस्टम (HIS) है:\n\n• **OPD टोकन व IPD बेड आवंटन**: मरीज़ पंजीकरण, अपॉइंटमेंट और वार्ड/ICU बेड मैनेजमेंट।\n• **डिजिटल प्रिस्क्रिप्शन (EMR)**: डॉक्टरों के लिए तेज़ दवा टेम्पलेट और प्रिंट/WhatsApp पर्चा।\n• **फार्मेसी POS व पैथोलॉजी लैब**: दवाइयों का बैच/एक्सपायरी अलर्ट और बारकोड लैब रिपोर्ट।\n• **हॉस्पिटल बिलिंग व TPA**: आयुष्मान भारत और इंश्योरेंस बिलिंग सपोर्ट।\n\n🔗 लाइव लिंक: `https://care-plus.cvidyasolutions.workers.dev/`";
    }
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
    userText.includes("watermark") ||
    userText.includes("पीडीएफ")
  ) {
    if (langMode === "hi") {
      return "**C Vidya PDF and Media Tools SaaS** हाई-स्पीड डॉक्यूमेंट और मीडिया कन्वर्ज़न सूट है:\n\n• **Word से PDF कन्वर्टर**: `.docx` फाइलों को ओरिजिनल फॉन्ट और फॉर्मेटिंग के साथ PDF में बदलें।\n• **संपूर्ण PDF टूल्स**: PDF Merge (जोड़ना), Split (अलग करना), Compress (साइज छोटा करना), Watermark और Password प्रोटेक्शन।\n• **100% प्राइवेसी**: सभी फाइलें सुरक्षित ब्राउज़र-एज पर प्रोसेस होती हैं।\n\n🔗 लाइव लिंक: `https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/`";
    }
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
    userText.includes("surakshit") ||
    userText.includes("सुरक्षा")
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
    userText.includes("forgot") ||
    userText.includes("सहायता")
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
    userText.includes("kaha hai") ||
    userText.includes("संपर्क") ||
    userText.includes("पता") ||
    userText.includes("ऑफिस")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Solutions की आधिकारिक जानकारी**:\n\n• **संस्थापक एवं निदेशक (Founder & Director)**: **चिरंजीव दास (Chiranjeev Das)**\n• **टैगलाइन**: *Innovating Software for a Simpler Future*\n• **आधिकारिक वेबसाइट**: https://cvidyasolutions.com\n• **हेल्पलाइन नंबर**: +91 92885 17027 / 8987766981\n• **ईमेल**: info@cvidyasolutions.com, sales@cvidyasolutions.com, contact@cvidyasolutions.com\n• **मुख्यालय (HQ)**: सुरुंगा, बलियापुर, धनबाद, झारखंड - 828115\n• **शाखा एवं इनक्यूबेशन सेंटर**: STPI सिंदरी, BIT सिंदरी कैंपस, धनबाद, झारखंड";
    }
    if (hinglish) {
      return "**C Vidya Solutions Official Company Details**:\n\n• **Founder & Director**: **Chiranjeev Das**\n• **Established**: 2025\n• **Tagline**: *Innovating Software for a Simpler Future*\n• **Official Website**: https://cvidyasolutions.com\n• **Helpline Mobile**: +91 92885 17027 / 8987766981\n• **Official Emails**: info@cvidyasolutions.com, sales@cvidyasolutions.com, contact@cvidyasolutions.com\n• **Founder Desk**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch & Incubation Center**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n• **Social Media**: YouTube (@cvidyasolutions), Facebook, Instagram, LinkedIn & X (@CVidyaSolutions)";
    }
    return "**C Vidya Solutions Official Details**:\n\n• **Founded**: 2025 by **Chiranjeev Das** (Founder & Director)\n• **Tagline**: *Innovating Software for a Simpler Future*\n• **Official Website**: https://cvidyasolutions.com\n• **Helpline Phone**: +91 92885 17027 / 8987766981\n• **Official Emails**: info@cvidyasolutions.com, sales@cvidyasolutions.com, contact@cvidyasolutions.com\n• **Founder Desk**: chiranjeev0058@gmail.com\n• **Headquarters**: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• **Branch & Incubation**: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n• **Social**: YouTube, Facebook, Instagram, LinkedIn, and Twitter/X";
  }

  // =========================================================================
  // 10B. CENTRAL AI BUSINESS ASSISTANT WORKFLOWS (PHASE 2)
  // - Product Recommendation & Lead Qualification
  // - Follow-Up Task Creation
  // - CRM Record Search & Update Guidance
  // - Sales & Marketing Workflow Assistance
  // - HR Screening & Recruitment Administration
  // - Management Reports from Verified Data
  // - Human Escalation for Complex / Sensitive Requests
  // =========================================================================

  // Product Recommendation & Lead Qualification
  if (
    userText.includes("recommend") ||
    userText.includes("which software") ||
    userText.includes("suitable") ||
    userText.includes("best for my") ||
    userText.includes("kaunsa software") ||
    userText.includes("konsa software") ||
    userText.includes("qualify") ||
    userText.includes("requirement") ||
    userText.includes("जरूरत") ||
    userText.includes("कौन सा सॉफ्टवेयर")
  ) {
    if (langMode === "hi") {
      return "**C Vidya Solutions — उपयुक्त सॉफ्टवेयर चुनाव और आवश्यकता विश्लेषण** 🎯:\n\nआपके व्यवसाय के आधार पर हमारे प्रमाणित सॉफ्टवेयर सुझाव:\n• **लाइब्रेरी / स्टडी हॉल**: *C Vidya Library Management* (ISBN बारकोड, सीट आवंटन, शुल्क व ओवरड्यू अलर्ट)\n• **जिम / फिटनेस क्लब**: *C Vidya Fitness Zone* (बायोमेट्रिक टर्नस्टाइल गेट, मेंबरशिप प्लान, डाइट चार्ट)\n• **स्कूल / कॉलेज**: *C Vidya Institutes Management* (प्रवेश CRM, फीस लेजर, बस GPS ट्रैकिंग)\n• **कोचिंग संस्थान**: *C Vidya Coaching Management* (बैच प्रबंधन, OMR टेस्ट स्कैनर व रैंक जनरेटर)\n• **कृषि / पोल्ट्री / डेयरी**: *AgriFusion (FarmFresh Hub)* (फ़ीड FCR, तालाब टेलीमेट्री, खुदरा बिलिंग)\n• **ज्वेलरी शोरूम**: *C Vidya Jewelers Management* (24K/22K लाइव गोल्ड रेट, कारीगर कास्टिंग, GST बिलिंग)\n• **पेट्रोल पंप**: *Petrol Pump Cloud Software* (नोजल मीटर, टैंक डिप ऑडिट, क्रेडिट खाता)\n• **अस्पताल / क्लिनिक**: *Care Plus Healthcare System* (OPD/IPD, डिजिटल प्रिस्क्रिप्शन, फार्मेसी व लैब)\n\nकृपया अपना **व्यवसाय प्रकार (Business Type)**, **अनुमानित उपयोगकर्ता संख्या**, **शहर**, और **मोबाइल नंबर** साझा करें ताकि हम आपके लिए कस्टम डेमो तैयार कर सकें!";
    }
    if (hinglish) {
      return "**C Vidya Solutions — Product Recommendation & Lead Qualification** 🎯:\n\nAapke business type ke hisab se hamare verified software recommendations:\n• **Reading Library / Study Center**: *C Vidya Library Management* (Seat allotment, ISBN barcode, automated WhatsApp fee/overdue alerts)\n• **Gym / Fitness Studio**: *C Vidya Fitness Zone* (Biometric turnstile auto-lock, plan renewals, workout & diet plans)\n• **School / Degree College**: *C Vidya Institutes Management* (Admissions CRM, fee cashbooks, CBSE/ICSE gradebook, GPS bus tracking)\n• **Coaching Institute (JEE/NEET/UPSC)**: *C Vidya Coaching Management* (Batch rosters, parent SMS, camera OMR sheet grading & AIR rank)\n• **Poultry / Fishery / Multi-Farm**: *AgriFusion (FarmFresh Hub)* (Flock FCR, water telemetry, weighing POS & credit khata)\n• **Jewelry Showroom**: *C Vidya Jewelers Management* (Live 24K/22K rate sync, karigar wastage, GST HUID billing)\n• **Petrol Pump / Fuel Station**: *Petrol Pump Cloud Suite* (Shift nozzle meter, underground tank dip variance, fleet credit khata)\n• **Hospital / Clinic**: *Care Plus Healthcare System* (OPD/IPD tokens, EMR prescription, pharmacy & lab reports)\n• **B2B Sales & Support Automation**: *C Vidya Enterprise CRM* + *4 Autonomous AI Agents*\n\nApने business ke liye sahi plan aur demo prepare karne ke liye kripya batayein:\n1. **Business Type & Organization Name**\n2. **Approximate Students / Members / Users Count**\n3. **Key Requirements**\n4. **Contact Name, Phone & City**";
    }
    return "**C Vidya Solutions — Verified Product Recommendation & Requirement Qualification** 🎯:\n\nBased on our verified software portfolio, here is how we match solutions to your organization:\n• **Libraries & Study Halls**: *C Vidya Library Management* (ISBN barcode scanning, reading room seat allocation, automated WhatsApp overdue alerts)\n• **Gyms & Fitness Clubs**: *C Vidya Fitness Zone* (Biometric turnstile access control, membership billing, workout/diet planner)\n• **Schools & Colleges**: *C Vidya Institutes Management* (Admissions CRM, fee ledgers, gradebooks, GPS bus tracking)\n• **Competitive Coaching Centers**: *C Vidya Coaching Management* (Batch scheduling, parent SMS attendance, offline OMR grading & AIR ranks)\n• **Poultry, Fishery & Agribusiness**: *AgriFusion / FarmFresh Hub* (Flock FCR, pond telemetry, retail POS & distributor khata)\n• **Jewelry Showrooms**: *C Vidya Jewelers Management* (Live 24K/22K bullion sync, karigar casting logs, GST barcode billing)\n• **Fuel Retail Stations**: *C Vidya Petrol Pump Cloud Suite* (Nozzle shift meters, tank dip variance audit, fleet credit khata)\n• **Hospitals & Clinics**: *Care Plus Healthcare System* (OPD/IPD management, digital prescriptions, pharmacy POS, pathology lab)\n• **Commercial Sales & Support Teams**: *C Vidya Enterprise CRM* + *4 Autonomous AI Agents* (Support, SalesFlow, Social Media, B2B Marketing)\n\nTo qualify your requirements and prepare a tailored recommendation, please share:\n1. **Your Business Type & Company Name**\n2. **Approximate Active Users / Records**\n3. **Primary Operational Requirements**\n4. **Contact Name, Phone Number, Email & City**";
  }

  // Follow-up Task Creation & Scheduling
  if (
    userText.includes("follow-up") ||
    userText.includes("follow up") ||
    userText.includes("create task") ||
    userText.includes("schedule task") ||
    userText.includes("reminder") ||
    userText.includes("callback task") ||
    userText.includes("फॉलो-अप")
  ) {
    if (hinglish) {
      return "**Follow-Up Task & Callback Preparation** 📅:\n\nMain aapke liye **C Vidya CRM Follow-Up Task** turant register kar sakta hoon. Kripya niche diye gaye **'CRM / Lead & Task'** button par click karein ya chat me ye details bhejein:\n• **Contact Name & Company**\n• **Mobile Number / Email**\n• **Product of Interest**\n• **Follow-Up Task Note & Preferred Date/Time**\n\nJaise hi aap details denge, task hamare Firestore CRM queue aur `cvidyasolutions@gmail.com` par log ho jayega!";
    }
    return "**Follow-Up Task & Callback Scheduling** 📅:\n\nI can log a structured **Follow-Up Task** directly into the C Vidya CRM system. You can use the **'CRM / Lead & Task'** panel inside this assistant or reply with:\n• **Contact Name & Company Name**\n• **Phone Number & Email Address**\n• **Product of Interest**\n• **Task Description & Preferred Callback Date/Time**\n\nOnce provided, the follow-up task is saved to our CRM database and dispatched to `cvidyasolutions@gmail.com`.";
  }

  // CRM Search, Lead Status & Sales/Marketing Workflows
  if (
    userText.includes("crm record") ||
    userText.includes("search crm") ||
    userText.includes("update crm") ||
    userText.includes("lead status") ||
    userText.includes("sales workflow") ||
    userText.includes("marketing workflow") ||
    userText.includes("management report") ||
    userText.includes("executive report") ||
    userText.includes("kpi report")
  ) {
    if (hinglish) {
      return "**C Vidya CRM, Sales/Marketing Workflows & Management Reporting** 📊:\n\n• **CRM Lead Search & Status Update**: Authorized administrators Contact page ya Footer se **Administrative Data Center** (या `/api/crm/leads`) khol kar sabhi leads search kar sakte hain, status (`New`, `Qualified`, `Demo Scheduled`, `Follow-Up`, `Escalated`, `Closed`) update kar sakte hain, aur follow-up tasks assign kar sakte hain.\n• **Sales & Marketing Automation**: Hamara *SalesFlow AI Agent* aur *B2B SaaS Marketing Agent* outbound prospect discovery, BANT qualification, aur SEO/LinkedIn campaigns assist karte hain.\n• **Verified Management Report Summary**:\n  - **Active SaaS Suites**: 7 Flagship Platforms + 3 Specialized Suites\n  - **Autonomous AI Agents**: 4 Production Agents\n  - **Enterprise Deployments**: 150+ Active Client Organizations\n  - **Cloud Uptime Target**: 99.99% on Cloudflare Edge & Google Cloud\n\nLive CRM Lead summary dekhne ke liye Admin Data Center me **'CRM & Reports'** tab open karein!";
    }
    return "**C Vidya CRM, Sales/Marketing Workflows & Management & Portfolio Report** 📊:\n\n• **CRM Search & Record Updates**: Authorized administrators can open the **Administrative Data Center** (or query `/api/crm/leads` and `/api/crm/report`) to search leads by name, company, phone, city, or product, update lead statuses (`New`, `Qualified`, `Demo Scheduled`, `Follow-Up`, `Escalated`, `Closed`), and manage follow-up tasks.\n• **Sales & Marketing Workflows**: Our *SalesFlow AI Agent*, *Social Media Agent*, and *B2B SaaS Marketing Agent* assist with prospect qualification, demo scheduling, and multi-channel campaign planning.\n• **Verified Management Snapshot**:\n  - **Flagship SaaS Suites**: 7 Core Platforms + 3 Specialized Industry Suites\n  - **Autonomous AI Agents**: 4 Production Agents\n  - **Verified Client Deployments**: 150+ Organizations\n  - **Infrastructure**: Cloudflare Global Edge + Google Cloud / Firebase Firestore\n\nOpen the **Management Report** tab in the Administrative Data Center for real-time lead counts and status breakdowns!";
  }

  // HR Screening & Recruitment Administration
  if (
    userText.includes("hr ") ||
    userText.includes("screening") ||
    userText.includes("recruitment") ||
    userText.includes("candidate") ||
    userText.includes("resume") ||
    userText.includes("interview") ||
    userText.includes("भर्ती")
  ) {
    if (hinglish) {
      return "**C Vidya HR Screening & Recruitment Administration** 👥:\n\nHamare current verified open engineering aur design positions:\n1. **Senior Full-Stack Cloud Architect** — 4-7 Years experience (React, TypeScript, Node.js, Cloud Architecture) · Remote / Hybrid (Dhanbad HQ)\n2. **Autonomous AI Agent Engineer** — 2-5 Years experience (LLM orchestration, RAG pipelines, Python/TypeScript) · Remote\n3. **Enterprise UI/UX Systems Designer** — 3+ Years experience (Design systems, B2B SaaS workflows, Figma) · Remote\n\n**Candidate Screening Checklist**:\n• Role applied for & years of relevant experience\n• Core technical stack & portfolio/GitHub link\n• Notice period & location preference\n\nCandidates `/careers/` page par form fill kar sakte hain ya `careers@cvidyasolutions.com` par resume bhej sakte hain.";
    }
    return "**C Vidya HR Screening & Recruitment Administration** 👥:\n\nVerified Open Positions at C Vidya Solutions:\n1. **Senior Full-Stack Cloud Architect** — Engineering (4–7 Years experience, Remote / Hybrid Dhanbad HQ)\n2. **Autonomous AI Agent Engineer** — R&D AI Division (2–5 Years experience, Remote)\n3. **Enterprise UI/UX Systems Designer** — Design Systems (3+ Years experience, Remote)\n\n**HR Screening Criteria**:\n• Target Role & Years of Verifiable Experience\n• Technical Stack Alignment & Portfolio / GitHub Repository\n• Availability / Notice Period & Location Preference\n\nApplicants can submit their application directly on `/careers/` or email `careers@cvidyasolutions.com`.";
  }

  // Escalation for Complex, Custom Contract, or Sensitive Requests
  if (
    userText.includes("escalate") ||
    userText.includes("sensitive") ||
    userText.includes("legal") ||
    userText.includes("refund") ||
    userText.includes("complaint") ||
    userText.includes("shikayat") ||
    userText.includes("sla breach") ||
    userText.includes("custom contract")
  ) {
    if (hinglish) {
      return "**Priority Human Escalation Desk** 🚨:\n\nAapki request complex/sensitive category me aati hai aur iske liye human confirmation zaroori hai. Main isko hamare senior executive aur Director Desk ko escalate kar raha hoon:\n\n• **Founder & Director Desk**: Chiranjeev Das (`chiranjeev0058@gmail.com`)\n• **Official Escalation Email**: `cvidyasolutions@gmail.com` / `contact@cvidyasolutions.com`\n• **Direct Priority Helpline**: +91 92885 17027 / +91 8987766981 (Mon–Sat, 10:00 AM – 07:00 PM IST)\n\nKripya apna **Name**, **Phone Number**, aur **Issue Summary** share karein taaki senior team aapse priority par sampark kar sake.";
    }
    return "**Priority Human Escalation Desk** 🚨:\n\nBecause your request involves a complex, contractual, or sensitive matter, human confirmation is required. Please escalate or connect directly with our executive leadership desk:\n\n• **Founder & Director Desk**: Chiranjeev Das (`chiranjeev0058@gmail.com`)\n• **Official Support & Escalation Inbox**: `cvidyasolutions@gmail.com` / `contact@cvidyasolutions.com`\n• **Direct Priority Helpline**: +91 92885 17027 / +91 8987766981 (Mon–Sat, 10:00 AM – 07:00 PM IST)\n\nShare your **Name**, **Phone Number**, and **Request Summary** here, and we will flag it immediately for human executive review.";
  }

  // 11. Conversational Human Catch-All (Directly responds like a warm human without quoting raw user transcript)
  if (langMode === "hi") {
    return "जी बिल्कुल, मैं आपकी बात समझ सकता हूँ। 😊\n\nअगर आपको अभी किसी सॉफ्टवेयर की ज़रूरत नहीं है तो भी कोई बात नहीं—हम किसी भी विषय, बिज़नेस आइडिया या टेक्नोलॉजी पर बात कर सकते हैं। और जब भी आपको किसी बिज़नेस सॉफ्टवेयर, फ्री ट्रायल या जानकारी की आवश्यकता हो, बस मुझे बताइएगा, मैं तुरंत आपकी मदद करूँगा!";
  }
  if (hinglish) {
    return "Ji bilkul, main aapki baat samajh raha hoon. 😊\n\nAgar aapko abhi kisi software ki zaroorat nahi hai toh koi baat nahi—aap mujhse kisi bhi topic, business idea ya technology ke baare me aaram se baat kar sakte hain. Aur jab bhi aapko kisi software, free trial ya help ki zaroorat ho, bas mujhe bataiyega, main turant aapki madad karunga!";
  }

  return "I completely understand! 😊\n\nWhether you want to chat about a general topic, explore business ideas, or test one of our software platforms or free trials whenever you are ready, just let me know and I will be happy to help you right away!";
}

export function isGenericCatchAllReply(reply: string): boolean {
  const normalized = (reply || "").trim();
  return (
    normalized.startsWith("I completely understand!") ||
    normalized.startsWith("जी बिल्कुल, मैं आपकी बात समझ") ||
    normalized.startsWith("Ji bilkul, main aapki baat samajh")
  );
}

