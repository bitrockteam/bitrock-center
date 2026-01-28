"use client";

import type { AllocationWithDetails } from "@/app/server-actions/allocation/fetchAllAllocations";
import type {
  SaturationAllocation,
  SaturationEmployee,
} from "@/app/server-actions/saturation/fetchSaturationData";
import AddAllocationDialog from "@/components/allocations/add-allocation-dialog";
import EditAllocationDialog from "@/components/allocations/edit-allocation-dialog";
import SaturationHeader from "@/components/saturation/saturation-header";
import SaturationProjections from "@/components/saturation/saturation-projections";
import SaturationSummary from "@/components/saturation/saturation-summary";
import SaturationTimeline from "@/components/saturation/saturation-timeline";
import type { Area } from "@/db";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type SaturationPageClientProps = {
  initialEmployees: SaturationEmployee[];
  canAllocate: boolean;
};

const AREA_OPTIONS = ["FRONT_END", "BACK_END", "OTHER"] as const satisfies readonly Area[];
const SELECTED_AREAS_STORAGE_KEY = "bitrock-center:saturation:selectedAreas";

export function SaturationPageClient({ initialEmployees, canAllocate }: SaturationPageClientProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"summary" | "timeline" | "projections">("summary");
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [groupBy, setGroupBy] = useState<"team" | "seniority" | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<AllocationWithDetails | null>(null);

  const { callApi: deleteAllocationApi } = useApi();

  useEffect(() => {
    const rawSelectedAreas = localStorage.getItem(SELECTED_AREAS_STORAGE_KEY);

    if (!rawSelectedAreas) return;

    const parsed = JSON.parse(rawSelectedAreas) as unknown;
    console.log(parsed);
    if (!Array.isArray(parsed)) return;

    const allowedAreas = new Set<Area>(AREA_OPTIONS);
    const persistedAreas = parsed
      .filter((area): area is Area => typeof area === "string" && allowedAreas.has(area as Area));

    setSelectedAreas(persistedAreas);
  }, []);

  const handleEditAllocation = (employeeId: string, allocation: SaturationAllocation) => {
    const employee = initialEmployees.find((emp) => emp.id === employeeId);
    if (!employee) return;

    // Convert SaturationAllocation to AllocationWithDetails format
    // The dialog only uses a subset of fields, so we create a minimal compatible object
    const allocationForDialog = {
      user_id: employee.id,
      work_item_id: allocation.work_item_id,
      percentage: allocation.percentage,
      start_date: allocation.start_date,
      end_date: allocation.end_date,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        avatar_url: employee.avatar_url,
      },
      work_items: {
        id: allocation.work_item_id,
        title: allocation.work_item_title,
        client: allocation.client,
        project: allocation.project,
      },
    } as AllocationWithDetails;

    setSelectedAllocation(allocationForDialog);
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setSelectedAllocation(null);
    router.refresh();
  };

  const handleDeleteAllocation = async (employeeId: string, allocation: SaturationAllocation) => {
    const employee = initialEmployees.find((emp) => emp.id === employeeId);
    if (!employee) return;

    if (
      !confirm(
        `Sei sicuro di voler rimuovere l'allocazione di ${employee.name} dalla commessa ${allocation.work_item_title}?`
      )
    ) {
      return;
    }

    try {
      await deleteAllocationApi(
        `/api/allocation?user_id=${employee.id}&work_item_id=${allocation.work_item_id}`,
        {
          method: "DELETE",
        }
      );

      toast.success("Allocazione rimossa con successo");
      router.refresh();
    } catch (error) {
      console.error("Error deleting allocation:", error);
      toast.error("Errore durante la rimozione dell'allocazione");
    }
  };

  const handleAddSuccess = () => {
    setShowAddDialog(false);
    router.refresh();
  };

  const filteredEmployees = useMemo(() => {
    let filtered = initialEmployees;

    // Filter by search query (user name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((employee) => {
        const userName = employee.name.toLowerCase();
        const userEmail = employee.email.toLowerCase();
        return userName.includes(query) || userEmail.includes(query);
      });
    }

    // Filter by area
    if (selectedAreas.length > 0) {
      const allowedAreas = new Set<Area>(selectedAreas);
      filtered = filtered.filter((employee) => allowedAreas.has(employee.area));
    }

    return filtered;
  }, [initialEmployees, selectedAreas, searchQuery]);

  return (
    <div className="space-y-6">
      <SaturationHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        showIssuesOnly={showIssuesOnly}
        onShowIssuesOnlyChange={setShowIssuesOnly}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        areaOptions={AREA_OPTIONS}
        selectedAreas={selectedAreas}
        onSelectedAreasChange={(areas) => {
          setSelectedAreas(areas);
          localStorage.setItem(SELECTED_AREAS_STORAGE_KEY, JSON.stringify(areas));
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddAllocationClick={() => setShowAddDialog(true)}
        canAllocate={canAllocate}
      />

      {currentView === "summary" && (
        <SaturationSummary
          employees={filteredEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
          onEditAllocation={canAllocate ? handleEditAllocation : undefined}
          onDeleteAllocation={canAllocate ? handleDeleteAllocation : undefined}
        />
      )}

      {currentView === "timeline" && (
        <SaturationTimeline
          employees={filteredEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}

      {currentView === "projections" && (
        <SaturationProjections
          employees={filteredEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}

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
