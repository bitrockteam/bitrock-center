import {
  Brain,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Handshake,
  HardDrive,
  Heart,
  Lightbulb,
  LucideIcon,
  MessageCircle,
  Monitor,
  Palette,
  Presentation,
  Server,
  Settings,
  Shield,
  Smartphone,
  Target,
  UserCheck,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { SeniorityLevel } from "../../db";

// Funzione per ottenere le icone disponibili per le skills
export const getAvailableIcons = () => [
  { name: "Code", icon: Code },
  { name: "Database", icon: Database },
  { name: "Cloud", icon: Cloud },
  { name: "GitBranch", icon: GitBranch },
  { name: "Palette", icon: Palette },
  { name: "MessageCircle", icon: MessageCircle },
  { name: "Users", icon: Users },
  { name: "Target", icon: Target },
  { name: "Clock", icon: Clock },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Brain", icon: Brain },
  { name: "Heart", icon: Heart },
  { name: "Handshake", icon: Handshake },
  { name: "Presentation", icon: Presentation },
  { name: "UserCheck", icon: UserCheck },
  { name: "Server", icon: Server },
  { name: "Smartphone", icon: Smartphone },
  { name: "Globe", icon: Globe },
  { name: "Shield", icon: Shield },
  { name: "Zap", icon: Zap },
  { name: "Settings", icon: Settings },
  { name: "Monitor", icon: Monitor },
  { name: "Cpu", icon: Cpu },
  { name: "HardDrive", icon: HardDrive },
  { name: "Wifi", icon: Wifi },
];

// Funzione per formattare il nome della skill con il livello di seniority
export const formatSkillWithSeniority = (
  skillName: string,
  seniorityLevel: SeniorityLevel,
): string => {
  const levelLabel = getSeniorityLevelLabel(seniorityLevel);
  return `${skillName} (${levelLabel})`;
};

export const getSeniorityLevelLabel = (level: SeniorityLevel): string => {
  switch (level) {
    case "junior":
      return "Junior";
    case "middle":
      return "Middle";
    case "senior":
      return "Senior";
    default:
      return level;
  }
};

export const getSeniorityLevelColor = (level: SeniorityLevel): string => {
  switch (level) {
    case "junior":
      return "bg-amber-500";
    case "middle":
      return "bg-blue-500";
    case "senior":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const getSkillIcon = (iconName?: string) => {
  console.info("Fetching icon for:", iconName);
  const availableIcons = getAvailableIcons();
  const LucideIcon = availableIcons.find((icon) => icon.name === iconName)
    ?.icon as LucideIcon;
  return LucideIcon || (() => <span>🔧</span>);
};
