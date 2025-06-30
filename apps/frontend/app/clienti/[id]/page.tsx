import ClientDetail from "@/components/client/client-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dettaglio Cliente | Bitrock Hours",
  description: "Visualizza i dettagli del cliente",
};

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <ClientDetail id={params.id} />
    </div>
  );
}
