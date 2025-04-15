import LeaveHeader from "@/components/leave/leave-header";
import LeaveHistoryTable from "@/components/leave/leave-history-table";
import LeaveRequestForm from "@/components/leave/leave-request-form";

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <LeaveHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LeaveRequestForm />
        </div>
        <div className="lg:col-span-2">
          <LeaveHistoryTable />
        </div>
      </div>
    </div>
  );
}
