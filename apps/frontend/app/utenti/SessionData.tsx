"use client";

import { useGetProjects } from "@/api/useGetProjects";
import { useGetRoles } from "@/api/useGetRoles";
import { useGetUsers } from "@/api/useGetUsers";
import { IProject, IRole, IUser } from "@bitrock/types";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const SessionDataContext = createContext({
  users: [] as IUser[],
  roles: [] as IRole[],
  projects: [] as IProject[],
  isLoading: false as boolean,
  refetch: () => {},
});

export function SessionDataProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [rolesList, setRolesList] = useState<IRole[]>([]);

  const [projectsList, setProjectsList] = useState<IProject[]>([]);

  const { users, refetch, loading } = useGetUsers();
  const { roles, isLoading: isLoadingRoles } = useGetRoles();
  const { projects, isLoading: isLoadingProjects } = useGetProjects();

  useMemo(() => {
    setUsersList(users);
    setRolesList(roles);
    setProjectsList(projects);
  }, [roles, users, projects]);

  const value = useMemo(
    () => ({
      users: usersList,
      roles: rolesList,
      projects: projectsList,
      isLoading: loading || isLoadingRoles || isLoadingProjects,
      refetch,
    }),
    [
      isLoadingProjects,
      isLoadingRoles,
      loading,
      refetch,
      rolesList,
      usersList,
      projectsList,
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
