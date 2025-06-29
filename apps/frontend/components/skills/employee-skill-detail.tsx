"use client";

import { addSkillToEmployee } from "@/api/server/skills/addSkillToEmployee";
import { EmployeeSkill } from "@/api/server/skills/getEmployeeWithSkillsById";
import { getSkillsCatalog } from "@/api/server/skills/getSkillsCatalog";
import { removeSkillFromEmployee } from "@/api/server/skills/removeSkillFromEmployee";
import { updateEmployeeSkillLevel } from "@/api/server/skills/updateEmployeeSkillLevel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useServerAction } from "@/hooks/useServerAction";
import { formatDisplayName } from "@/services/users/utils";
import { SeniorityLevel } from "@bitrock/db";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getSeniorityLevelColor,
  getSeniorityLevelLabel,
  getSkillIcon,
} from "./utils";

export default function EmployeeSkillDetail({
  employee,
}: {
  employee: EmployeeSkill;
}) {
  const router = useRouter();
  const [skillsCatalog, fetchSkillsCatalog] = useServerAction(getSkillsCatalog);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SeniorityLevel>("junior");
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSkillsCatalog();
  }, [fetchSkillsCatalog]);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Dipendente non trovato</h2>
        <p className="text-muted-foreground mb-4">
          Il dipendente richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/skills")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alle Skills
        </Button>
      </div>
    );
  }

  // Competenze disponibili per l'aggiunta (non già presenti e attive)
  const availableSkills = skillsCatalog?.filter(
    (skill) =>
      !employee.user_skill.some((empSkill) => empSkill.skill_id === skill.id),
  );

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddSkill = async () => {
    if (!newSkillId) return;

    await addSkillToEmployee(employee.id, newSkillId, newSkillLevel);

    router.refresh();
    setShowAddDialog(false);
    setNewSkillId("");
    setNewSkillLevel("junior");
  };

  const handleRemoveSkill = async (skillId: string) => {
    await removeSkillFromEmployee(employee.id, skillId);
    router.refresh();
    setSkillToDelete(null);
  };

  const handleUpdateSkillLevel = async (
    skillId: string,
    newLevel: SeniorityLevel,
  ) => {
    await updateEmployeeSkillLevel(employee.id, skillId, newLevel);
    router.refresh();
  };

  // Raggruppa le competenze per categoria
  const hardSkills = employee.user_skill.filter((empSkill) => {
    return empSkill?.skill.category === "hard" && empSkill.skill?.active;
  });

  const softSkills = employee.user_skill.filter((empSkill) => {
    return empSkill?.skill.category === "soft" && empSkill.skill?.active;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/skills")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={employee.avatar_url || "/placeholder.svg?height=64&width=64"}
            />
            <AvatarFallback>
              <AvatarFallback>
                {formatDisplayName({
                  name: employee.name,
                  initials: true,
                })}
              </AvatarFallback>
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {employee.name}
            </h1>
            <p className="text-muted-foreground">{employee.role}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-muted-foreground">
                {employee.user_skill.length} competenze
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Annulla
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salva
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifica Competenze
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hard Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hard Skills</CardTitle>
                <CardDescription>
                  Competenze tecniche e strumenti
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                  disabled={
                    availableSkills?.filter((s) => s.category === "hard")
                      .length === 0
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
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
                  const { skill } = empSkill;
                  const SkillIcon = getSkillIcon(skill.icon);
                  return skill ? (
                    <div
                      key={empSkill.skill_id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex-1 flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <SkillIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          {skill.description && (
                            <p className="text-sm text-muted-foreground">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <Select
                              value={empSkill.seniorityLevel}
                              onValueChange={(value: SeniorityLevel) =>
                                handleUpdateSkillLevel(empSkill.skill_id, value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="middle">Middle</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSkillToDelete(empSkill.skill_id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        ) : (
                          <Badge
                            className={`text-white ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}
                          >
                            {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : null;
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
                <CardDescription>
                  Competenze trasversali e relazionali
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                  disabled={
                    availableSkills?.filter((s) => s.category === "soft")
                      .length === 0
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
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
                  const { skill } = empSkill;
                  const SkillIcon = getSkillIcon(skill.icon);
                  return skill ? (
                    <div
                      key={empSkill.skill_id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex-1 flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <SkillIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          {skill.description && (
                            <p className="text-sm text-muted-foreground">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <Select
                              value={empSkill.seniorityLevel}
                              onValueChange={(value: SeniorityLevel) =>
                                handleUpdateSkillLevel(empSkill.skill_id, value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="middle">Middle</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSkillToDelete(empSkill.skill_id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        ) : (
                          <Badge
                            className={`text-white ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}
                          >
                            {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog per aggiungere nuova competenza */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Competenza</DialogTitle>
            <DialogDescription>
              Seleziona una competenza e il livello di seniority per{" "}
              {employee.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Competenza</label>
              <Select value={newSkillId} onValueChange={setNewSkillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una competenza" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills?.map((skill) => {
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
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                Livello di Seniority
              </label>
              <Select
                value={newSkillLevel}
                onValueChange={(value: SeniorityLevel) =>
                  setNewSkillLevel(value)
                }
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
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annulla
            </Button>
            <Button onClick={handleAddSkill} disabled={!newSkillId}>
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog di conferma eliminazione */}
      <AlertDialog
        open={!!skillToDelete}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rimuovi Competenza</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler rimuovere questa competenza? Questa azione non
              può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => skillToDelete && handleRemoveSkill(skillToDelete)}
            >
              Rimuovi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
