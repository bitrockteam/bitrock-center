"use client"

import { motion } from "framer-motion"

export default function LeaveHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold tracking-tight">Ferie e Permessi</h1>
      <p className="text-muted-foreground">Gestisci le tue richieste di ferie e permessi</p>
    </motion.div>
  )
}

