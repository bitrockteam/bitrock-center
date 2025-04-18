"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotifications } from "@/lib/mock-data"

export default function NotificationsCard() {
  const notifications = getNotifications()

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
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessuna notifica</p>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-4 rounded-md border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  {notification.requiresAction && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

