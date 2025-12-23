"use client";

import type { FindUserById } from "@/app/server-actions/user/findUserById";
import {
  getSeniorityLevelColor,
  getSeniorityLevelLabel,
  getSkillIcon,
} from "@/components/skills/utils";
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
  useSkillsCatalog,
} from "@/hooks/useSkillsApi";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDetailsSkills({
  user,
  canManageSkills = false,
}: {
  user: FindUserById;
  canManageSkills?: boolean;
}) {
  const router = useRouter();
  const skillsCatalogApi = useSkillsCatalog();
  const addSkillApi = useAddSkillToEmployee();
  const [showAddHardSkillDialog, setShowAddHardSkillDialog] = useState(false);
  const [showAddSoftSkillDialog, setShowAddSoftSkillDialog] = useState(false);
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SeniorityLevel>("junior");

  useEffect(() => {
    skillsApi.fetchSkillsCatalog(skillsCatalogApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setNewSkillLevel("junior");
  };

  const handleOpenHardSkillDialog = () => {
    setShowAddHardSkillDialog(true);
  };

  const handleOpenSoftSkillDialog = () => {
    setShowAddSoftSkillDialog(true);
  };

  const handleCloseHardSkillDialog = () => {
    setShowAddHardSkillDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior");
  };

  const handleCloseSoftSkillDialog = () => {
    setShowAddSoftSkillDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior");
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hard Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hard Skills</CardTitle>
                <CardDescription>Competenze tecniche e strumenti</CardDescription>
              </div>
              {canManageSkills && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenHardSkillDialog}
                  className="flex items-center gap-2"
                  aria-label="Aggiungi hard skill"
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hardSkills.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nessuna hard skill presente
                </p>
              ) : (
                hardSkills.map((empSkill) => {
                  const SkillIcon = getSkillIcon(empSkill.skill.icon);
                  return (
                    <div
                      key={empSkill.skill.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <SkillIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{empSkill.skill.name}</h4>
                          {empSkill.skill.description && (
                            <p className="text-sm text-muted-foreground">
                              {empSkill.skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`text-white ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}
                      >
                        {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Soft Skills</CardTitle>
                <CardDescription>Competenze trasversali e relazionali</CardDescription>
              </div>
              {canManageSkills && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenSoftSkillDialog}
                  className="flex items-center gap-2"
                  aria-label="Aggiungi soft skill"
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {softSkills.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nessuna soft skill presente
                </p>
              ) : (
                softSkills.map((empSkill) => {
                  const SkillIcon = getSkillIcon(empSkill.skill.icon);
                  return (
                    <div
                      key={empSkill.skill.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <SkillIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{empSkill.skill.name}</h4>
                          {empSkill.skill.description && (
                            <p className="text-sm text-muted-foreground">
                              {empSkill.skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`text-white ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}
                      >
                        {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog per aggiungere Hard Skill */}
      <Dialog open={showAddHardSkillDialog} onOpenChange={handleHardSkillDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Hard Skill</DialogTitle>
            <DialogDescription>
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
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseHardSkillDialog}>
              Annulla
            </Button>
            <Button
              onClick={() => handleAddSkill("hard")}
              disabled={!newSkillId || addSkillApi.loading}
            >
              {addSkillApi.loading ? "Aggiunta..." : "Aggiungi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per aggiungere Soft Skill */}
      <Dialog open={showAddSoftSkillDialog} onOpenChange={handleSoftSkillDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Soft Skill</DialogTitle>
            <DialogDescription>
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
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSoftSkillDialog}>
              Annulla
            </Button>
            <Button
              onClick={() => handleAddSkill("soft")}
              disabled={!newSkillId || addSkillApi.loading}
            >
              {addSkillApi.loading ? "Aggiunta..." : "Aggiungi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
