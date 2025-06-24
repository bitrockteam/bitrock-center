"use client";

import { useCallback, useState } from "react";
import { FindUsers, findUsers } from "./server/user/findUsers";

export const useGetUsers = () => {
  const [users, setUsers] = useState<FindUsers[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("params") || undefined;

    findUsers(search)
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, refetch };
};

export type GetUsers = ReturnType<typeof useGetUsers>["users"][number];
