"use client";

import { Award, Calendar, Mail, MapPin, Phone, Plus, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { GetLatestEmployeeDevelopmentPlan } from "@/app/server-actions/development-plan/getLatestEmployeeDevelopmentPlan";
import type { FindUserById } from "@/app/server-actions/user/findUserById";
import { getPlanProgress } from "@/components/development-plan/utils";
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
import { Progress } from "@/components/ui/progress";
import type { SeniorityLevel } from "@/db";
import {
  type Skill,
  skillsApi,
  useAddSkillToEmployee,
  useSkillsCatalog,
} from "@/hooks/useSkillsApi";

export default function UserDetailsOverview({
  user,
  plan: activePlan,
}: {
  user: FindUserById;
  plan?: GetLatestEmployeeDevelopmentPlan;
}) {
  const router = useRouter();
  const skillsCatalogApi = useSkillsCatalog();
  const addSkillApi = useAddSkillToEmployee();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SeniorityLevel>("junior");

  useEffect(() => {
    skillsApi.fetchSkillsCatalog(skillsCatalogApi);
  }, [skillsCatalogApi]);

  // Raggruppa le competenze per categoria
  const hardSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "hard") ?? [];
  const softSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "soft") ?? [];

  const planProgress = activePlan ? getPlanProgress(activePlan) : null;

  // Competenze disponibili per l'aggiunta (non già presenti e attive)
  const availableSkills = skillsCatalogApi.data?.filter(
    (skill: Skill) =>
      skill.active && !user?.user_skill.some((empSkill) => empSkill.skill.id === skill.id)
  );

  const handleAddSkill = async () => {
    if (!newSkillId || !user?.id) return;
    await skillsApi.addSkillToEmployee(addSkillApi, {
      employeeId: user.id,
      skillId: newSkillId,
      seniorityLevel: newSkillLevel,
    });
    router.refresh();
    setShowAddDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior");
  };

  const handleOpenDialog = () => {
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior");
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      handleCloseDialog();
    } else {
      setShowAddDialog(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Informazioni personali */}
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Personali</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Assunto il 15 Gen 2023</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Milano, Italia</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">+39 123 456 7890</span>
            </div>
          </CardContent>
        </Card>

        {/* Statistiche competenze */}
        <Card>
          <CardHeader>
            <CardTitle>Competenze</CardTitle>
            <CardDescription>Panoramica delle competenze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Totale competenze</span>
              <span className="text-2xl font-bold">{user?.user_skill.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hard Skills</span>
              <span className="text-lg font-semibold">{hardSkills.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Soft Skills</span>
              <span className="text-lg font-semibold">{softSkills.length}</span>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => router.push(`/skills/${user?.id}`)}
              >
                <Award className="mr-2 h-4 w-4" />
                Visualizza Dettagli
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Development Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Development Plan</CardTitle>
            <CardDescription>Piano di sviluppo professionale</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePlan && planProgress ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-lg font-semibold">{planProgress.percentage}%</span>
                </div>
                <Progress value={planProgress.percentage} className="h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {planProgress.completed} di {planProgress.total} obiettivi
                  </span>
                  <span>Attivo</span>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => router.push(`/utenti/${user?.id}/development-plan`)}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Visualizza Piano
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nessun piano attivo</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/utenti/${user?.id}/development-plan`)}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Crea Piano
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Competenze principali */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Competenze Principali</CardTitle>
              <CardDescription>Le competenze più rilevanti del dipendente</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenDialog}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Aggiungi skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hard Skills */}
            <div>
              <h4 className="font-medium mb-3">Hard Skills</h4>
              <div className="space-y-2">
                {hardSkills.slice(0, 5).map((empSkill) => {
                  const SkillIcon = getSkillIcon(empSkill.skill.icon);
                  return (
                    <div
                      key={empSkill.skill.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <SkillIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{empSkill.skill.name}</span>
                      </div>
                      <Badge
                        className={`text-white text-xs ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}
                      >
                        {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                      </Badge>
                    </div>
                  );
                })}
                {hardSkills.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{hardSkills.length - 5} altre competenze
                  </p>
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h4 className="font-medium mb-3">Soft Skills</h4>
              <div className="space-y-2">
                {softSkills.slice(0, 5).map((empSkill) => {
                  const SkillIcon = getSkillIcon(empSkill.skill.icon);
                  return (
                    <div
                      key={empSkill.skill.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <SkillIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{empSkill.skill.name}</span>
                      </div>
                      <Badge
                        className={`text-white text-xs ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}
                      >
                        {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                      </Badge>
                    </div>
                  );
                })}
                {softSkills.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{softSkills.length - 5} altre competenze
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog per aggiungere nuova competenza */}
      <Dialog open={showAddDialog} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Competenza</DialogTitle>
            <DialogDescription>
              Seleziona una competenza e il livello di seniority per {user?.name || "questo utente"}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="newSkillId" className="text-sm font-medium">
                Competenza
              </label>
              <Select value={newSkillId} onValueChange={setNewSkillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una competenza" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills && availableSkills.length > 0 ? (
                    availableSkills.map((skill) => {
                      const SkillIcon = getSkillIcon(skill.icon);
                      return (
                        <SelectItem key={skill.id} value={skill.id}>
                          <div className="flex items-center space-x-2">
                            <SkillIcon className="h-4 w-4" />
                            <span>{skill.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.category === "hard" ? "Hard" : "Soft"}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nessuna competenza disponibile
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="newSkillLevel" className="text-sm font-medium">
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
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annulla
            </Button>
            <Button onClick={handleAddSkill} disabled={!newSkillId || addSkillApi.loading}>
              {addSkillApi.loading ? "Aggiunta..." : "Aggiungi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
