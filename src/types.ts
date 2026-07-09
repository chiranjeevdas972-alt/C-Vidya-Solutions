export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: string;
}

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
  description: string;
  features: string[];
  externalLink?: string;
  mockData: {
    title: string;
    metrics: MetricCard[];
    recentActivity: string[];
    secondaryTitle?: string;
    chartData?: Array<{ name: string; value: number }>;
  };
}
