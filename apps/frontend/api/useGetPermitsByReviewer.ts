import { permit } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";
import { getPermitsByReviewer } from "./server/permit/getPermitsByReviewer";

export const useGetPermitsByReviewer = (reviewerId: string) => {
  const [permits, setPermits] = useState<permit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(() => {
    return getPermitsByReviewer({ reviewerId })
      .then(setPermits)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [reviewerId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { permits, isLoading, refetch };
};
