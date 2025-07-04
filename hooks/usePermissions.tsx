"use client";
import { Role } from "@/db";
import { allowRoles } from "@/services/users/server.utils";
import { useEffect, useState } from "react";

type PermissionType =
  | "canUserEdit"
  | "canUserAllocateResources"
  | "canUserDealProjects"
  | "isAdminOrSuperAdmin";

const PermissionsRoles: Record<PermissionType, Role[]> = {
  canUserAllocateResources: ["Admin", "Key_Client"],
  canUserDealProjects: ["Admin", "Super_Admin"],
  isAdminOrSuperAdmin: ["Admin", "Super_Admin"],
  canUserEdit: ["Admin", "Super_Admin"],
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
