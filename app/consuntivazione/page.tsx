import type { Metadata } from "next";
import { fetchUserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import TimeTrackingCalendar from "@/components/time-tracking/time-tracking-calendar";
import TimeTrackingHeader from "@/components/time-tracking/time-tracking-header";
import TimeTrackingTable from "@/components/time-tracking/time-tracking-table";
import WorkingDaysConfig from "@/components/time-tracking/working-days-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
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
  const CAN_EDIT_WORKING_DAY = await hasPermission(Permissions.CAN_EDIT_WORKING_DAY);

  return (
    <div className="space-y-6">
      <TimeTrackingHeader user={user} />
      <Tabs defaultValue="table" className="w-full">
        <TabsList
          className={`grid w-full max-w-md ${CAN_EDIT_WORKING_DAY ? "grid-cols-3" : "grid-cols-2"}`}
        >
          <TabsTrigger value="table">Tabella</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          {CAN_EDIT_WORKING_DAY && <TabsTrigger value="config">Configurazione Orari</TabsTrigger>}
        </TabsList>
        <TabsContent value="table">
          <TimeTrackingTable user={user} work_items={workItems} timesheets={timesheets} />
        </TabsContent>
        <TabsContent value="calendar">
          <TimeTrackingCalendar user={user} work_items={workItems} timesheets={timesheets} />
        </TabsContent>
        {CAN_EDIT_WORKING_DAY && (
          <TabsContent value="config">
            <WorkingDaysConfig />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
