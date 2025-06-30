import ClientDetail from "@/components/client/client-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dettaglio Cliente | Bitrock Hours",
  description: "Visualizza i dettagli del cliente",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <ClientDetail id={id} />
    </div>
  );
}
