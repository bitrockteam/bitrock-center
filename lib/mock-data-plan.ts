// Tipi per i dati del piano di progetto
type DayInfo = {
  date: string;
  dayOfWeek: string;
  isWeekend: boolean;
};

type TimelineCell = {
  day: string;
  status: "active" | "weekend" | "critical" | null;
};

type Activity = {
  id: string;
  name: string;
  stream: string;
  bdg: number;
  act: number;
  etc: number;
  eac: number;
  diff: number;
  timeline: TimelineCell[];
};

type Epic = {
  id: string;
  name: string;
  stream: string;
  bdg: number;
  act: number;
  etc: number;
  eac: number;
  diff: number;
  timeline: TimelineCell[];
  activities: Activity[];
};

type ProjectPlan = {
  days: DayInfo[];
  epics: Epic[];
};

// Funzione per generare i giorni del mese corrente e successivo
const generateDays = (): DayInfo[] => {
  const days: DayInfo[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Giorni abbreviati in italiano
  const daysOfWeek = ["L", "M", "M", "G", "V", "S", "D"];

  // Genera giorni per il mese corrente e il successivo
  for (let month = currentMonth; month <= currentMonth; month++) {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, month, day);
      const dayOfWeek = date.getDay(); // 0 = domenica, 1 = lunedì, ...
      const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adatta per avere 0 = lunedì
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      days.push({
        date: `${day.toString().padStart(2, "0")} ${["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"][month]}`,
        dayOfWeek: daysOfWeek[adjustedDayOfWeek],
        isWeekend,
      });
    }
  }

  return days;
};

// Funzione per generare dati di timeline casuali
const generateTimeline = (days: DayInfo[]): TimelineCell[] => {
  const timeline: TimelineCell[] = [];

  days.forEach((day) => {
    // Genera casualmente lo stato della cella
    let status: "active" | "weekend" | "critical" | null = null;

    if (day.isWeekend) {
      // Weekend hanno una probabilità del 30% di essere "weekend"
      status = Math.random() < 0.3 ? "weekend" : null;
    } else {
      // Giorni feriali hanno una probabilità del 40% di essere "active" e 10% di essere "critical"
      const rand = Math.random();
      if (rand < 0.4) {
        status = "active";
      } else if (rand < 0.5) {
        status = "critical";
      }
    }

    timeline.push({
      day: day.date,
      status,
    });
  });

  return timeline;
};

// Dati mock per il piano di progetto
const mockProjectPlans: Record<string, ProjectPlan> = {};

// Funzione per ottenere o generare i dati del piano di progetto
export const getProjectPlanData = (projectId: string): ProjectPlan => {
  // Se i dati sono già stati generati, restituiscili
  if (mockProjectPlans[projectId]) {
    return mockProjectPlans[projectId];
  }

  // Altrimenti, genera nuovi dati
  const days = generateDays();

  // Genera epics e attività
  const epics: Epic[] = [
    {
      id: "epic-1",
      name: "LVFM-32 - Analysis / Meetings",
      stream: "DEV_B",
      bdg: 2.3,
      act: 4.5,
      etc: 0.0,
      eac: 4.5,
      diff: -2.3,
      timeline: generateTimeline(days),
      activities: [
        {
          id: "activity-1-1",
          name: "LVFM-33 UX/UI - mockup",
          stream: "DEV_B",
          bdg: 1.3,
          act: 1.5,
          etc: 0.5,
          eac: 2.0,
          diff: -0.8,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-1-2",
          name: "Task Jira",
          stream: "DEV_B",
          bdg: 0.5,
          act: 1.0,
          etc: 0.0,
          eac: 1.0,
          diff: -0.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-1-3",
          name: "Demo",
          stream: "DEV_B",
          bdg: 0.5,
          act: 2.0,
          etc: 0.0,
          eac: 2.0,
          diff: -1.5,
          timeline: generateTimeline(days),
        },
      ],
    },
    {
      id: "epic-2",
      name: "Technical Setup",
      stream: "DEV_B",
      bdg: 5.0,
      act: 2.0,
      etc: 0.0,
      eac: 2.0,
      diff: 3.0,
      timeline: generateTimeline(days),
      activities: [
        {
          id: "activity-2-1",
          name: "LVFM-13 - Supabase : Setup Local Instance",
          stream: "DEV_B",
          bdg: 0.5,
          act: 0.5,
          etc: 0.0,
          eac: 0.5,
          diff: 0.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-2-2",
          name: "LVFM-14 - NextJs: Initial CleanUp/Setup",
          stream: "DEV_B",
          bdg: 0.5,
          act: 1.0,
          etc: 0.0,
          eac: 1.0,
          diff: -0.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-2-3",
          name: "LVFM-31 UI Theming",
          stream: "DEV_B",
          bdg: 1.0,
          act: 0.5,
          etc: 0.0,
          eac: 0.5,
          diff: 0.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-2-4",
          name: "LVFM-29 - Ingestion of data from AMMAN to our dbs",
          stream: "DEV_F",
          bdg: 2.0,
          act: 0.0,
          etc: 0.0,
          eac: 0.0,
          diff: 2.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-2-5",
          name: "LVFM-38 Supabase: Migration from local to Dev Env",
          stream: "DEV_F",
          bdg: 1.0,
          act: 0.0,
          etc: 0.0,
          eac: 0.0,
          diff: 1.0,
          timeline: generateTimeline(days),
        },
      ],
    },
    {
      id: "epic-3",
      name: "Authentication/Authorization",
      stream: "",
      bdg: 3.5,
      act: 2.0,
      etc: 0.0,
      eac: 2.0,
      diff: 1.5,
      timeline: generateTimeline(days),
      activities: [
        {
          id: "activity-3-1",
          name: "LVFM-15 - Supabase: Integrate Entra ID",
          stream: "",
          bdg: 1.0,
          act: 1.0,
          etc: 0.0,
          eac: 1.0,
          diff: 0.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-3-2",
          name: "LVFM-16 - Auth flow for login",
          stream: "",
          bdg: 2.5,
          act: 1.0,
          etc: 0.0,
          eac: 1.0,
          diff: 1.5,
          timeline: generateTimeline(days),
        },
      ],
    },
    {
      id: "epic-4",
      name: "Booking",
      stream: "",
      bdg: 24.0,
      act: 1.0,
      etc: 3.0,
      eac: 4.0,
      diff: 20.0,
      timeline: generateTimeline(days),
      activities: [
        {
          id: "activity-4-1",
          name: "LVFM-20 - Requests: Approval",
          stream: "DEV_B",
          bdg: 3.0,
          act: 0.0,
          etc: 1.0,
          eac: 1.0,
          diff: 2.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-2",
          name: "LVFM-19 - Requests: Form",
          stream: "DEV_B",
          bdg: 3.0,
          act: 1.0,
          etc: 2.0,
          eac: 3.0,
          diff: 0.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-3",
          name: "LVFM-20 - Requests Approval : Actions",
          stream: "DEV_B",
          bdg: 2.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 1.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-4",
          name: "LVFM-21 - Requests: My Requests",
          stream: "DEV_B",
          bdg: 3.0,
          act: 0.0,
          etc: 1.0,
          eac: 1.0,
          diff: 2.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-5",
          name: "LVFM-40 - Requests: Cancel",
          stream: "DEV_B",
          bdg: 3.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 2.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-6",
          name: "LVFM-39 - Requests: Assign",
          stream: "DEV_B",
          bdg: 3.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 2.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-7",
          name: "LVFM-41 - Requests: Scoped Requests List",
          stream: "DEV_B",
          bdg: 3.0,
          act: 0.0,
          etc: 2.0,
          eac: 2.0,
          diff: 1.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-4-8",
          name: "LVFM-22 - Requests Approval: List",
          stream: "DEV_B",
          bdg: 4.0,
          act: 0.0,
          etc: 1.5,
          eac: 1.5,
          diff: 2.5,
          timeline: generateTimeline(days),
        },
      ],
    },
    {
      id: "epic-5",
      name: "Notifications",
      stream: "",
      bdg: 2.5,
      act: 0.0,
      etc: 1.0,
      eac: 1.0,
      diff: 1.5,
      timeline: generateTimeline(days),
      activities: [
        {
          id: "activity-5-1",
          name: "LVFM-26 - Emails: MEMCO manager Notification",
          stream: "DEV_F",
          bdg: 2.5,
          act: 0.0,
          etc: 1.0,
          eac: 1.0,
          diff: 1.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-5-2",
          name: "LVFM-45 - Emails: Requestor Assignment notification",
          stream: "DEV_F",
          bdg: 0.0,
          act: 0.0,
          etc: 0.0,
          eac: 0.0,
          diff: 0.0,
          timeline: generateTimeline(days),
        },
      ],
    },
    {
      id: "epic-6",
      name: "BackOffice: Master Data Management LV",
      stream: "",
      bdg: 28.0,
      act: 0.0,
      etc: 6.0,
      eac: 6.0,
      diff: 22.0,
      timeline: generateTimeline(days),
      activities: [
        {
          id: "activity-6-1",
          name: "LVFM-18 - Master Data: Vehicle Management List",
          stream: "DEV_F",
          bdg: 3.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 2.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-2",
          name: "LVFM-24 - Master Data: Vehicle Management: Create/Edit",
          stream: "DEV_F",
          bdg: 3.0,
          act: 0.0,
          etc: 1.0,
          eac: 1.0,
          diff: 2.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-3",
          name: "LVFM-57 - Master Data: Vehicle Type Details",
          stream: "DEV_F",
          bdg: 3.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 2.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-4",
          name: "LVFM-23 - Master Data: Areas Create/Edit",
          stream: "DEV2_F",
          bdg: 3.0,
          act: 0.0,
          etc: 1.0,
          eac: 1.0,
          diff: 2.0,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-5",
          name: "LVFM-48 - Master Data: Areas Actions",
          stream: "DEV2_F",
          bdg: 3.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 2.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-6",
          name: "LVFM-56 - Master Data: Area Details",
          stream: "DEV2_F",
          bdg: 3.0,
          act: 0.0,
          etc: 0.3,
          eac: 0.3,
          diff: 2.8,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-7",
          name: "LVFM-17 - Master Data: Areas List",
          stream: "DEV2_F",
          bdg: 3.0,
          act: 0.0,
          etc: 0.3,
          eac: 0.3,
          diff: 2.8,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-8",
          name: "LVFM-49 - Master Data : associate Vehicle Type to Specific Area",
          stream: "DEV_F",
          bdg: 3.0,
          act: 0.0,
          etc: 1.5,
          eac: 1.5,
          diff: 1.5,
          timeline: generateTimeline(days),
        },
        {
          id: "activity-6-9",
          name: "LVFM-25 - Master Data: Vehicle Management Actions",
          stream: "DEV2_F",
          bdg: 4.0,
          act: 0.0,
          etc: 0.5,
          eac: 0.5,
          diff: 3.5,
          timeline: generateTimeline(days),
        },
      ],
    },
    {
      id: "epic-7",
      name: "Chatbot",
      stream: "",
      bdg: 15.0,
      act: 0.0,
      etc: 7.3,
      eac: 7.3,
      diff: 7.8,
      timeline: generateTimeline(days),
      activities: [],
    },
  ];

  // Salva i dati generati
  mockProjectPlans[projectId] = {
    days,
    epics,
  };

  return mockProjectPlans[projectId];
};
