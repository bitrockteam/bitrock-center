import ClientsHeader from "@/components/client/clients-header";
import ClientsTable from "@/components/client/clients-table";
import type { Metadata } from "next";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clienti | Bitrock Hours",
  description: "Gestione dei clienti aziendali",
};

export default async function ClientsPage() {
  return (
    <div className="space-y-6">
      <ClientsHeader />
      <ClientsTable />
    </div>
  );
}
