import React from "react";
import {
  Zap,
  BarChart3,
  Cpu,
  Languages,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Code2,
  Lock,
  GitFork,
  Sparkles,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  Headphones,
  Users,
  MapPin,
  TrendingUp,
  Shield,
  Layers,
  Server,
  Database,
  Send,
  LucideIcon,
} from "lucide-react";

// Safe dictionary mapping string icon names to Lucide icon components
export const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  barchart3: BarChart3,
  barchart: BarChart3,
  cpu: Cpu,
  languages: Languages,
  language: Languages,
  checkcircle2: CheckCircle2,
  checkcircle: CheckCircle2,
  shieldcheck: ShieldCheck,
  creditcard: CreditCard,
  code2: Code2,
  code: Code2,
  lock: Lock,
  gitfork: GitFork,
  sparkles: Sparkles,
  clock: Clock,
  phone: Phone,
  mail: Mail,
  messagesquare: MessageSquare,
  message: MessageSquare,
  settings: Settings,
  headphones: Headphones,
  users: Users,
  mappin: MapPin,
  trendingup: TrendingUp,
  shield: Shield,
  layers: Layers,
  server: Server,
  database: Database,
  send: Send,
};

export interface DynamicIconProps {
  name?: string;
  className?: string;
  fallback?: LucideIcon;
}

/**
 * Safely resolves and renders a Lucide React icon by string key name.
 * If the icon name is missing or unmapped, gracefully renders the fallback icon.
 */
export default function DynamicIcon({
  name,
  className = "w-5 h-5",
  fallback = Sparkles,
}: DynamicIconProps) {
  if (!name) {
    const FallbackComponent = fallback;
    return <FallbackComponent className={className} />;
  }

  const normalizedKey = name.toLowerCase().replace(/[-_\s]/g, "");
  const IconComponent = ICON_MAP[normalizedKey] || fallback;

  return <IconComponent className={className} />;
}
