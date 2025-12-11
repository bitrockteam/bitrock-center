"use server";
import { db } from "@/config/prisma";

export async function updateTodoStatus(goalId: string, todoId: string, completed: boolean) {
  const updatedTodo = await db.todo_item.update({
    where: {
      id: todoId,
      goal_id: goalId,
      completed: !completed, // Ensure we only update if the status is changing
    },
    data: {
      completed: completed,
    },
  });

  return updatedTodo;
}
