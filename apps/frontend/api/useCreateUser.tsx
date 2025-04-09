import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { ICreateUser, IUser } from "@bitrock/types";
import { useState } from "react";

export function useCreateUser() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const createUser = ({ user }: { user: ICreateUser }) => {
    setIsLoading(true);
    return fetch(`${SERVERL_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => data as IUser)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { createUser, isLoading };
}
