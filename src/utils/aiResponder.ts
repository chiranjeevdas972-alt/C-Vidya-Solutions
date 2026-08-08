export function getSmartAssistantResponse(messages: { role: string; content?: string; text?: string }[]): string {
  if (!messages || messages.length === 0) {
    return "Hello! 👋 Welcome to C Vidya Solutions.\n\nI am your AI Customer Support Assistant. How can I help you today?";
  }

  const lastMsg = messages[messages.length - 1];
  const userText = ((lastMsg.content || lastMsg.text || "").toLowerCase()).trim();

  if (!userText) {
    return "Hello! 👋 Welcome to C Vidya Solutions. How can I assist you today?";
  }

  // 1. Browsing / Casual / No requirement right now ("dekh rha", "dekh raha", "nahi chahiye", "nhi chahiye", "just browsing", "looking", "aise hi", "no need", "timepass", "just checking", "pass", "no thanks")
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

  // 2. Greetings & Small Talk
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

  // 3. Human / Real Person Agent
  if (
    userText.includes("human") ||
    userText.includes("real agent") ||
    userText.includes("person") ||
    userText.includes("insan") ||
    userText.includes("banda")
  ) {
    return "I am the official AI Customer Support Assistant of C Vidya Solutions. I can answer questions about our software, features, pricing, demos, and support.\n\nIf you'd like to speak with our executive or team directly, please share your contact details and software requirements, or call us at 8987766981!";
  }

  // 4. Demo & Trial Requests
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

  // 5. Pricing & Cost
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

  // 6. Library Management System
  if (
    userText.includes("library") ||
    userText.includes("kitab") ||
    userText.includes("book") ||
    userText.includes("reading room") ||
    userText.includes("study center")
  ) {
    return "**C Vidya Library Management System** helps libraries reduce manual work, organize records, manage students & books, and monitor daily operations:\n\n• **Student Management**: Student IDs, active memberships & attendance.\n• **Book Records**: Issue/return logging, fine calculation & search catalog.\n• **Seat Management**: Assign & track reading seats.\n• **Billing & Invoices**: Generate payment receipts, billing & expense logs.\n\nWould you like to request a demo for your library?";
  }

  // 7. Institute, School, Coaching
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

  // 8. Gym & Fitness
  if (
    userText.includes("gym") ||
    userText.includes("fitness") ||
    userText.includes("workout") ||
    userText.includes("trainer") ||
    userText.includes("spa")
  ) {
    return "**CV Fitness Zone** is designed for gyms & fitness centers:\n\n• **Member Management**: Track active plans, renewal reminders & profile logs.\n• **Payment & Invoices**: Fee collection, receipts & payment records.\n• **Attendance & Trainer Logs**: Attendance tracking & trainer allocations.\n\nWould you like a demo for your fitness center?";
  }

  // 9. ChickMart (Poultry)
  if (
    userText.includes("chickmart") ||
    userText.includes("chicken") ||
    userText.includes("poultry shop") ||
    userText.includes("meat shop")
  ) {
    return "**ChickMart** is a digital solution for poultry & chicken businesses:\n\n• **Inventory Tracking**: Stock management & daily weight records.\n• **Sales & Billing**: POS invoices, customer ledgers & daily sales reports.\n• **Expense Monitoring**: Supplier purchases & operational expense logs.\n\nWould you like to see a demo?";
  }

  // 10. FarmFresh Hub & AgriFusion (Agriculture & Farming)
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

  // 11. Customer Support / Login / Error / Technical Issue
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

  // 12. Contact / Address / Founder
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

  // 13. Products List Inquiry
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

  // 14. Generic / Catch-all Fallback
  return "Thank you for reaching out to **C Vidya Solutions**! 👋\n\nI can help you with information about our software solutions (Library, Institute, Gym, Agriculture, CRM), demo requests, pricing, support, or company details.\n\nHow can I help you today?";
}
