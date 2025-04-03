import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { ICreateUser, IUser } from "@bitrock/types";

export function useCreateUserProvider() {
  const { session } = useAuth();
  const createUser = ({ user }: { user: ICreateUser }) =>
    fetch(`${SERVERL_BASE_URL}/user/provider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => data as IUser);

  return { createUser };
}
