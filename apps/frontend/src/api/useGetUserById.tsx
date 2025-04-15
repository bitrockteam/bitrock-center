import { SERVERL_BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthProvider";
import { IUser } from "@bitrock/types";
import { useCallback, useEffect, useState } from "react";

export function useGetUserById(userId: string) {
  const { session } = useAuth();
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(false);

  const getUserById = useCallback(() => {
    setIsLoading(true);
    fetch(`${SERVERL_BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session?.access_token, userId]);

  useEffect(() => {
    if (!session) return;
    getUserById();
  }, [getUserById, session]);

  return { user, isLoading, refetch: getUserById };
}
