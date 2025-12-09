import type { Metadata } from "next";
import { fetchUserTimesheetById } from "@/app/server-actions/timesheet/fetchUserTimesheetById";
import { fetchAllWorkItems } from "@/app/server-actions/work-item/fetchAllWorkItems";
import TimeTrackingCalendar from "@/components/time-tracking/time-tracking-calendar";
import TimeTrackingHeader from "@/components/time-tracking/time-tracking-header";
import TimeTrackingTable from "@/components/time-tracking/time-tracking-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Consuntivazione Utente | Bitrock Hours",
  description: "Visualizza le ore lavorate dell'utente",
};

export default async function UserTimesheet({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getUserInfoFromCookie();
  const userTimesheet = await fetchUserTimesheetById(userId);
  const work_items = await fetchAllWorkItems();

  return (
    <div className="space-y-6">
      <TimeTrackingHeader user={user} userTimesheet={userTimesheet} isReadByAdmin />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Tabella</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TimeTrackingTable
            user={user}
            work_items={work_items}
            timesheets={userTimesheet.timesheets}
            isReadOnly
          />
        </TabsContent>
        <TabsContent value="calendar">
          <TimeTrackingCalendar
            user={user}
            work_items={work_items}
            timesheets={userTimesheet.timesheets}
            isReadyOnly
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
