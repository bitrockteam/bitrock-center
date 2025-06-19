import { usePermissions } from "./usePermissions";

export const useUserPermissions = () => {
  const canAllocateResources = usePermissions("canUserAllocateResources");
  const canDealProjects = usePermissions("canUserDealProjects");
  const isAdminOrSuperAdmin = usePermissions("isAdminOrSuperAdmin");

  return { canAllocateResources, canDealProjects, isAdminOrSuperAdmin };
};
