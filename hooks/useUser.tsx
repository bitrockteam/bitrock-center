import { user } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { useEffect, useState } from "react";
import { useUserPermissions } from "./useUserPermissions";

export const useUser = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const userInfo = await getUserInfoFromCookie();
      setUser(userInfo);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const permissions = useUserPermissions();

  return {
    user,
    loading,
    permissions,
  };
};
