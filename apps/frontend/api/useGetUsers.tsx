"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IUser } from "@bitrock/types";
import { useCallback, useEffect, useState } from "react";

export const useGetUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
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
