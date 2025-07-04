import PermitApprovalTable from "@/components/permits/permit-approval";
import { getPermitsByReviewer } from "@/server/permit/getPermitsByReviewer";

export default async function PermitApproval() {
  const permitsByReviewers = await getPermitsByReviewer();
  return (
    <div className="lg:col-span-3">
      <PermitApprovalTable permits={permitsByReviewers} />
    </div>
  );
}
