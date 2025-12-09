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
    >
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex-1">
            <CardTitle>Notifiche</CardTitle>
            <CardDescription>Richieste in attesa di approvazione</CardDescription>
          </div>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
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
                  className="flex items-start space-x-4 rounded-md border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
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
