const userData = {
  id: "user-1",
  name: "Marco",
  surname: "Rossi",
  email: "marco.rossi@bitrock.it",
  role: "developer",
  avatar: "/placeholder.svg",
  active: true,
  phone: "+39 123 456 7890",
  projects: ["project-1", "project-2", "project-3"],
};

// Mock users data
const users = [
  userData,
  {
    id: "user-2",
    name: "Laura",
    surname: "Bianchi",
    email: "laura.bianchi@bitrock.it",
    role: "designer",
    avatar: "/placeholder.svg",
    active: true,
    phone: "+39 234 567 8901",
    projects: ["project-1", "project-4"],
  },
  {
    id: "user-3",
    name: "Giovanni",
    surname: "Verdi",
    email: "giovanni.verdi@bitrock.it",
    role: "manager",
    avatar: "/placeholder.svg",
    active: true,
    phone: "+39 345 678 9012",
    projects: ["project-1", "project-2", "project-3", "project-4", "project-5"],
  },
  {
    id: "user-4",
    name: "Francesca",
    surname: "Neri",
    email: "francesca.neri@bitrock.it",
    role: "admin",
    avatar: "/placeholder.svg",
    active: true,
    phone: "+39 456 789 0123",
    projects: [],
  },
  {
    id: "user-5",
    name: "Alessandro",
    surname: "Gialli",
    email: "alessandro.gialli@bitrock.it",
    role: "developer",
    avatar: "/placeholder.svg",
    active: false,
    phone: "+39 567 890 1234",
    projects: ["project-2", "project-5"],
  },
];

// Mock user summary data
const userSummary = {
  hoursWorked: 120,
  vacationDaysLeft: 15,
  vacationDaysTotal: 25,
  activeProjects: 3,
  totalProjects: 5,
  pendingRequests: 2,
};

// Mock hours data
const hoursData = {
  weekly: [
    { label: "Lun", hours: 8 },
    { label: "Mar", hours: 7.5 },
    { label: "Mer", hours: 8 },
    { label: "Gio", hours: 10 },
    { label: "Ven", hours: 8 },
    { label: "Sab", hours: 1 },
    { label: "Dom", hours: 1.5 },
  ],
  monthly: [
    { label: "Sett 1", hours: 38 },
    { label: "Sett 2", hours: 40 },
    { label: "Sett 3", hours: 50 },
    { label: "Sett 4", hours: 42 },
  ],
};

// Mock notifications
const notifications = [
  {
    title: "Richiesta ferie in attesa",
    description:
      "La tua richiesta ferie dal 15/08 al 22/08 è in attesa di approvazione",
    requiresAction: false,
  },
  {
    title: "Approvazione richiesta",
    description: "Devi approvare la richiesta di permesso di Laura Bianchi",
    requiresAction: true,
  },
];

// Mock recent requests
const recentRequests = [
  {
    type: "Ferie",
    period: "15/08/2023 - 22/08/2023",
    status: "pending",
  },
  {
    type: "Permesso",
    period: "05/07/2023",
    status: "approved",
  },
  {
    type: "Malattia",
    period: "20/06/2023 - 22/06/2023",
    status: "approved",
  },
];

// Mock projects
const projects = [
  { id: "project-1", name: "Progetto Alpha" },
  { id: "project-2", name: "Progetto Beta" },
  { id: "project-3", name: "Progetto Gamma" },
  { id: "project-4", name: "Progetto Delta" },
  { id: "project-5", name: "Progetto Epsilon" },
];

// Mock detailed projects
const projectsDetailed = [
  {
    id: "project-1",
    name: "Progetto Alpha",
    client: "Cliente A",
    description:
      "Sviluppo di una piattaforma di e-commerce con funzionalità avanzate di gestione inventario e analisi delle vendite.",
    status: "active",
    startDate: "2023-01-15",
    endDate: "2023-12-31",
    team: [
      {
        id: "user-1",
        name: "Marco",
        surname: "Rossi",
        role: "developer",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-2",
        name: "Laura",
        surname: "Bianchi",
        role: "designer",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-3",
        name: "Giovanni",
        surname: "Verdi",
        role: "manager",
        avatar: "/placeholder.svg",
      },
    ],
  },
  {
    id: "project-2",
    name: "Progetto Beta",
    client: "Cliente B",
    description:
      "Implementazione di un sistema di gestione documentale con workflow approvativo e integrazione con sistemi esterni.",
    status: "active",
    startDate: "2023-03-10",
    endDate: null,
    team: [
      {
        id: "user-1",
        name: "Marco",
        surname: "Rossi",
        role: "developer",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-3",
        name: "Giovanni",
        surname: "Verdi",
        role: "manager",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-5",
        name: "Alessandro",
        surname: "Gialli",
        role: "developer",
        avatar: "/placeholder.svg",
      },
    ],
  },
  {
    id: "project-3",
    name: "Progetto Gamma",
    client: "Cliente C",
    description:
      "Sviluppo di un'applicazione mobile per la gestione delle presenze e delle attività aziendali.",
    status: "on-hold",
    startDate: "2023-02-01",
    endDate: null,
    team: [
      {
        id: "user-1",
        name: "Marco",
        surname: "Rossi",
        role: "developer",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-3",
        name: "Giovanni",
        surname: "Verdi",
        role: "manager",
        avatar: "/placeholder.svg",
      },
    ],
  },
  {
    id: "project-4",
    name: "Progetto Delta",
    client: "Cliente D",
    description:
      "Realizzazione di un portale web per la gestione delle risorse umane con funzionalità di reportistica avanzata.",
    status: "completed",
    startDate: "2022-11-01",
    endDate: "2023-05-30",
    team: [
      {
        id: "user-2",
        name: "Laura",
        surname: "Bianchi",
        role: "designer",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-3",
        name: "Giovanni",
        surname: "Verdi",
        role: "manager",
        avatar: "/placeholder.svg",
      },
    ],
  },
  {
    id: "project-5",
    name: "Progetto Epsilon",
    client: "Cliente E",
    description:
      "Sviluppo di un sistema di business intelligence per l'analisi dei dati aziendali.",
    status: "planned",
    startDate: "2023-09-01",
    endDate: null,
    team: [
      {
        id: "user-3",
        name: "Giovanni",
        surname: "Verdi",
        role: "manager",
        avatar: "/placeholder.svg",
      },
      {
        id: "user-5",
        name: "Alessandro",
        surname: "Gialli",
        role: "developer",
        avatar: "/placeholder.svg",
      },
    ],
  },
];

// Mock time entries - Aggiornati per includere date recenti
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const timeEntries = [
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-10`,
    project: "project-1",
    hours: 8,
    description: "Sviluppo frontend dashboard",
    status: "approved",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-11`,
    project: "project-1",
    hours: 7.5,
    description: "Implementazione API",
    status: "approved",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-12`,
    project: "project-2",
    hours: 8,
    description: "Meeting e pianificazione sprint",
    status: "approved",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-13`,
    project: "project-2",
    hours: 6,
    description: "Debugging e fix",
    status: "pending",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-14`,
    project: "project-3",
    hours: 8,
    description: "Sviluppo nuove funzionalità",
    status: "pending",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-10`,
    project: "project-1",
    hours: 7,
    description: "Design UI componenti",
    status: "approved",
    user: {
      id: "user-2",
      name: "Laura",
      surname: "Bianchi",
      avatar: "/placeholder.svg",
    },
  },
  {
    date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-11`,
    project: "project-4",
    hours: 8,
    description: "Revisione design sistema",
    status: "approved",
    user: {
      id: "user-2",
      name: "Laura",
      surname: "Bianchi",
      avatar: "/placeholder.svg",
    },
  },
];

// Mock leave requests - Aggiornati per includere date recenti
const leaveRequests = [
  {
    type: "vacation",
    period: `15/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear} - 22/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear}`,
    days: 5,
    reason: "Vacanza estiva",
    status: "pending",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    type: "permission",
    period: `05/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear}`,
    days: 1,
    reason: "Visita medica",
    status: "approved",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    type: "sickness",
    period: `20/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear} - 22/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear}`,
    days: 3,
    reason: "Influenza",
    status: "approved",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    type: "vacation",
    period: `10/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear} - 14/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear}`,
    days: 5,
    reason: "Vacanza",
    status: "approved",
    user: {
      id: "user-1",
      name: "Marco",
      surname: "Rossi",
      avatar: "/placeholder.svg",
    },
  },
  {
    type: "permission",
    period: `08/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear}`,
    days: 1,
    reason: "Motivi personali",
    status: "approved",
    user: {
      id: "user-2",
      name: "Laura",
      surname: "Bianchi",
      avatar: "/placeholder.svg",
    },
  },
];

// Export functions to get mock data
export const getUserData = () => userData;
export const getUserSummary = () => userSummary;
export const getHoursData = () => hoursData;
export const getNotifications = () => notifications;
export const getRecentRequests = () => recentRequests;
export const getProjects = () => projects;
export const getTimeEntries = () => timeEntries;
export const getLeaveRequests = () => leaveRequests;

// New functions for detailed data
export const getProjectsDetailed = () => projectsDetailed;
export const getUserById = (id: string) => users.find((user) => user.id === id);
export const getProjectById = (id: string) =>
  projectsDetailed.find((project) => project.id === id);

// Functions to get related data
export const getTimeEntriesByProject = (projectId: string) => {
  return timeEntries
    .filter((entry) => entry.project === projectId)
    .map((entry) => ({
      ...entry,
      project: projects.find((p) => p.id === entry.project) || {
        id: entry.project,
        name: entry.project,
      },
    }));
};

export const getTimeEntriesByUser = (userId: string) => {
  return timeEntries
    .filter((entry) => entry.user.id === userId)
    .map((entry) => ({
      ...entry,
      project: projects.find((p) => p.id === entry.project) || {
        id: entry.project,
        name: entry.project,
      },
    }));
};

export const getLeaveRequestsByUser = (userId: string) => {
  return leaveRequests.filter((request) => request.user.id === userId);
};

export const getProjectsByUser = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (!user || !user.projects) return [];

  return user.projects
    .map((projectId) => projectsDetailed.find((p) => p.id === projectId))
    .filter(Boolean) as typeof projectsDetailed;
};
