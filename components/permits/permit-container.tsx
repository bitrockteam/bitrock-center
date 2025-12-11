"use client";

import UnifiedPermitsTable from "./unified-permits-table";

export default function PermitContainer({
  canApprovePermit = false,
}: {
  canApprovePermit?: boolean;
}) {
  return <UnifiedPermitsTable canApprovePermit={canApprovePermit} />;
}
