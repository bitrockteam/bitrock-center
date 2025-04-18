"use client";

import { useGetRoles } from "@/api/useGetRoles";
import { useGetUsers } from "@/api/useGetUsers";
import { IRole, IUser } from "@bitrock/types";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const SessionDataContext = createContext({
  users: [] as IUser[],
  roles: [] as IRole[],
  isLoading: false as boolean,
  refetch: () => {},
});

export function SessionDataProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [rolesList, setRolesList] = useState<IRole[]>([]);

  const { users, refetch, loading } = useGetUsers();
  const { roles, isLoading: isLoadingRoles } = useGetRoles();

  useMemo(() => {
    setUsersList(users);
    setRolesList(roles);
  }, [roles, users]);

  const value = useMemo(
    () => ({
      users: usersList,
      roles: rolesList,
      isLoading: loading || isLoadingRoles,
      refetch,
    }),
    [isLoadingRoles, loading, refetch, rolesList, usersList],
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
