"use client";

import type { UserTimesheetById } from "@/app/server-actions/timesheet/fetchUserTimesheetById";
import { Button } from "@/components/ui/button";
import type { user } from "@/db";
import { motion } from "framer-motion";
import { Clock, PlusCircle } from "lucide-react";
import { useState } from "react";
import AddHoursDialog from "./add-hours-dialog";

export default function TimeTrackingHeader({
  user,
  isReadByAdmin = false,
  userTimesheet,
}: {
  user: user;
  isReadByAdmin?: boolean;
  userTimesheet?: UserTimesheetById;
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consuntivazione</h1>
          {isReadByAdmin ? (
            <p className="text-muted-foreground">
              Visualizza le ore lavorate per {userTimesheet?.user?.name}
            </p>
          ) : (
            <p className="text-muted-foreground">
              Gestisci le tue ore lavorate
            </p>
          )}
        </div>
      </div>
      {!isReadByAdmin && (
        <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowAddDialog(true)}
              color="primary"
              className="transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi Ore
            </Button>
          </motion.div>

          <AddHoursDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            user={user}
          />
        </>
      )}
    </motion.div>
  );
}
