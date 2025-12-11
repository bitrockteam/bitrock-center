"use client";
import type { user } from "@/db";
import { getFirstnameAndLastname } from "@/services/users/utils";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { use } from "react";

export function DashboardHeader({ userData }: { userData: Promise<user> }) {
  const user = use(userData);
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentDate);

  // Capitalize first letter
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-3"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Benvenuto, {getFirstnameAndLastname(user?.name).firstName}.{" "}
            {capitalizedDate}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
