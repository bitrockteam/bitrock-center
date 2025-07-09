import { fetchUserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import TimeTrackingCalendar from "@/components/time-tracking/time-tracking-calendar";
import TimeTrackingHeader from "@/components/time-tracking/time-tracking-header";
import TimeTrackingTable from "@/components/time-tracking/time-tracking-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { fetchAllWorkItems } from "../server-actions/work-item/fetchAllWorkItems";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Consuntivazione | Bitrock Hours",
  description: "Gestione delle ore lavorate",
};

export default async function TimeTrackingPage() {
  const user = await getUserInfoFromCookie();
  const workItems = await fetchAllWorkItems();
  const timesheets = await fetchUserTimesheet();

  return (
    <div className="space-y-6">
      <TimeTrackingHeader user={user} />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Tabella</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TimeTrackingTable
            user={user}
            work_items={workItems}
            timesheets={timesheets}
          />
        </TabsContent>
        <TabsContent value="calendar">
          <TimeTrackingCalendar
            user={user}
            work_items={workItems}
            timesheets={timesheets}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
