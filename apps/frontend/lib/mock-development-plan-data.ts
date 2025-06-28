// Tipi per i piani di sviluppo
export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  todos: TodoItem[];
};

export type DevelopmentPlan = {
  id: string;
  userId: string;
  createdDate: string;
  goals: Goal[];
};

// Dati mock per i piani di sviluppo
const developmentPlans: DevelopmentPlan[] = [
  {
    id: "plan-1",
    userId: "user-1",
    createdDate: "2024-01-15",
    goals: [
      {
        id: "goal-1",
        title: "Migliorare competenze in TypeScript",
        description:
          "Approfondire la conoscenza di TypeScript per scrivere codice più robusto e type-safe",
        todos: [
          {
            id: "todo-1",
            text: "Completare corso avanzato TypeScript",
            completed: true,
          },
          {
            id: "todo-2",
            text: "Implementare un progetto personale in TypeScript",
            completed: true,
          },
          {
            id: "todo-3",
            text: "Studiare design patterns in TypeScript",
            completed: false,
          },
          {
            id: "todo-4",
            text: "Contribuire a progetto open source TypeScript",
            completed: false,
          },
        ],
      },
      {
        id: "goal-2",
        title: "Sviluppare leadership skills",
        description:
          "Migliorare le capacità di leadership per guidare meglio il team",
        todos: [
          {
            id: "todo-5",
            text: "Partecipare a workshop su leadership",
            completed: true,
          },
          {
            id: "todo-6",
            text: "Mentorare un junior developer",
            completed: true,
          },
          {
            id: "todo-7",
            text: "Condurre retrospettive di team",
            completed: true,
          },
        ],
      },
      {
        id: "goal-3",
        title: "Apprendere architetture cloud",
        description:
          "Acquisire competenze su architetture cloud e microservizi",
        todos: [
          {
            id: "todo-8",
            text: "Ottenere certificazione AWS Solutions Architect",
            completed: false,
          },
          {
            id: "todo-9",
            text: "Studiare pattern di microservizi",
            completed: true,
          },
          {
            id: "todo-10",
            text: "Implementare applicazione con architettura cloud-native",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: "plan-2",
    userId: "user-1",
    createdDate: "2023-06-10",
    goals: [
      {
        id: "goal-4",
        title: "Migliorare competenze React",
        description: "Approfondire React e il suo ecosistema",
        todos: [
          {
            id: "todo-11",
            text: "Studiare React Hooks avanzati",
            completed: true,
          },
          {
            id: "todo-12",
            text: "Imparare React Testing Library",
            completed: true,
          },
          {
            id: "todo-13",
            text: "Costruire applicazione con Next.js",
            completed: true,
          },
        ],
      },
      {
        id: "goal-5",
        title: "Sviluppare soft skills",
        description: "Migliorare comunicazione e collaborazione",
        todos: [
          { id: "todo-14", text: "Corso di public speaking", completed: true },
          {
            id: "todo-15",
            text: "Migliorare skills di presentazione",
            completed: true,
          },
        ],
      },
    ],
  },
  {
    id: "plan-3",
    userId: "user-2",
    createdDate: "2024-02-01",
    goals: [
      {
        id: "goal-6",
        title: "Approfondire UX Research",
        description: "Migliorare le competenze di ricerca utente e analisi",
        todos: [
          {
            id: "todo-16",
            text: "Corso su metodologie UX Research",
            completed: true,
          },
          {
            id: "todo-17",
            text: "Condurre 5 interviste utente",
            completed: false,
          },
          {
            id: "todo-18",
            text: "Creare personas basate su dati reali",
            completed: false,
          },
        ],
      },
      {
        id: "goal-7",
        title: "Imparare design systems",
        description: "Creare e mantenere design systems scalabili",
        todos: [
          { id: "todo-19", text: "Studiare atomic design", completed: true },
          {
            id: "todo-20",
            text: "Creare design system per progetto",
            completed: true,
          },
          {
            id: "todo-21",
            text: "Documentare componenti design system",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: "plan-4",
    userId: "user-3",
    createdDate: "2024-01-20",
    goals: [
      {
        id: "goal-8",
        title: "Certificazione Project Management",
        description:
          "Ottenere certificazione PMP per migliorare competenze di PM",
        todos: [
          { id: "todo-22", text: "Studiare PMBOK Guide", completed: true },
          {
            id: "todo-23",
            text: "Completare corso preparatorio PMP",
            completed: true,
          },
          { id: "todo-24", text: "Sostenere esame PMP", completed: false },
        ],
      },
      {
        id: "goal-9",
        title: "Migliorare gestione stakeholder",
        description: "Sviluppare competenze nella gestione degli stakeholder",
        todos: [
          {
            id: "todo-25",
            text: "Workshop su stakeholder management",
            completed: false,
          },
          {
            id: "todo-26",
            text: "Implementare stakeholder analysis su progetto",
            completed: false,
          },
        ],
      },
    ],
  },
];

// Funzioni di utilità
export const getDevelopmentPlansByUserId = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string,
): DevelopmentPlan[] => {
  return developmentPlans.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  );
};

export const getLatestDevelopmentPlan = (
  userId: string,
): DevelopmentPlan | undefined => {
  const plans = getDevelopmentPlansByUserId(userId);
  return plans.length > 0 ? plans[0] : undefined;
};

export const getDevelopmentPlanById = (
  planId: string,
): DevelopmentPlan | undefined => {
  return developmentPlans.find((plan) => plan.id === planId);
};

export const getPreviousDevelopmentPlans = (
  userId: string,
): DevelopmentPlan[] => {
  const plans = getDevelopmentPlansByUserId(userId);
  return plans.slice(1); // Tutti tranne il primo (più recente)
};

// Funzioni per calcolare lo stato dei goal
export const getGoalStatus = (goal: Goal): "completed" | "in-progress" => {
  const allCompleted = goal.todos.every((todo) => todo.completed);
  return allCompleted ? "completed" : "in-progress";
};

export const getGoalProgress = (
  goal: Goal,
): { completed: number; total: number } => {
  const completed = goal.todos.filter((todo) => todo.completed).length;
  const total = goal.todos.length;
  return { completed, total };
};

export const getPlanProgress = (
  plan: DevelopmentPlan,
): { completed: number; total: number } => {
  const completedGoals = plan.goals.filter(
    (goal) => getGoalStatus(goal) === "completed",
  ).length;
  const totalGoals = plan.goals.length;
  return { completed: completedGoals, total: totalGoals };
};

// Funzioni per aggiornare i dati (simulazione)
export const updateTodoStatus = (
  planId: string,
  goalId: string,
  todoId: string,
  completed: boolean,
): boolean => {
  const plan = developmentPlans.find((p) => p.id === planId);
  if (!plan) return false;

  const goal = plan.goals.find((g) => g.id === goalId);
  if (!goal) return false;

  const todo = goal.todos.find((t) => t.id === todoId);
  if (!todo) return false;

  todo.completed = completed;
  return true;
};

export const updateGoal = (
  planId: string,
  goalId: string,
  updates: Partial<Goal>,
): boolean => {
  const plan = developmentPlans.find((p) => p.id === planId);
  if (!plan) return false;

  const goalIndex = plan.goals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) return false;

  plan.goals[goalIndex] = { ...plan.goals[goalIndex], ...updates };
  return true;
};

export const addGoal = (planId: string, goal: Omit<Goal, "id">): boolean => {
  const plan = developmentPlans.find((p) => p.id === planId);
  if (!plan) return false;

  const newGoal: Goal = {
    ...goal,
    id: `goal-${Date.now()}`,
  };

  plan.goals.push(newGoal);
  return true;
};

export const removeGoal = (planId: string, goalId: string): boolean => {
  const plan = developmentPlans.find((p) => p.id === planId);
  if (!plan) return false;

  const goalIndex = plan.goals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) return false;

  plan.goals.splice(goalIndex, 1);
  return true;
};

export const createNewDevelopmentPlan = (userId: string): DevelopmentPlan => {
  const newPlan: DevelopmentPlan = {
    id: `plan-${Date.now()}`,
    userId,
    createdDate: new Date().toISOString().split("T")[0],
    goals: [],
  };

  developmentPlans.push(newPlan);
  return newPlan;
};
