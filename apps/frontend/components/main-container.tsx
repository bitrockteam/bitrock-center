"use client";

import { useOffline } from "@/hooks/useOffline";
import { tryGetUserInfoFromCookie } from "@/utils/supabase/server";
import { useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "./sidebar";

export default function MainContainer({
  user,
  children,
}: {
  children: React.ReactNode;
  user: Awaited<ReturnType<typeof tryGetUserInfoFromCookie>>;
}) {
  const offline = useOffline();

  useEffect(() => {
    if (offline)
      toast.warning("You are offline. Some features may not be available.", {
        duration: Infinity,
        position: "top-right",
      });
    if (!offline) toast.dismiss();
  }, [offline]);
  return (
    <div className="flex h-screen">
      {user && <Sidebar user={user} />}
      <div className="flex-1 overflow-auto">
        <main className="container py-4 mx-auto px-4 h-full">{children}</main>
      </div>
    </div>
  );
}
