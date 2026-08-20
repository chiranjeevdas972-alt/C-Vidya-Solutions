import ServicesSection from "./ServicesSection";

interface ProductSuiteProps {
  onOpenInquiry?: (softwareName?: string) => void;
}

export default function ProductSuite({ onOpenInquiry }: ProductSuiteProps) {
  return <ServicesSection id="services" onOpenInquiry={onOpenInquiry} />;
}
