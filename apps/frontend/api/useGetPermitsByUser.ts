import { permit } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";
import { fetchUserPermits } from "./server/permit/fetchUserPermits";

export const useGetPermitsByUser = () => {
  const [permits, setPermits] = useState<permit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchUserPermits()
      .then(setPermits)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { permits, isLoading, refetch };
};
