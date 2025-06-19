"use client";
import { useCallback, useEffect, useState } from "react";
import {
  fetchUserReviewers,
  FetchUserReviewersResponse,
} from "./server/permit/fetchUserReviewers";

export const useGetUserReviewers = () => {
  const [reviewers, setReviewers] = useState<FetchUserReviewersResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewers = useCallback(() => {
    try {
      fetchUserReviewers().then((data) => {
        setReviewers(data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }
  }, []);

  useEffect(() => {
    fetchReviewers();
  }, [fetchReviewers]);

  return { reviewers, loading };
};
