"use server";
import { db } from "@/config/prisma";
import type { todo_item } from "@/db";

export async function addTodoGoal(goalId: string, todo: Omit<todo_item, "goal_id" | "id">) {
  return db.todo_item.create({
    data: {
      ...todo,
      completed: false, // Default to not completed
      goal_id: goalId,
    },
  });
}
