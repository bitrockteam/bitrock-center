import type { user_permission } from "@/db";

export const useAssignPermission = () => {
  const assignPermission = async ({
    user_id,
    permission_id,
  }: Omit<user_permission, "created_at">) => {
    const response = await fetch("/api/permission/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, permission_id }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to assign permission");
    }
    return data;
  };
  return { assignPermission };
};
