"use client";

import type { LastestNotification } from "@/app/server-actions/dashboard/fetchLatestNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { use } from "react";

export default function NotificationsCard({
  notificationsData,
}: {
  notificationsData: Promise<LastestNotification[]>;
}) {
  const notifications = use(notificationsData);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative flex flex-row items-center">
          <div className="flex-1">
            <CardTitle>Notifiche</CardTitle>
            <CardDescription>Richieste in attesa di approvazione</CardDescription>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-colors">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            {notifications?.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessuna notifica</p>
            ) : (
              notifications?.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="group/notification flex items-start space-x-4 rounded-md border p-3 transition-all duration-300 hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none group-hover/notification:text-primary transition-colors">
                      {notification.type === "PERMISSION"
                        ? "Richiesta di permesso"
                        : notification.type === "VACATION"
                          ? "Richiesta di ferie"
                          : notification.type === "SICKNESS"
                            ? "Richiesta di malattia"
                            : "Notifica generica"}
                    </p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  {getStatusBadge(notification.status)}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
