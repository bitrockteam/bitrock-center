"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IUser } from "@bitrock/types";
import { useEffect, useState } from "react";

export const useGetUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const { session } = useAuth();

  useEffect(() => {
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
  }, [session?.access_token]);

  return { users, loading };
};
