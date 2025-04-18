import { SERVERL_BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthProvider";
import { IUpdateUser } from "@bitrock/types";
import { useState } from "react";

export const useUpdateUser = () => {
  const { session } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const updateUser = async ({
    id,
    user,
  }: {
    id: string;
    user: IUpdateUser;
  }) => {
    setIsLoading(true);
    const response = await fetch(`${SERVERL_BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(user),
    });
    setIsLoading(false);

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return await response.json();
  };

  return { updateUser, isLoading };
};
