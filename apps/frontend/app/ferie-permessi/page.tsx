import type { Metadata } from "next"
import LeaveHeader from "@/components/leave/leave-header"
import LeaveRequestForm from "@/components/leave/leave-request-form"
import LeaveHistoryTable from "@/components/leave/leave-history-table"

export const metadata: Metadata = {
  title: "Ferie e Permessi | Bitrock Hours",
  description: "Gestione delle richieste di ferie e permessi",
}

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
  )
}

