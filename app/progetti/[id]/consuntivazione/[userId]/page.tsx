import { fetchAllProjects } from "@/api/server/project/fetchAllProjects";
import { fetchUserTimesheetById } from "@/api/server/timesheet/fetchUserTimesheetById";
import TimeTrackingCalendar from "@/components/time-tracking/time-tracking-calendar";
import TimeTrackingHeader from "@/components/time-tracking/time-tracking-header";
import TimeTrackingTable from "@/components/time-tracking/time-tracking-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dettaglio Progetto | Bitrock Hours",
  description: "Visualizza i dettagli del progetto",
};

export default async function UserTimesheet({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserInfoFromCookie();
  const userTimesheet = await fetchUserTimesheetById(userId);
  const projects = await fetchAllProjects();

  return (
    <div className="space-y-6">
      <TimeTrackingHeader
        user={user}
        userTimesheet={userTimesheet}
        isReadByAdmin
      />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Tabella</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TimeTrackingTable
            user={user}
            projects={projects}
            timesheets={userTimesheet}
            isReadOnly
          />
        </TabsContent>
        <TabsContent value="calendar">
          <TimeTrackingCalendar
            user={user}
            projects={projects}
            timesheets={userTimesheet}
            isReadyOnly
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
