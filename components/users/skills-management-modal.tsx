"use client";

import type { FindUserById } from "@/app/server-actions/user/findUserById";
import {
  getSeniorityLevelColor,
  getSeniorityLevelLabel,
  getSkillIcon,
} from "@/components/skills/utils";
import { getSkillColor } from "@/components/skills/color-palette";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeniorityLevel } from "@/db";
import {
  type Skill,
  skillsApi,
  useAddSkillToEmployee,
  useRemoveSkillFromEmployee,
  useSkillsCatalog,
  useUpdateEmployeeSkillLevel,
} from "@/hooks/useSkillsApi";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SkillsManagementModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: FindUserById | null;
  canManageSkills?: boolean;
  onUserUpdate?: () => void | Promise<void>;
};

export default function SkillsManagementModal({
  open,
  onOpenChange,
  user,
  canManageSkills = false,
  onUserUpdate,
}: SkillsManagementModalProps) {
  const router = useRouter();
  const skillsCatalogApi = useSkillsCatalog();
  const addSkillApi = useAddSkillToEmployee();
  const updateSkillLevelApi = useUpdateEmployeeSkillLevel();
  const removeSkillApi = useRemoveSkillFromEmployee();

  const [showAddHardSkillDialog, setShowAddHardSkillDialog] = useState(false);
  const [showAddSoftSkillDialog, setShowAddSoftSkillDialog] = useState(false);
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SeniorityLevel>("junior" as SeniorityLevel);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [updatedSkillId, setUpdatedSkillId] = useState<string | null>(null);
  const [deletingSkillIds, setDeletingSkillIds] = useState<Set<string>>(new Set());
  const [addingSkillIds, setAddingSkillIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      skillsApi.fetchSkillsCatalog(skillsCatalogApi);
    }
  }, [open, skillsCatalogApi]);

  useEffect(() => {
    if (updatedSkillId) {
      const timer = setTimeout(() => {
        setUpdatedSkillId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [updatedSkillId]);

  // Clean up deletingSkillIds when user data updates after deletion
  // Use a small delay to ensure router.refresh() has fully completed
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      const currentSkillIds = new Set(user.user_skill.map((us) => us.skill.id));
      setDeletingSkillIds((prev) => {
        const next = new Set(prev);
        // Remove any skill IDs that are no longer in the user's skills
        // This handles the case where router.refresh() has updated the data
        prev.forEach((skillId) => {
          if (!currentSkillIds.has(skillId)) {
            next.delete(skillId);
          }
        });
        return next;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [user]);

  if (!user) {
    return null;
  }

  const hardSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "hard") ?? [];
  const softSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "soft") ?? [];

  // Competenze disponibili per l'aggiunta (non già presenti e attive)
  const availableHardSkills = skillsCatalogApi.data?.filter(
    (skill: Skill) =>
      skill.active &&
      skill.category === "hard" &&
      !user?.user_skill.some((empSkill) => empSkill.skill.id === skill.id)
  );

  const availableSoftSkills = skillsCatalogApi.data?.filter(
    (skill: Skill) =>
      skill.active &&
      skill.category === "soft" &&
      !user?.user_skill.some((empSkill) => empSkill.skill.id === skill.id)
  );

  const handleAddSkill = async (category: "hard" | "soft") => {
    if (!newSkillId || !user?.id) return;

    // Add to adding set for animation
    setAddingSkillIds((prev) => new Set(prev).add(newSkillId));

    await skillsApi.addSkillToEmployee(addSkillApi, {
      employeeId: user.id,
      skillId: newSkillId,
      seniorityLevel: newSkillLevel,
    });

    router.refresh();
    if (category === "hard") {
      setShowAddHardSkillDialog(false);
    } else {
      setShowAddSoftSkillDialog(false);
    }
    setNewSkillId("");
    setNewSkillLevel("junior" as SeniorityLevel);

    // Refresh skills catalog to update available skills
    await skillsApi.fetchSkillsCatalog(skillsCatalogApi);

    // Remove from adding set after animation completes
    setTimeout(() => {
      setAddingSkillIds((prev) => {
        const next = new Set(prev);
        next.delete(newSkillId);
        return next;
      });
    }, 300);

    // Call user update callback if provided
    if (onUserUpdate) {
      await onUserUpdate();
    }
  };

  const handleUpdateSkillLevel = async (skillId: string, newLevel: SeniorityLevel) => {
    if (!user?.id) return;
    await skillsApi.updateEmployeeSkillLevel(updateSkillLevelApi, {
      employeeId: user.id,
      skillId,
      seniorityLevel: newLevel,
    });
    setUpdatedSkillId(skillId);
    router.refresh();
    setEditingSkillId(null);
    // Call user update callback if provided
    if (onUserUpdate) {
      await onUserUpdate();
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!user?.id) return;

    // Add to deleting set for animation
    setDeletingSkillIds((prev) => new Set(prev).add(skillId));

    // Wait for animation to complete
    setTimeout(async () => {
      await skillsApi.removeSkillFromEmployee(removeSkillApi, {
        employeeId: user.id,
        skillId,
      });

      // Refresh skills catalog after deletion
      await skillsApi.fetchSkillsCatalog(skillsCatalogApi);

      router.refresh();

      // The useEffect hook will clean up deletingSkillIds when user data updates
      // This prevents double animation when router.refresh() causes re-render

      // Call user update callback if provided
      if (onUserUpdate) {
        await onUserUpdate();
      }
    }, 350);
  };

  const handleStartEditing = (skillId: string) => {
    setEditingSkillId(skillId);
  };

  const handleCancelEditing = () => {
    setEditingSkillId(null);
  };

  // Normalize seniority level: convert "middle" from DB to "mid" for API/Select
  const normalizeSeniorityLevel = (level: string): string => {
    if (level === "middle") return "mid";
    return level;
  };

  const handleCloseHardSkillDialog = () => {
    setShowAddHardSkillDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior" as SeniorityLevel);
  };

  const handleCloseSoftSkillDialog = () => {
    setShowAddSoftSkillDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior" as SeniorityLevel);
  };

  const handleHardSkillDialogChange = (open: boolean) => {
    if (!open) {
      handleCloseHardSkillDialog();
    } else {
      setShowAddHardSkillDialog(true);
    }
  };

  const handleSoftSkillDialogChange = (open: boolean) => {
    if (!open) {
      handleCloseSoftSkillDialog();
    } else {
      setShowAddSoftSkillDialog(true);
    }
  };

  const renderSkillItem = (empSkill: (typeof hardSkills)[0], _category: "hard" | "soft") => {
    const SkillIcon = getSkillIcon(empSkill.skill.icon);
    const isEditing = editingSkillId === empSkill.skill.id;
    const isDeleting = deletingSkillIds.has(empSkill.skill.id);
    const isUpdated = updatedSkillId === empSkill.skill.id;
    const isAdding = addingSkillIds.has(empSkill.skill.id);

    if (isDeleting) {
      return null;
    }

    return (
      <motion.div
        key={empSkill.skill.id}
        initial={isAdding ? { opacity: 0, scale: 0.8, x: 20 } : { opacity: 1, scale: 1, x: 0 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-md"
      >
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 flex-shrink-0">
            <SkillIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm sm:text-base truncate">{empSkill.skill.name}</h4>
              <div
                className="h-3 w-3 rounded-md border border-border/50 flex-shrink-0"
                style={{
                  backgroundColor: getSkillColor(empSkill.skill.color, empSkill.skill.category),
                }}
                title={
                  empSkill.skill.color
                    ? "Colore personalizzato"
                    : `Colore predefinito (${empSkill.skill.category === "hard" ? "Blu" : "Arancione"})`
                }
              />
            </div>
            {empSkill.skill.description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {empSkill.skill.description}
              </p>
            )}
          </div>
          {canManageSkills && !isEditing && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {isUpdated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                </motion.div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-6 sm:w-6"
                onClick={() => handleStartEditing(empSkill.skill.id)}
                aria-label={`Modifica livello di ${empSkill.skill.name}`}
                tabIndex={0}
              >
                <Edit2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-6 sm:w-6 text-destructive hover:text-destructive"
                onClick={() => handleRemoveSkill(empSkill.skill.id)}
                aria-label={`Rimuovi ${empSkill.skill.name}`}
                tabIndex={0}
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-2 flex-shrink-0">
          {isEditing && canManageSkills ? (
            <Select
              value={normalizeSeniorityLevel(empSkill.seniorityLevel)}
              onValueChange={(value: SeniorityLevel) => {
                handleUpdateSkillLevel(empSkill.skill.id, value);
              }}
              onOpenChange={(open) => {
                if (!open) {
                  handleCancelEditing();
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge
              className={`text-white text-xs sm:text-sm ${getSeniorityLevelColor(
                empSkill.seniorityLevel
              )}`}
            >
              {getSeniorityLevelLabel(empSkill.seniorityLevel)}
            </Badge>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">Gestisci Competenze</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Gestisci le competenze di {user?.name || "questo utente"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Hard Skills */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Hard Skills</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Competenze tecniche e strumenti
                    </CardDescription>
                  </div>
                  {canManageSkills && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddHardSkillDialog(true)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                      aria-label="Aggiungi hard skill"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Aggiungi</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {hardSkills.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4 text-sm sm:text-base">
                      Nessuna hard skill presente
                    </p>
                  ) : (
                    <AnimatePresence>
                      {hardSkills
                        .filter((empSkill) => !deletingSkillIds.has(empSkill.skill.id))
                        .map((empSkill) => renderSkillItem(empSkill, "hard"))}
                    </AnimatePresence>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Soft Skills</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Competenze trasversali e relazionali
                    </CardDescription>
                  </div>
                  {canManageSkills && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddSoftSkillDialog(true)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                      aria-label="Aggiungi soft skill"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Aggiungi</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {softSkills.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4 text-sm sm:text-base">
                      Nessuna soft skill presente
                    </p>
                  ) : (
                    <AnimatePresence>
                      {softSkills
                        .filter((empSkill) => !deletingSkillIds.has(empSkill.skill.id))
                        .map((empSkill) => renderSkillItem(empSkill, "soft"))}
                    </AnimatePresence>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog per aggiungere Hard Skill */}
      <Dialog open={showAddHardSkillDialog} onOpenChange={handleHardSkillDialogChange}>
        <DialogContent className="w-[95vw] max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Aggiungi Hard Skill</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Seleziona una hard skill e il livello di seniority per {user?.name || "questo utente"}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="newHardSkillId" className="text-sm font-medium">
                Competenza
              </label>
              <Select value={newSkillId} onValueChange={setNewSkillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una hard skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableHardSkills && availableHardSkills.length > 0 ? (
                    availableHardSkills.map((skill) => {
                      const SkillIcon = getSkillIcon(skill.icon);
                      return (
                        <SelectItem key={skill.id} value={skill.id}>
                          <div className="flex items-center space-x-2">
                            <SkillIcon className="h-4 w-4" />
                            <span>{skill.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nessuna hard skill disponibile
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="newHardSkillLevel" className="text-sm font-medium">
                Livello di Seniority
              </label>
              <Select
                value={newSkillLevel}
                onValueChange={(value: SeniorityLevel) => setNewSkillLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCloseHardSkillDialog}
              className="w-full sm:w-auto"
            >
              Annulla
            </Button>
            <Button
              onClick={() => handleAddSkill("hard")}
              disabled={!newSkillId || addSkillApi.loading}
              className="w-full sm:w-auto"
            >
              {addSkillApi.loading ? "Aggiunta..." : "Aggiungi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per aggiungere Soft Skill */}
      <Dialog open={showAddSoftSkillDialog} onOpenChange={handleSoftSkillDialogChange}>
        <DialogContent className="w-[95vw] max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Aggiungi Soft Skill</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Seleziona una soft skill e il livello di seniority per {user?.name || "questo utente"}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="newSoftSkillId" className="text-sm font-medium">
                Competenza
              </label>
              <Select value={newSkillId} onValueChange={setNewSkillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una soft skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableSoftSkills && availableSoftSkills.length > 0 ? (
                    availableSoftSkills.map((skill) => {
                      const SkillIcon = getSkillIcon(skill.icon);
                      return (
                        <SelectItem key={skill.id} value={skill.id}>
                          <div className="flex items-center space-x-2">
                            <SkillIcon className="h-4 w-4" />
                            <span>{skill.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nessuna soft skill disponibile
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="newSoftSkillLevel" className="text-sm font-medium">
                Livello di Seniority
              </label>
              <Select
                value={newSkillLevel}
                onValueChange={(value: SeniorityLevel) => setNewSkillLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCloseSoftSkillDialog}
              className="w-full sm:w-auto"
            >
              Annulla
            </Button>
            <Button
              onClick={() => handleAddSkill("soft")}
              disabled={!newSkillId || addSkillApi.loading}
              className="w-full sm:w-auto"
            >
              {addSkillApi.loading ? "Aggiunta..." : "Aggiungi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
