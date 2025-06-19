"use client";
import { allowRoles } from "@/services/users/server.utils";
import { Role } from "@bitrock/db";
import { useEffect, useState } from "react";

type PermissionType =
  | "canUserAllocateResources"
  | "canUserDealProjects"
  | "isAdminOrSuperAdmin";

const PermissionsRoles: Record<PermissionType, Role[]> = {
  canUserAllocateResources: ["Admin", "Key_Client"],
  canUserDealProjects: ["Admin", "Super_Admin"],
  isAdminOrSuperAdmin: ["Admin", "Super_Admin"],
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
