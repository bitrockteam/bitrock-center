"use client";

import type { AllocationWithDetails } from "@/app/server-actions/allocation/fetchAllAllocations";
import AddAllocationDialog from "@/components/allocations/add-allocation-dialog";
import AllocationsHeader from "@/components/allocations/allocations-header";
import AllocationsTable from "@/components/allocations/allocations-table";
import EditAllocationDialog from "@/components/allocations/edit-allocation-dialog";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface AllocationsPageClientProps {
  initialAllocations: AllocationWithDetails[];
}

export default function AllocationsPageClient({ initialAllocations }: AllocationsPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [percentageRange, setPercentageRange] = useState<[number, number]>([0, 100]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<AllocationWithDetails | null>(null);

  const {
    data: allocations,
    callApi: fetchAllocations,
    loading: loadingAllocations,
  } = useApi<AllocationWithDetails[]>();
  const { callApi: deleteAllocationApi } = useApi();

  const currentAllocations = allocations || initialAllocations;

  const filteredAllocations = useMemo(() => {
    let filtered = currentAllocations;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((allocation) => {
        const userName = allocation.user.name.toLowerCase();
        const userEmail = allocation.user.email?.toLowerCase() || "";
        const clientName = allocation.work_items.client.name.toLowerCase();
        const workItemTitle = allocation.work_items.title.toLowerCase();
        const projectName = allocation.work_items.project?.name.toLowerCase() || "";

        return (
          userName.includes(query) ||
          userEmail.includes(query) ||
          clientName.includes(query) ||
          workItemTitle.includes(query) ||
          projectName.includes(query)
        );
      });
    }

    if (percentageRange[0] > 0 || percentageRange[1] < 100) {
      filtered = filtered.filter((allocation) => {
        return (
          allocation.percentage >= percentageRange[0] && allocation.percentage <= percentageRange[1]
        );
      });
    }

    return filtered;
  }, [currentAllocations, searchQuery, percentageRange]);

  const handleRefresh = async () => {
    try {
      await fetchAllocations("/api/allocation");
      router.refresh();
    } catch (error) {
      console.error("Error refreshing allocations:", error);
    }
  };

  const handleAddSuccess = async () => {
    await handleRefresh();
  };

  const handleEdit = (allocation: AllocationWithDetails) => {
    setSelectedAllocation(allocation);
    setShowEditDialog(true);
  };

  const handleEditSuccess = async () => {
    setShowEditDialog(false);
    setSelectedAllocation(null);
    await handleRefresh();
  };

  const handleDelete = async (allocation: AllocationWithDetails) => {
    if (
      !confirm(
        `Sei sicuro di voler rimuovere l'allocazione di ${allocation.user.name} dalla commessa ${allocation.work_items.title}?`
      )
    ) {
      return;
    }

    try {
      await deleteAllocationApi(
        `/api/allocation?user_id=${allocation.user_id}&work_item_id=${allocation.work_item_id}`,
        {
          method: "DELETE",
        }
      );

      toast.success("Allocazione rimossa con successo");
      await handleRefresh();
    } catch (error) {
      console.error("Error deleting allocation:", error);
      toast.error("Errore durante la rimozione dell'allocazione");
    }
  };

  return (
    <div className="space-y-6">
      <AllocationsHeader
        onAddClick={() => setShowAddDialog(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        percentageRange={percentageRange}
        onPercentageRangeChange={setPercentageRange}
      />

      <AllocationsTable
        allocations={filteredAllocations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loadingAllocations}
      />

      <AddAllocationDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddSuccess}
      />

      <EditAllocationDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        allocation={selectedAllocation}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
