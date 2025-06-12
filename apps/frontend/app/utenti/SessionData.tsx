"use client";

import { useGetProjects } from "@/api/useGetProjects";
import { useGetRoles } from "@/api/useGetRoles";
import { GetUsers, useGetUsers } from "@/api/useGetUsers";

import { useGetPermitsByUser } from "@/api/useGetPermitsByUser";
import { permit, project, role } from "@bitrock/db";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useAuth } from "../(auth)/AuthProvider";

const SessionDataContext = createContext({
  users: [] as GetUsers[],
  roles: [] as role[],
  projects: [] as project[],
  permitsList: [] as permit[],
  isLoading: false as boolean,
  refetchUsers: () => {},
  refetchProjects: () => {},
  refetchPermits: () => {},
});

export function SessionDataProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [usersList, setUsersList] = useState<GetUsers[]>([]);
  const [rolesList, setRolesList] = useState<role[]>([]);

  const { user } = useAuth();
  const [projectsList, setProjectsList] = useState<project[]>([]);
  const [permitsList, setPermitsList] = useState<permit[]>([]);

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
