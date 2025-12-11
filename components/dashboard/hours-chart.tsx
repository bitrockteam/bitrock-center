"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HoursChart() {
  const [view, setView] = useState("weekly");
  const hoursData = {
    weekly: [
      { label: "Lun", hours: 8 },
      { label: "Mar", hours: 7.5 },
      { label: "Mer", hours: 8 },
      { label: "Gio", hours: 10 },
      { label: "Ven", hours: 8 },
      { label: "Sab", hours: 1 },
      { label: "Dom", hours: 1.5 },
    ],
    monthly: [
      { label: "Sett 1", hours: 38 },
      { label: "Sett 2", hours: 40 },
      { label: "Sett 3", hours: 50 },
      { label: "Sett 4", hours: 42 },
    ],
  };

  // Get data based on selected view
  const chartData = view === "weekly" ? hoursData.weekly : hoursData.monthly;

  // Find the maximum value for scaling
  const maxValue = Math.max(...chartData.map((item) => item.hours));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Distribuzione Ore</CardTitle>
              <CardDescription>Visualizzazione delle ore lavorate</CardDescription>
            </div>
            <Tabs defaultValue="weekly" value={view} onValueChange={setView}>
              <TabsList>
                <TabsTrigger value="weekly">Settimanale</TabsTrigger>
                <TabsTrigger value="monthly">Mensile</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full pb-4">
            <div className="flex h-full items-end gap-2">
              {chartData.map((item, index) => (
                <div key={item.label} className="relative flex w-full flex-col justify-end h-full">
                  <motion.div
                    className="w-full bg-primary rounded-md"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${(item.hours / maxValue) * 100}%`,
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                  <div className="absolute top-[calc(100%+8px)] text-xs left-1/2 -translate-x-1/2">
                    {item.label}
                  </div>
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 text-xs font-medium">
                    {item.hours}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
