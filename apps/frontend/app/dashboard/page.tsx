import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSummary from "@/components/dashboard/dashboard-summary"
import HoursChart from "@/components/dashboard/hours-chart"
import RecentRequests from "@/components/dashboard/recent-requests"
import NotificationsCard from "@/components/dashboard/notifications-card"
import CalendarView from "@/components/dashboard/calendar-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Dashboard | Bitrock Hours",
  description: "Panoramica delle ore lavorate, ferie e permessi",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardSummary />

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chart">Grafico</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HoursChart />
            <div className="space-y-6">
              <NotificationsCard />
              <RecentRequests />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

