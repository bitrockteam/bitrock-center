"use client";

import { useGetProjects } from "@/api/useGetProjects";
import { useGetRoles } from "@/api/useGetRoles";
import { useGetUsers } from "@/api/useGetUsers";
import { IPermit, IProject, IRole, IUser } from "@bitrock/types";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useAuth } from "../(auth)/AuthProvider";
import { useGetPermitsByUser } from "@/api/useGetPermitsByUser";

const SessionDataContext = createContext({
  users: [] as IUser[],
  roles: [] as IRole[],
  projects: [] as IProject[],
  permitsList: [] as IPermit[],
  isLoading: false as boolean,
  refetchUsers: () => {},
  refetchProjects: () => {},
  refetchPermits: () => {},
});

export function SessionDataProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [rolesList, setRolesList] = useState<IRole[]>([]);

  const { user } = useAuth();
  const [projectsList, setProjectsList] = useState<IProject[]>([]);
  const [permitsList, setPermitsList] = useState<IPermit[]>([]);

  const { users, refetch: refetchUsers, loading } = useGetUsers();
  const { roles, isLoading: isLoadingRoles } = useGetRoles();
  const {
    permits,
    isLoading: isPermitsLoading,
    refetch: refetchPermits,
  } = useGetPermitsByUser(user?.id);
  const {
    projects,
    refetch: refetchProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects();

  useMemo(() => {
    setUsersList(users);
    setRolesList(roles);
    setProjectsList(projects);
    setPermitsList(permits);
  }, [roles, users, projects, permits]);

  const value = useMemo(
    () => ({
      users: usersList,
      roles: rolesList,
      projects: projectsList,
      isLoading:
        loading || isLoadingRoles || isLoadingProjects || isPermitsLoading,
      refetchUsers,
      refetchProjects,
      refetchPermits,
      permitsList,
      setPermitsList,
    }),
    [
      isLoadingProjects,
      isLoadingRoles,
      loading,
      refetchUsers,
      refetchProjects,
      refetchPermits,
      rolesList,
      usersList,
      projectsList,
      permitsList,
      isPermitsLoading,
    ],
  );

  return (
    <SessionDataContext.Provider value={value}>
      {children}
    </SessionDataContext.Provider>
  );
}

export const useSessionContext = () => {
  return useContext(SessionDataContext);
};
