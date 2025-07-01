import WorkItemDetail from "@/components/work-item/work-item-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dettaglio Commessa | Bitrock Hours",
  description: "Visualizza i dettagli della commessa",
};

export default async function WorkItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <WorkItemDetail id={id} />
    </div>
  );
}
