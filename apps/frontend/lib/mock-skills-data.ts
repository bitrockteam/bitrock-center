import type { LucideIcon } from "lucide-react";
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

// Tipi per le competenze
export type SkillCategory = "hard" | "soft";
export type SeniorityLevel = "junior" | "middle" | "senior";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  icon: LucideIcon;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeSkill = {
  skillId: string;
  seniorityLevel: SeniorityLevel;
};

export type EmployeeWithSkills = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  avatar?: string;
  active: boolean;
  skills: EmployeeSkill[];
};

// Catalogo delle competenze
const skillsCatalog: Skill[] = [
  // Hard Skills - Programming Languages
  {
    id: "js",
    name: "JavaScript",
    category: "hard",
    description: "Linguaggio di programmazione per web development",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "ts",
    name: "TypeScript",
    category: "hard",
    description: "Superset tipizzato di JavaScript",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "python",
    name: "Python",
    category: "hard",
    description: "Linguaggio di programmazione versatile",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "java",
    name: "Java",
    category: "hard",
    description: "Linguaggio di programmazione orientato agli oggetti",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "csharp",
    name: "C#",
    category: "hard",
    description: "Linguaggio di programmazione Microsoft",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "php",
    name: "PHP",
    category: "hard",
    description: "Linguaggio per sviluppo web server-side",
    icon: Server,
    active: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
  },
  {
    id: "go",
    name: "Go",
    category: "hard",
    description: "Linguaggio di programmazione di Google",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "rust",
    name: "Rust",
    category: "hard",
    description: "Linguaggio di programmazione systems",
    icon: Code,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },

  // Hard Skills - Frameworks & Libraries
  {
    id: "react",
    name: "React",
    category: "hard",
    description: "Libreria JavaScript per UI",
    icon: Globe,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "vue",
    name: "Vue.js",
    category: "hard",
    description: "Framework JavaScript progressivo",
    icon: Globe,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "angular",
    name: "Angular",
    category: "hard",
    description: "Framework TypeScript per applicazioni web",
    icon: Globe,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "hard",
    description: "Framework React per produzione",
    icon: Globe,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "hard",
    description: "Runtime JavaScript server-side",
    icon: Server,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "express",
    name: "Express.js",
    category: "hard",
    description: "Framework web per Node.js",
    icon: Server,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "django",
    name: "Django",
    category: "hard",
    description: "Framework web Python",
    icon: Server,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "spring",
    name: "Spring Boot",
    category: "hard",
    description: "Framework Java per applicazioni enterprise",
    icon: Server,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },

  // Hard Skills - Databases
  {
    id: "mysql",
    name: "MySQL",
    category: "hard",
    description: "Database relazionale open source",
    icon: Database,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "hard",
    description: "Database relazionale avanzato",
    icon: Database,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "hard",
    description: "Database NoSQL orientato ai documenti",
    icon: Database,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "redis",
    name: "Redis",
    category: "hard",
    description: "Database in-memory key-value",
    icon: HardDrive,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    category: "hard",
    description: "Motore di ricerca e analytics",
    icon: Database,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },

  // Hard Skills - Cloud & DevOps
  {
    id: "aws",
    name: "Amazon AWS",
    category: "hard",
    description: "Piattaforma cloud computing",
    icon: Cloud,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    category: "hard",
    description: "Piattaforma cloud Microsoft",
    icon: Cloud,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    category: "hard",
    description: "Piattaforma cloud Google",
    icon: Cloud,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "docker",
    name: "Docker",
    category: "hard",
    description: "Piattaforma di containerizzazione",
    icon: Cpu,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "hard",
    description: "Orchestrazione di container",
    icon: Cpu,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "terraform",
    name: "Terraform",
    category: "hard",
    description: "Infrastructure as Code",
    icon: Settings,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "jenkins",
    name: "Jenkins",
    category: "hard",
    description: "Server di automazione CI/CD",
    icon: Settings,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },

  // Hard Skills - Tools
  {
    id: "git",
    name: "Git",
    category: "hard",
    description: "Sistema di controllo versione",
    icon: GitBranch,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "jira",
    name: "Jira",
    category: "hard",
    description: "Tool di project management",
    icon: Target,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "figma",
    name: "Figma",
    category: "hard",
    description: "Tool di design collaborativo",
    icon: Palette,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    category: "hard",
    description: "Software di editing immagini",
    icon: Palette,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },

  // Soft Skills
  {
    id: "communication",
    name: "Comunicazione",
    category: "soft",
    description: "Capacità di comunicare efficacemente",
    icon: MessageCircle,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "leadership",
    name: "Leadership",
    category: "soft",
    description: "Capacità di guidare e motivare team",
    icon: Users,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "teamwork",
    name: "Lavoro di squadra",
    category: "soft",
    description: "Collaborazione efficace in team",
    icon: Users,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    category: "soft",
    description: "Risoluzione creativa dei problemi",
    icon: Lightbulb,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "time-management",
    name: "Gestione del tempo",
    category: "soft",
    description: "Organizzazione e prioritizzazione",
    icon: Clock,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "adaptability",
    name: "Adattabilità",
    category: "soft",
    description: "Flessibilità ai cambiamenti",
    icon: Zap,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "critical-thinking",
    name: "Pensiero critico",
    category: "soft",
    description: "Analisi obiettiva e ragionamento",
    icon: Brain,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "creativity",
    name: "Creatività",
    category: "soft",
    description: "Pensiero innovativo e originale",
    icon: Lightbulb,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "emotional-intelligence",
    name: "Intelligenza emotiva",
    category: "soft",
    description: "Gestione delle emozioni",
    icon: Heart,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "negotiation",
    name: "Negoziazione",
    category: "soft",
    description: "Capacità di negoziare e mediare",
    icon: Handshake,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "presentation",
    name: "Presentazione",
    category: "soft",
    description: "Capacità di presentare efficacemente",
    icon: Presentation,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "mentoring",
    name: "Mentoring",
    category: "soft",
    description: "Guidare e sviluppare altri",
    icon: UserCheck,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];

// Dipendenti con competenze
const employeesWithSkills: EmployeeWithSkills[] = [
  {
    id: "user-1",
    name: "Marco",
    surname: "Rossi",
    email: "marco.rossi@bitrock.it",
    role: "Senior Full Stack Developer",
    avatar: "/placeholder.svg",
    active: true,
    skills: [
      { skillId: "js", seniorityLevel: "senior" },
      { skillId: "ts", seniorityLevel: "senior" },
      { skillId: "react", seniorityLevel: "senior" },
      { skillId: "nextjs", seniorityLevel: "middle" },
      { skillId: "nodejs", seniorityLevel: "senior" },
      { skillId: "postgresql", seniorityLevel: "middle" },
      { skillId: "docker", seniorityLevel: "middle" },
      { skillId: "aws", seniorityLevel: "junior" },
      { skillId: "git", seniorityLevel: "senior" },
      { skillId: "communication", seniorityLevel: "senior" },
      { skillId: "problem-solving", seniorityLevel: "senior" },
      { skillId: "teamwork", seniorityLevel: "senior" },
      { skillId: "mentoring", seniorityLevel: "middle" },
    ],
  },
  {
    id: "user-2",
    name: "Laura",
    surname: "Bianchi",
    email: "laura.bianchi@bitrock.it",
    role: "Senior UI/UX Designer",
    avatar: "/placeholder.svg",
    active: true,
    skills: [
      { skillId: "figma", seniorityLevel: "senior" },
      { skillId: "photoshop", seniorityLevel: "senior" },
      { skillId: "js", seniorityLevel: "middle" },
      { skillId: "react", seniorityLevel: "middle" },
      { skillId: "creativity", seniorityLevel: "senior" },
      { skillId: "communication", seniorityLevel: "senior" },
      { skillId: "presentation", seniorityLevel: "senior" },
      { skillId: "critical-thinking", seniorityLevel: "senior" },
      { skillId: "teamwork", seniorityLevel: "senior" },
      { skillId: "adaptability", seniorityLevel: "middle" },
    ],
  },
  {
    id: "user-3",
    name: "Giovanni",
    surname: "Verdi",
    email: "giovanni.verdi@bitrock.it",
    role: "Project Manager",
    avatar: "/placeholder.svg",
    active: true,
    skills: [
      { skillId: "jira", seniorityLevel: "senior" },
      { skillId: "leadership", seniorityLevel: "senior" },
      { skillId: "communication", seniorityLevel: "senior" },
      { skillId: "time-management", seniorityLevel: "senior" },
      { skillId: "negotiation", seniorityLevel: "senior" },
      { skillId: "presentation", seniorityLevel: "senior" },
      { skillId: "mentoring", seniorityLevel: "senior" },
      { skillId: "emotional-intelligence", seniorityLevel: "senior" },
      { skillId: "problem-solving", seniorityLevel: "senior" },
      { skillId: "adaptability", seniorityLevel: "senior" },
    ],
  },
  {
    id: "user-4",
    name: "Francesca",
    surname: "Neri",
    email: "francesca.neri@bitrock.it",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg",
    active: true,
    skills: [
      { skillId: "aws", seniorityLevel: "senior" },
      { skillId: "azure", seniorityLevel: "middle" },
      { skillId: "docker", seniorityLevel: "senior" },
      { skillId: "kubernetes", seniorityLevel: "senior" },
      { skillId: "terraform", seniorityLevel: "senior" },
      { skillId: "jenkins", seniorityLevel: "middle" },
      { skillId: "python", seniorityLevel: "middle" },
      { skillId: "git", seniorityLevel: "senior" },
      { skillId: "problem-solving", seniorityLevel: "senior" },
      { skillId: "communication", seniorityLevel: "middle" },
      { skillId: "teamwork", seniorityLevel: "senior" },
    ],
  },
  {
    id: "user-5",
    name: "Alessandro",
    surname: "Gialli",
    email: "alessandro.gialli@bitrock.it",
    role: "Junior Backend Developer",
    avatar: "/placeholder.svg",
    active: false,
    skills: [
      { skillId: "java", seniorityLevel: "middle" },
      { skillId: "spring", seniorityLevel: "junior" },
      { skillId: "mysql", seniorityLevel: "junior" },
      { skillId: "postgresql", seniorityLevel: "junior" },
      { skillId: "git", seniorityLevel: "middle" },
      { skillId: "docker", seniorityLevel: "junior" },
      { skillId: "communication", seniorityLevel: "middle" },
      { skillId: "teamwork", seniorityLevel: "middle" },
      { skillId: "problem-solving", seniorityLevel: "junior" },
      { skillId: "adaptability", seniorityLevel: "middle" },
    ],
  },
  {
    id: "user-6",
    name: "Sofia",
    surname: "Blu",
    email: "sofia.blu@bitrock.it",
    role: "Frontend Developer",
    avatar: "/placeholder.svg",
    active: true,
    skills: [
      { skillId: "js", seniorityLevel: "middle" },
      { skillId: "ts", seniorityLevel: "middle" },
      { skillId: "react", seniorityLevel: "middle" },
      { skillId: "vue", seniorityLevel: "junior" },
      { skillId: "nextjs", seniorityLevel: "junior" },
      { skillId: "git", seniorityLevel: "middle" },
      { skillId: "figma", seniorityLevel: "junior" },
      { skillId: "communication", seniorityLevel: "middle" },
      { skillId: "creativity", seniorityLevel: "middle" },
      { skillId: "teamwork", seniorityLevel: "middle" },
    ],
  },
];

// Funzioni di utilità
export const getSkillsCatalog = (): Skill[] => skillsCatalog;

export const getActiveSkillsCatalog = (): Skill[] =>
  skillsCatalog.filter((skill) => skill.active);

export const getEmployeesWithSkills = (): EmployeeWithSkills[] =>
  employeesWithSkills;

export const getEmployeeWithSkillsById = (): EmployeeWithSkills | undefined =>
  employeesWithSkills?.[0];

export const getSkillById = (id: string): Skill | undefined =>
  skillsCatalog.find((skill) => skill.id === id);

export const getSkillsByCategory = (
  category: SkillCategory,
  activeOnly = true,
): Skill[] =>
  skillsCatalog.filter(
    (skill) => skill.category === category && (!activeOnly || skill.active),
  );

export const getHardSkills = (activeOnly = true): Skill[] =>
  getSkillsByCategory("hard", activeOnly);

export const getSoftSkills = (activeOnly = true): Skill[] =>
  getSkillsByCategory("soft", activeOnly);

// Funzione per ottenere le competenze di un dipendente con i dettagli
export const getEmployeeSkillsWithDetails = () => {
  const employee = getEmployeeWithSkillsById();
  if (!employee) return [];

  return employee.skills
    .map((empSkill) => {
      const skill = getSkillById(empSkill.skillId);
      return {
        ...empSkill,
        skill: skill!,
      };
    })
    .filter((empSkill) => empSkill.skill?.active); // Filtra solo le skill attive
};

// Funzione per cercare dipendenti per competenza
export const searchEmployeesBySkill = (
  skillId: string,
  seniorityLevel?: SeniorityLevel,
) => {
  return employeesWithSkills.filter((employee) => {
    const hasSkill = employee.skills.some((empSkill) => {
      if (empSkill.skillId !== skillId) return false;
      if (seniorityLevel && empSkill.seniorityLevel !== seniorityLevel)
        return false;
      return true;
    });
    return hasSkill;
  });
};

// Funzione per ottenere tutte le competenze uniche presenti nei dipendenti
export const getAllEmployeeSkills = (): Skill[] => {
  const skillIds = new Set<string>();
  employeesWithSkills.forEach((employee) => {
    employee.skills.forEach((empSkill) => {
      skillIds.add(empSkill.skillId);
    });
  });

  return Array.from(skillIds)
    .map((skillId) => getSkillById(skillId))
    .filter(Boolean)
    .filter((skill) => skill!.active) as Skill[];
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

// Funzioni per la gestione admin delle skills
export const createSkill = (
  skill: Omit<Skill, "id" | "createdAt" | "updatedAt">,
): Skill => {
  const newSkill: Skill = {
    ...skill,
    id: `skill-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };
  skillsCatalog.push(newSkill);
  return newSkill;
};

export const updateSkill = (
  id: string,
  updates: Partial<Omit<Skill, "id" | "createdAt">>,
): Skill | null => {
  const skillIndex = skillsCatalog.findIndex((skill) => skill.id === id);
  if (skillIndex === -1) return null;

  skillsCatalog[skillIndex] = {
    ...skillsCatalog[skillIndex],
    ...updates,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  return skillsCatalog[skillIndex];
};

export const toggleSkillActive = (id: string): Skill | null => {
  const skill = getSkillById(id);
  if (!skill) return null;

  return updateSkill(id, { active: !skill.active });
};

export const deleteSkill = (id: string): boolean => {
  const skillIndex = skillsCatalog.findIndex((skill) => skill.id === id);
  if (skillIndex === -1) return false;

  // Rimuovi la skill da tutti i dipendenti
  employeesWithSkills.forEach((employee) => {
    employee.skills = employee.skills.filter(
      (empSkill) => empSkill.skillId !== id,
    );
  });

  // Rimuovi la skill dal catalogo
  skillsCatalog.splice(skillIndex, 1);
  return true;
};

// Funzione per formattare il nome della skill con il livello di seniority
export const formatSkillWithSeniority = (
  skillName: string,
  seniorityLevel: SeniorityLevel,
): string => {
  const levelLabel = getSeniorityLevelLabel(seniorityLevel);
  return `${skillName} (${levelLabel})`;
};

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
