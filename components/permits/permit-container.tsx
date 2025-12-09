"use client";

import { useRef } from "react";
import PermitRequestForm from "./permit-form";
import PermitHistoryTable, { type PermitHistoryTableRef } from "./permit-history-table";

export default function PermitContainer() {
  const historyTableRef = useRef<PermitHistoryTableRef>(null);

  const handlePermitCreated = () => {
    // Refresh the permit history table
    historyTableRef.current?.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <PermitRequestForm onPermitCreated={handlePermitCreated} />
      </div>
      <div className="lg:col-span-2">
        <PermitHistoryTable ref={historyTableRef} />
      </div>
    </div>
  );
}
