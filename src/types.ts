export interface Inquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  cityCountry?: string;
  businessType?: string;
  service: string;
  requirements?: string;
  message: string;
  timestamp: string;
  status: string;
  followUpTask?: string;
  followUpDue?: string;
  source?: string;
}

export interface CrmLead extends Inquiry {
  leadScore?: "Hot" | "Warm" | "New";
}

export interface FollowUpTask {
  id: string;
  leadId?: string;
  contactName: string;
  phone?: string;
  email?: string;
  productOfInterest?: string;
  taskDescription: string;
  dueDate: string;
  status: "Pending" | "Completed" | "Escalated";
  createdAt: string;
}

export type VoiceAgentStatus = "idle" | "listening" | "processing" | "speaking" | "error";

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "assistant";
  content: string;
  timestamp: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface DashboardMetric {
  title: string;
  value: string;
  trend?: string;
}

export interface ProductService {
  id: string;
  num: string;
  name: string;
  tagline: string;
  subhead?: string;
  description: string;
  features: string[];
  externalLink?: string;
  imageUrl?: string;
  categoryType?: "saas" | "ai-agent";
  badge?: string;
  aiModel?: string;
  mockData: {
    title: string;
    metrics: MetricCard[];
    recentActivity: string[];
    secondaryTitle?: string;
    chartData?: Array<{ name: string; value: number }>;
  };
}

export interface AiOutboundCallRecord {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  company?: string;
  productOfInterest: string;
  voiceGender: "female" | "male";
  language: "en" | "hi" | "hinglish";
  callStatus:
    | "Queued"
    | "Ringing"
    | "In Progress"
    | "Completed"
    | "Follow-Up Scheduled"
    | "Escalated to Human";
  durationSeconds: number;
  script: string;
  customerResponse?: string;
  outcome: string;
  assignedRep: string;
  demoBookedSlot?: string;
  humanHandoffReason?: string;
  createdAt: string;
}

export interface DemoBookingRecord {
  id: string;
  leadId?: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  product: string;
  preferredDate: string;
  preferredTime: string;
  language: "en" | "hi" | "hinglish";
  status: "Scheduled" | "Completed" | "Rescheduled";
  createdAt: string;
}

export interface HumanHandoffTicket {
  id: string;
  callId?: string;
  leadId?: string;
  customerName: string;
  phone: string;
  language: "en" | "hi" | "hinglish";
  product: string;
  reason: string;
  assignedAgent: string;
  priority: "High" | "Urgent" | "Normal";
  status: "Open" | "Assigned" | "Resolved";
  timestamp: string;
}

export interface HrSalesMember {
  id: string;
  name: string;
  role: "Sales Executive" | "HR Specialist" | "Technical Architect" | "Customer Success";
  department: "Sales" | "HR" | "Engineering";
  phone: string;
  email: string;
  assignedLeadsCount: number;
  activeCallsCount: number;
  status: "Available" | "On Call" | "Offline";
}

