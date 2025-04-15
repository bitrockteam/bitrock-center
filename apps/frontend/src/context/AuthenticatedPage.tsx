"use client";
import { Loader } from "@/components/custom/Loader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function AuthenticatedPage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { loading, isLogged, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isLogged) navigate("/login");
    else if (isLogged && !user) {
      console.error("User is logged in but no user data found");
      navigate("/register");
    }
  }, [isLogged, loading, user]);

  return (
    <>
      {loading && <Loader />}
      {!loading && isLogged && children}
    </>
  );
}
