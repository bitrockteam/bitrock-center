// Tipi per le competenze
export type SkillCategory = "hard" | "soft"
export type SeniorityLevel = "junior" | "middle" | "senior"

export type Skill = {
  id: string
  name: string
  category: SkillCategory
  description?: string
}

export type EmployeeSkill = {
  skillId: string
  seniorityLevel: SeniorityLevel
}

export type EmployeeWithSkills = {
  id: string
  name: string
  surname: string
  email: string
  role: string
  avatar?: string
  active: boolean
  skills: EmployeeSkill[]
}

// Catalogo delle competenze
const skillsCatalog: Skill[] = [
  // Hard Skills - Programming Languages
  { id: "js", name: "JavaScript", category: "hard", description: "Linguaggio di programmazione per web development" },
  { id: "ts", name: "TypeScript", category: "hard", description: "Superset tipizzato di JavaScript" },
  { id: "python", name: "Python", category: "hard", description: "Linguaggio di programmazione versatile" },
  { id: "java", name: "Java", category: "hard", description: "Linguaggio di programmazione orientato agli oggetti" },
  { id: "csharp", name: "C#", category: "hard", description: "Linguaggio di programmazione Microsoft" },
  { id: "php", name: "PHP", category: "hard", description: "Linguaggio per sviluppo web server-side" },
  { id: "go", name: "Go", category: "hard", description: "Linguaggio di programmazione di Google" },
  { id: "rust", name: "Rust", category: "hard", description: "Linguaggio di programmazione systems" },

  // Hard Skills - Frameworks & Libraries
  { id: "react", name: "React", category: "hard", description: "Libreria JavaScript per UI" },
  { id: "vue", name: "Vue.js", category: "hard", description: "Framework JavaScript progressivo" },
  { id: "angular", name: "Angular", category: "hard", description: "Framework TypeScript per applicazioni web" },
  { id: "nextjs", name: "Next.js", category: "hard", description: "Framework React per produzione" },
  { id: "nodejs", name: "Node.js", category: "hard", description: "Runtime JavaScript server-side" },
  { id: "express", name: "Express.js", category: "hard", description: "Framework web per Node.js" },
  { id: "django", name: "Django", category: "hard", description: "Framework web Python" },
  { id: "spring", name: "Spring Boot", category: "hard", description: "Framework Java per applicazioni enterprise" },

  // Hard Skills - Databases
  { id: "mysql", name: "MySQL", category: "hard", description: "Database relazionale open source" },
  { id: "postgresql", name: "PostgreSQL", category: "hard", description: "Database relazionale avanzato" },
  { id: "mongodb", name: "MongoDB", category: "hard", description: "Database NoSQL orientato ai documenti" },
  { id: "redis", name: "Redis", category: "hard", description: "Database in-memory key-value" },
  { id: "elasticsearch", name: "Elasticsearch", category: "hard", description: "Motore di ricerca e analytics" },

  // Hard Skills - Cloud & DevOps
  { id: "aws", name: "Amazon AWS", category: "hard", description: "Piattaforma cloud computing" },
  { id: "azure", name: "Microsoft Azure", category: "hard", description: "Piattaforma cloud Microsoft" },
  { id: "gcp", name: "Google Cloud", category: "hard", description: "Piattaforma cloud Google" },
  { id: "docker", name: "Docker", category: "hard", description: "Piattaforma di containerizzazione" },
  { id: "kubernetes", name: "Kubernetes", category: "hard", description: "Orchestrazione di container" },
  { id: "terraform", name: "Terraform", category: "hard", description: "Infrastructure as Code" },
  { id: "jenkins", name: "Jenkins", category: "hard", description: "Server di automazione CI/CD" },

  // Hard Skills - Tools
  { id: "git", name: "Git", category: "hard", description: "Sistema di controllo versione" },
  { id: "jira", name: "Jira", category: "hard", description: "Tool di project management" },
  { id: "figma", name: "Figma", category: "hard", description: "Tool di design collaborativo" },
  { id: "photoshop", name: "Adobe Photoshop", category: "hard", description: "Software di editing immagini" },

  // Soft Skills
  { id: "communication", name: "Comunicazione", category: "soft", description: "Capacità di comunicare efficacemente" },
  { id: "leadership", name: "Leadership", category: "soft", description: "Capacità di guidare e motivare team" },
  { id: "teamwork", name: "Lavoro di squadra", category: "soft", description: "Collaborazione efficace in team" },
  {
    id: "problem-solving",
    name: "Problem Solving",
    category: "soft",
    description: "Risoluzione creativa dei problemi",
  },
  {
    id: "time-management",
    name: "Gestione del tempo",
    category: "soft",
    description: "Organizzazione e prioritizzazione",
  },
  { id: "adaptability", name: "Adattabilità", category: "soft", description: "Flessibilità ai cambiamenti" },
  {
    id: "critical-thinking",
    name: "Pensiero critico",
    category: "soft",
    description: "Analisi obiettiva e ragionamento",
  },
  { id: "creativity", name: "Creatività", category: "soft", description: "Pensiero innovativo e originale" },
  {
    id: "emotional-intelligence",
    name: "Intelligenza emotiva",
    category: "soft",
    description: "Gestione delle emozioni",
  },
  { id: "negotiation", name: "Negoziazione", category: "soft", description: "Capacità di negoziare e mediare" },
  { id: "presentation", name: "Presentazione", category: "soft", description: "Capacità di presentare efficacemente" },
  { id: "mentoring", name: "Mentoring", category: "soft", description: "Guidare e sviluppare altri" },
]

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
]

// Funzioni di utilità
export const getSkillsCatalog = (): Skill[] => skillsCatalog

export const getEmployeesWithSkills = (): EmployeeWithSkills[] => employeesWithSkills

export const getEmployeeWithSkillsById = (id: string): EmployeeWithSkills | undefined =>
  employeesWithSkills.find((emp) => emp.id === id)

export const getSkillById = (id: string): Skill | undefined => skillsCatalog.find((skill) => skill.id === id)

export const getSkillsByCategory = (category: SkillCategory): Skill[] =>
  skillsCatalog.filter((skill) => skill.category === category)

export const getHardSkills = (): Skill[] => getSkillsByCategory("hard")

export const getSoftSkills = (): Skill[] => getSkillsByCategory("soft")

// Funzione per ottenere le competenze di un dipendente con i dettagli
export const getEmployeeSkillsWithDetails = (employeeId: string) => {
  const employee = getEmployeeWithSkillsById(employeeId)
  if (!employee) return []

  return employee.skills.map((empSkill) => {
    const skill = getSkillById(empSkill.skillId)
    return {
      ...empSkill,
      skill: skill!,
    }
  })
}

// Funzione per cercare dipendenti per competenza
export const searchEmployeesBySkill = (skillId: string, seniorityLevel?: SeniorityLevel) => {
  return employeesWithSkills.filter((employee) => {
    const hasSkill = employee.skills.some((empSkill) => {
      if (empSkill.skillId !== skillId) return false
      if (seniorityLevel && empSkill.seniorityLevel !== seniorityLevel) return false
      return true
    })
    return hasSkill
  })
}

// Funzione per ottenere tutte le competenze uniche presenti nei dipendenti
export const getAllEmployeeSkills = (): Skill[] => {
  const skillIds = new Set<string>()
  employeesWithSkills.forEach((employee) => {
    employee.skills.forEach((empSkill) => {
      skillIds.add(empSkill.skillId)
    })
  })

  return Array.from(skillIds)
    .map((skillId) => getSkillById(skillId))
    .filter(Boolean) as Skill[]
}

export const getSeniorityLevelLabel = (level: SeniorityLevel): string => {
  switch (level) {
    case "junior":
      return "Junior"
    case "middle":
      return "Middle"
    case "senior":
      return "Senior"
    default:
      return level
  }
}

export const getSeniorityLevelColor = (level: SeniorityLevel): string => {
  switch (level) {
    case "junior":
      return "bg-amber-500"
    case "middle":
      return "bg-blue-500"
    case "senior":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}
