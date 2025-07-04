"use client";

import { Button } from "@/components/ui/button";
import { user } from "@/db";
import { UserTimesheetById } from "@/server/timesheet/fetchUserTimesheetById";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddHoursDialog from "./add-hours-dialog";

export default function TimeTrackingHeader({
  user,
  isReadByAdmin = false,
  userTimesheet = [],
}: {
  user: user;
  isReadByAdmin?: boolean;
  userTimesheet?: UserTimesheetById[];
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consuntivazione</h1>
        {isReadByAdmin ? (
          <p className="text-muted-foreground">
            Visualizza le ore lavorate per {userTimesheet[0].user.name}
          </p>
        ) : (
          <p className="text-muted-foreground">Gestisci le tue ore lavorate</p>
        )}
      </div>
      {!isReadByAdmin && (
        <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowAddDialog(true)}>
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
