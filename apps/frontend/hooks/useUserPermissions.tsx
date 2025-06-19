import { usePermissions } from "./usePermissions";

export const useUserPermissions = () => {
  const canAllocateResources = usePermissions("canUserAllocateResources");
  const canDealProjects = usePermissions("canUserDealProjects");

  return { canAllocateResources, canDealProjects };
};
