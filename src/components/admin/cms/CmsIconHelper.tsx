import React from "react";
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Server,
  Smartphone,
  BarChart,
  Users,
  HeartHandshake,
  Award,
  Clock,
  Headphones,
  Globe,
  Lock,
  Send,
  MessageSquare,
  Radio,
  Sparkles,
  Layers,
  Activity,
  FileText,
  Star,
  Flame,
  Rocket,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
} from "lucide-react";

export const AVAILABLE_ICONS: { name: string; label: string; component: React.ComponentType<{ className?: string }> }[] = [
  { name: "CheckCircle", label: "Check Circle", component: CheckCircle },
  { name: "ShieldCheck", label: "Shield Check (Security)", component: ShieldCheck },
  { name: "Zap", label: "Lightning (Speed/Instant)", component: Zap },
  { name: "TrendingUp", label: "Trending Up (Growth)", component: TrendingUp },
  { name: "Cpu", label: "Processor (High Tech)", component: Cpu },
  { name: "Server", label: "Server (Infrastructure)", component: Server },
  { name: "Smartphone", label: "Smartphone (Mobile/SMS)", component: Smartphone },
  { name: "BarChart", label: "Bar Chart (Analytics)", component: BarChart },
  { name: "Users", label: "Users (Audience/Team)", component: Users },
  { name: "HeartHandshake", label: "Handshake (Partnership)", component: HeartHandshake },
  { name: "Award", label: "Award (Quality/Best)", component: Award },
  { name: "Clock", label: "Clock (24/7 / Real-time)", component: Clock },
  { name: "Headphones", label: "Headphones (Support)", component: Headphones },
  { name: "Globe", label: "Globe (Global/Worldwide)", component: Globe },
  { name: "Lock", label: "Lock (Security/Encryption)", component: Lock },
  { name: "Send", label: "Send (SMS/Direct)", component: Send },
  { name: "MessageSquare", label: "Message (Chat/Text)", component: MessageSquare },
  { name: "Radio", label: "Broadcast/Radio (Telecom)", component: Radio },
  { name: "Sparkles", label: "Sparkles (AI/Special)", component: Sparkles },
  { name: "Layers", label: "Layers (Multi-channel)", component: Layers },
  { name: "Activity", label: "Pulse / Activity (Uptime)", component: Activity },
  { name: "Star", label: "Star (Top Rated)", component: Star },
  { name: "Flame", label: "Flame (Hot Offer)", component: Flame },
  { name: "Rocket", label: "Rocket (Fast Launch)", component: Rocket },
  { name: "Mail", label: "Mail (Email Gateway)", component: Mail },
  { name: "Phone", label: "Phone (Call/Hotline)", component: Phone },
  { name: "MapPin", label: "Map Pin (Location)", component: MapPin },
];

export function renderCmsIcon(iconName: string | null | undefined, className = "w-5 h-5") {
  if (!iconName) return <CheckCircle className={className} />;
  const match = AVAILABLE_ICONS.find((item) => item.name.toLowerCase() === iconName.toLowerCase());
  if (match) {
    const Component = match.component;
    return <Component className={className} />;
  }
  return <HelpCircle className={className} />;
}
