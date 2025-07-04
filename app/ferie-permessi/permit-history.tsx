import PermitHistoryTable from "@/components/permits/permit-history-table";
import { fetchUserPermits } from "@/server/permit/fetchUserPermits";

export default async function PermitHistory() {
  const permits = await fetchUserPermits();

  return <PermitHistoryTable permits={permits} />;
}
