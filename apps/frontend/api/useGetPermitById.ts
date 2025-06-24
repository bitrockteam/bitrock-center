"use client";
import { db } from "@/config/prisma";
import { permit } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";

export const useGetPermitById = (id: string) => {
  const [permit, setPermit] = useState<permit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(() => {
    "use server";
    if (!id) return;

    setIsLoading(true);

    return db.permit
      .findUnique({
        where: { id },
      })
      .then((data) => setPermit(data))
      .catch((err) => {
        console.error(err);
        setPermit(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { permit, isLoading, refetch };
};
