"use client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function AuthenticatedPage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { loading, isLogged, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLogged) router.push("/login");
    else if (isLogged && !user) {
      console.error("User is logged in but no user data found");
      router.push("/register");
    }
  }, [isLogged, loading, router, user]);

  return (
    <>
      {loading && <Loader />}
      {!loading && isLogged && children}
    </>
  );
}
