import { getPermitsByReviewer } from "@/app/server-actions/permit/getPermitsByReviewer";
import PermitApprovalTable from "@/components/permits/permit-approval";

export default async function PermitApproval() {
  const permitsByReviewers = await getPermitsByReviewer();
  return (
    <div className="lg:col-span-3">
      <PermitApprovalTable permits={permitsByReviewers} />
    </div>
  );
}
