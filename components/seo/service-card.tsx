import { BarChart, Brain, Camera, Clock, Eye, Handshake, Heart, Microscope, Pill, ShieldCheck, Star, Stethoscope, Syringe, Target, Zap, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Eye,
  Heart,
  Activity: BarChart,
  Shield: ShieldCheck,
  Scan: Microscope,
  Pill,
  Hand: Handshake,
  Zap,
  Camera,
  Target,
  Syringe,
  Scalpel: Stethoscope,
  Clock,
  Stethoscope,
  Clipboard: ClipboardList,
};

export default function ServiceCard({
  service,
  lang,
}: {
  service: { name: string; description: string; icon: string };
  lang: string;
}) {
  const Icon = iconMap[service.icon] || Star;

  return (
    <div className="p-6 bg-secondary/30 rounded-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="size-6 text-primary" />
        <h3 className="font-semibold text-foreground">{service.name}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
    </div>
  );
}
