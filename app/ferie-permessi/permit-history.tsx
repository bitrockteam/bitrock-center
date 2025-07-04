import { fetchUserPermits } from "@/app/server-actions/permit/fetchUserPermits";
import PermitHistoryTable from "@/components/permits/permit-history-table";

export default async function PermitHistory() {
  const permits = await fetchUserPermits();

  return <PermitHistoryTable permits={permits} />;
}
