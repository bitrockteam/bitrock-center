import { user_permission } from "@/db";

export const useRemovePermission = () => {
  const removePermission = async ({
    user_id,
    permission_id,
  }: Omit<user_permission, "created_at">) => {
    const response = await fetch("/api/permission/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, permission_id }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to remove permission");
    }
    return data;
  };
  return { removePermission };
};
