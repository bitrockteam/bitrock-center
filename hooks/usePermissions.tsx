"use client";
import { useEffect, useState } from "react";
import type { Role } from "@/db";
import { allowRoles } from "@/services/users/server.utils";

type PermissionType =
  | "canUserEdit"
  | "canUserAllocateResources"
  | "canUserDealProjects"
  | "isAdminOrSuperAdmin";

const PermissionsRoles: Record<PermissionType, Role[]> = {
  canUserAllocateResources: ["Admin", "Key Client"] as Role[],
  canUserDealProjects: ["Admin", "Super Admin"] as Role[],
  isAdminOrSuperAdmin: ["Admin", "Super Admin"] as Role[],
  canUserEdit: ["Admin", "Super Admin"] as Role[],
};

export const usePermissions = (permission: PermissionType) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    console.log("Checking permission:", permission);
    allowRoles(PermissionsRoles[permission])
      .then((result) => {
        setEnabled(result);
      })
      .catch(() => {
        setEnabled(false);
      });
  }, [permission]);

  return {
    enabled,
  };
};
