import { GetDevelopmentPlan } from "../../api/server/development-plan/getDevelopmentPlanById";

export const getGoalProgress = (
  goal: GetDevelopmentPlan["goal"][number],
): { completed: number; total: number } => {
  const completed = goal.todo_item.filter((todo) => todo.completed).length;
  const total = goal.todo_item.length;
  return { completed, total };
};

export const getGoalStatus = (goal: GetDevelopmentPlan["goal"][number]) => {
  if (!goal.todo_item || goal.todo_item.length === 0) return "not-started";

  return goal.todo_item.every((todo) => todo.completed)
    ? "completed"
    : goal.todo_item.some((todo) => todo.completed)
      ? "in-progress"
      : "not-started";
};

export const getPlanProgress = (
  plan: GetDevelopmentPlan,
): { completed: number; total: number } => {
  if (!plan.goal || plan.goal.length === 0) {
    return { completed: 0, total: 0 };
  }
  const completedGoals = plan.goal.filter(
    (goal) => getGoalStatus(goal) === "completed",
  ).length;
  const totalGoals = plan.goal.length;
  return { completed: completedGoals, total: totalGoals };
};
