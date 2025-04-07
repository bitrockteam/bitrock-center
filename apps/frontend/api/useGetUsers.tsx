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
    fetch(`${SERVERL_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    refetch();
  }, [refetch, session?.access_token]);

  return { users, loading, refetch };
};
