"use client";

import { useGetProjects } from "@/api/useGetProjects";

import { GetUsers, useGetUsers } from "@/api/useGetUsers";

import { useGetPermitsByUser } from "@/api/useGetPermitsByUser";
import { permit, project } from "@bitrock/db";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const SessionDataContext = createContext({
  users: [] as GetUsers[],
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

  const [projectsList, setProjectsList] = useState<project[]>([]);
  const [permitsList, setPermitsList] = useState<permit[]>([]);

  const { users, refetch: refetchUsers, loading } = useGetUsers();

  const {
    permits,
    isLoading: isPermitsLoading,
    refetch: refetchPermits,
  } = useGetPermitsByUser();
  const {
    projects,
    refetch: refetchProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects();

  useMemo(() => {
    setUsersList(users);

    setProjectsList(projects);
    setPermitsList(permits);
  }, [users, projects, permits]);

  const value = useMemo(
    () => ({
      users: usersList,

      projects: projectsList,
      isLoading: loading || isLoadingProjects || isPermitsLoading,
      refetchUsers,
      refetchProjects,
      refetchPermits,
      permitsList,
      setPermitsList,
    }),
    [
      isLoadingProjects,

      loading,
      refetchUsers,
      refetchProjects,
      refetchPermits,

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
