"use client"

import { motion } from "framer-motion"
import { getUserData } from "@/lib/mock-data"

export default function DashboardHeader() {
  const userData = getUserData()
  const currentDate = new Date()
  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentDate)

  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Benvenuto, {userData.name}. {capitalizedDate}
      </p>
    </motion.div>
  )
}

