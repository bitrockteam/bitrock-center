"use client";

import { useRef } from "react";
import ClientsHeader from "@/components/client/clients-header";
import ClientsTable, { type ClientsTableRef } from "@/components/client/clients-table";

interface ClientsPageClientProps {
  canCreateClient: boolean;
  canEditClient: boolean;
}

export default function ClientsPageClient({
  canCreateClient,
  canEditClient,
}: ClientsPageClientProps) {
  const tableRef = useRef<ClientsTableRef>(null);

  const handleClientSuccess = async () => {
    await tableRef.current?.refresh();
  };

  return (
    <div className="space-y-6">
      <ClientsHeader canCreateClient={canCreateClient} onSuccess={handleClientSuccess} />
      <ClientsTable ref={tableRef} canEditClient={canEditClient} />
    </div>
  );
}
