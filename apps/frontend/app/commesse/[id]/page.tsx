import WorkItemDetail from "@/components/work-item/work-item-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dettaglio Commessa | Bitrock Hours",
  description: "Visualizza i dettagli della commessa",
};

export default function WorkItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <WorkItemDetail id={params.id} />
    </div>
  );
}
