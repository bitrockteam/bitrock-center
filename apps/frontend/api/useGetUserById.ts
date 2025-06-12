import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { useCallback, useEffect, useState } from "react";

export function useGetUserById(userId: string) {
  const { session } = useAuth();
  const [user, setUser] = useState<{
    role?:
      | {
          id: string;
          label: string;
        }
      | undefined;
    id: string;
    name: string;
    email: string;
    avatar_url: string | undefined;
  }>();
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

export type GetUserByIdResponse = ReturnType<typeof useGetUserById>["user"];
