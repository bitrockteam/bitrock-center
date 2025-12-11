import type { Permissions } from "@/db";

export const useAssignBulkPermissions = () => {
  const assignBulkPermissions = async ({
    user_id,
    permission_ids,
  }: {
    user_id: string;
    permission_ids: Permissions[];
  }) => {
    const response = await fetch("/api/permission/assign-bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, permission_ids }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to assign bulk permissions");
    }
    return data;
  };
  return { assignBulkPermissions };
};
