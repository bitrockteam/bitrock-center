"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IPermit } from "@bitrock/types"; // Ensure IPermit is defined in your shared types
import { useCallback, useEffect, useState } from "react";

export const useGetPermitById = (id: string) => {
  const [permit, setPermit] = useState<IPermit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const refetch = useCallback(() => {
    if (!id) return;

    setIsLoading(true);

    fetch(`${SERVERL_BASE_URL}/permits/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch permit");
        return res.json();
      })
      .then((data) => setPermit(data))
      .catch((err) => {
        console.error(err);
        setPermit(null);
      })
      .finally(() => setIsLoading(false));
  }, [id, session?.access_token]);

  useEffect(() => {
    if (session?.access_token) refetch();
  }, [refetch, session?.access_token]);

  return { permit, isLoading, refetch };
};
