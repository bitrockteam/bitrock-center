import type { Metadata } from "next"
import TimeTrackingHeader from "@/components/time-tracking/time-tracking-header"
import TimeTrackingTable from "@/components/time-tracking/time-tracking-table"
import TimeTrackingCalendar from "@/components/time-tracking/time-tracking-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Consuntivazione | Bitrock Hours",
  description: "Gestione delle ore lavorate",
}

export default function TimeTrackingPage() {
  return (
    <div className="space-y-6">
      <TimeTrackingHeader />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Tabella</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TimeTrackingTable />
        </TabsContent>
        <TabsContent value="calendar">
          <TimeTrackingCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}

