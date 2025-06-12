"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";

import { useCallback, useEffect, useState } from "react";

export const useGetUsers = () => {
  const [users, setUsers] = useState<
    ({
      allocation: {
        created_at: Date;
        user_id: string;
        project_id: string;
        start_date: Date;
        end_date: Date | null;
        percentage: number;
      }[];
      role: {
        id: string;
        created_at: Date;
        label: string;
      } | null;
    } & {
      id: string;
      name: string;
      created_at: Date;
      email: string;
      avatar_url: string | null;
      role_id: string | null;
    })[]
  >([]);
  const [loading, setLoading] = useState(false);

  const { session } = useAuth();

  const refetch = useCallback(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("params");

    fetch(`${SERVERL_BASE_URL}/users${search ? `?params=${search}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    if (session?.access_token) refetch();
  }, [refetch, session?.access_token]);

  return { users, loading, refetch };
};

export type GetUsers = ReturnType<typeof useGetUsers>["users"][number];
