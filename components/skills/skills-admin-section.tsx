"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { SkillCategory, skill } from "@/db";
import {
  type Skill,
  skillsApi,
  useCreateSkill,
  useDeleteSkill,
  useSkillsCatalog,
  useToggleSkillActive,
  useUpdateSkill,
} from "@/hooks/useSkillsApi";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAvailableIcons, getSkillIcon } from "./utils";
import {
  getAvailableColors,
  getSkillColor,
  defaultCategoryColors,
} from "./color-palette";

export default function SkillsAdminSection() {
  const skillsCatalogApi = useSkillsCatalog();
  const createSkillApi = useCreateSkill();
  const updateSkillApi = useUpdateSkill();
  const deleteSkillApi = useDeleteSkill();
  const toggleSkillActiveApi = useToggleSkillActive();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    SkillCategory | "all"
  >("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<skill | null>(null);

  const availableIcons = useMemo(() => getAvailableIcons(), []);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "hard" as SkillCategory,
    description: "",
    icon: "Code",
    color: null as string | null,
    active: true,
  });

  // Filtra le skills
  const filteredSkills = useMemo(
    () =>
      skillsCatalogApi.data?.filter((skill: Skill) => {
        const matchesSearch = skill.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [skillsCatalogApi.data, searchTerm, selectedCategory]
  );

  const resetForm = () => {
    setFormData({
      name: "",
      category: "hard",
      description: "",
      icon: "Code",
      color: null,
      active: true,
    });
  };

  const handleCreate = async () => {
    const selectedIcon = availableIcons.find(
      (icon) => icon.name === formData.icon
    )?.icon;
    if (!selectedIcon) return;
    await skillsApi.createSkill(createSkillApi, {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      icon: formData.icon,
      color: formData.color || null,
      active: formData.active,
    });
    await skillsApi.fetchSkillsCatalog(skillsCatalogApi);
    setShowCreateDialog(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedSkill) return;
    const selectedIcon = availableIcons.find(
      (icon) => icon.name === formData.icon
    )?.icon;
    if (!selectedIcon) return;

    // Ensure color is null if not set, not undefined
    const colorValue = formData.color ?? null;

    await skillsApi.updateSkill(updateSkillApi, {
      id: selectedSkill.id,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      icon: formData.icon,
      color: colorValue,
      active: formData.active,
    });
    await skillsApi.fetchSkillsCatalog(skillsCatalogApi);
    setShowEditDialog(false);
    setSelectedSkill(null);
    resetForm();
  };

  const handleToggleActive = async (skill: skill) => {
    await skillsApi.toggleSkillActive(
      toggleSkillActiveApi,
      skill.id,
      !skill.active
    );
    await skillsApi.fetchSkillsCatalog(skillsCatalogApi);
  };

  const handleDelete = async () => {
    if (!selectedSkill) return;
    await skillsApi.deleteSkill(deleteSkillApi, selectedSkill.id);
    await skillsApi.fetchSkillsCatalog(skillsCatalogApi);
    setShowDeleteDialog(false);
    setSelectedSkill(null);
  };

  const openEditDialog = (skill: skill) => {
    setSelectedSkill(skill);
    const iconName =
      availableIcons.find(
        (icon) => (icon.icon as unknown as string) === skill.icon
      )?.name || "Code";
    setFormData({
      name: skill.name,
      category: skill.category,
      description: skill.description || "",
      icon: iconName,
      color: skill.color ?? null, // Use ?? to preserve empty string, only convert undefined to null
      active: skill.active,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (skill: skill) => {
    setSelectedSkill(skill);
    setShowDeleteDialog(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to fetch the skills catalog on mount
  useEffect(() => {
    skillsApi.fetchSkillsCatalog(skillsCatalogApi);
  }, []);

  // When category changes, check if current color is still valid for the new category
  useEffect(() => {
    if (formData.color) {
      const availableColors = getAvailableColors(formData.category);
      const isColorInCategory = availableColors.includes(formData.color);
      if (!isColorInCategory) {
        // Color doesn't belong to the new category, clear it
        setFormData((prev) => ({ ...prev, color: null }));
      }
    }
  }, [formData.category, formData.color]);

  // For tab counts and filters
  const allSkills = useMemo(
    () => skillsCatalogApi.data || [],
    [skillsCatalogApi.data]
  );
  const hardSkills = allSkills.filter((s: Skill) => s.category === "hard");
  const softSkills = allSkills.filter((s: Skill) => s.category === "soft");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-colors">
                  <Settings className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                Gestione Competenze
              </CardTitle>
              <CardDescription>
                Amministra il catalogo delle competenze aziendali
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuova Competenza
            </Button>
          </div>

          {/* Filtri */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cerca competenze..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value: SkillCategory | "all") =>
                setSelectedCategory(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                <SelectItem value="hard">Hard Skills</SelectItem>
                <SelectItem value="soft">Soft Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <Tabs
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as SkillCategory | "all")
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="transition-all duration-300">
                Tutte ({allSkills.length})
              </TabsTrigger>
              <TabsTrigger value="hard" className="transition-all duration-300">
                Hard Skills ({hardSkills.length})
              </TabsTrigger>
              <TabsTrigger value="soft" className="transition-all duration-300">
                Soft Skills ({softSkills.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="space-y-2">
                {filteredSkills?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nessuna competenza trovata
                  </div>
                ) : (
                  filteredSkills?.map((skill, index) => {
                    const LucideIcon = getSkillIcon(skill.icon);
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        className={`group/skill border-2 rounded-lg p-4 transition-all duration-300 ${
                          skill.active
                            ? "bg-background hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                            : "bg-muted/50 hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-md ${
                                skill.active ? "bg-primary/10" : "bg-muted"
                              }`}
                            >
                              <LucideIcon
                                className={`h-4 w-4 ${
                                  skill.active
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4
                                  className={`font-medium ${
                                    !skill.active && "text-muted-foreground"
                                  }`}
                                >
                                  {skill.name}
                                </h4>
                                <div
                                  className="h-4 w-4 rounded-md border border-border/50 transition-all duration-200"
                                  style={{
                                    backgroundColor: getSkillColor(
                                      skill.color,
                                      skill.category
                                    ),
                                  }}
                                  title={
                                    skill.color
                                      ? "Colore personalizzato"
                                      : `Colore predefinito (${
                                          skill.category === "hard"
                                            ? "Blu"
                                            : "Arancione"
                                        })`
                                  }
                                />
                                <Badge
                                  variant={
                                    skill.category === "hard"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {skill.category === "hard" ? "Hard" : "Soft"}
                                </Badge>
                                {!skill.active && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-muted-foreground"
                                  >
                                    Disattivata
                                  </Badge>
                                )}
                              </div>
                              {skill.description && (
                                <p
                                  className={`text-sm mt-1 ${
                                    !skill.active && "text-muted-foreground"
                                  }`}
                                >
                                  {skill.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span>
                                  Creata:{" "}
                                  {dayjs(skill.created_at).format("DD/MM/YYYY")}
                                </span>
                                <span>
                                  Aggiornata:{" "}
                                  {dayjs(skill.updated_at).format("DD/MM/YYYY")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="transition-all duration-300 hover:scale-110"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openEditDialog(skill)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifica
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(skill)}
                              >
                                {skill.active ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Disattiva
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Attiva
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(skill)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Elimina
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Creazione */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuova Competenza</DialogTitle>
            <DialogDescription>
              Aggiungi una nuova competenza al catalogo aziendale.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nome della competenza"
              />
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 block">
                Categoria
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: SkillCategory) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hard">Hard Skill</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="icon" className="mb-2 block">
                Icona
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, icon: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableIcons.map((iconOption) => (
                    <SelectItem key={iconOption.name} value={iconOption.name}>
                      <div className="flex items-center space-x-2">
                        <iconOption.icon className="h-4 w-4" />
                        <span>{iconOption.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color" className="mb-2 block">
                Colore
              </Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getAvailableColors(formData.category).map((color) => {
                    const isSelected = formData.color === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            color: isSelected ? null : color,
                          }))
                        }
                        className={`h-8 w-8 rounded-md border-2 transition-all ${
                          isSelected
                            ? "border-foreground scale-110 ring-2 ring-primary"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                        title={
                          isSelected
                            ? "Click to remove color"
                            : "Click to select color"
                        }
                      />
                    );
                  })}
                </div>
                {formData.color ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className="h-4 w-4 rounded border"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span>Colore selezionato</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: null }))
                      }
                      className="h-6 text-xs"
                    >
                      Rimuovi
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className="h-4 w-4 rounded border"
                      style={{
                        backgroundColor:
                          defaultCategoryColors[formData.category],
                      }}
                    />
                    <span>
                      Usa colore predefinito (
                      {formData.category === "hard" ? "Blu" : "Arancione"})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="mb-2 block">
                Descrizione
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descrizione della competenza (opzionale)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name.trim()}>
              Crea Competenza
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifica */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifica Competenza</DialogTitle>
            <DialogDescription>
              Modifica i dettagli della competenza selezionata.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="mb-2 block">
                Nome
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nome della competenza"
              />
            </div>
            <div>
              <Label htmlFor="edit-category" className="mb-2 block">
                Categoria
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: SkillCategory) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hard">Hard Skill</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-icon" className="mb-2 block">
                Icona
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, icon: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableIcons.map((iconOption) => (
                    <SelectItem key={iconOption.name} value={iconOption.name}>
                      <div className="flex items-center space-x-2">
                        <iconOption.icon className="h-4 w-4" />
                        <span>{iconOption.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-color" className="mb-2 block">
                Colore
              </Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getAvailableColors(formData.category).map((color) => {
                    const isSelected = formData.color === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            color: isSelected ? null : color,
                          }))
                        }
                        className={`h-8 w-8 rounded-md border-2 transition-all ${
                          isSelected
                            ? "border-foreground scale-110 ring-2 ring-primary"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                        title={
                          isSelected
                            ? "Click to remove color"
                            : "Click to select color"
                        }
                      />
                    );
                  })}
                </div>
                {formData.color ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className="h-4 w-4 rounded border"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span>Colore selezionato</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: null }))
                      }
                      className="h-6 text-xs"
                    >
                      Rimuovi
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className="h-4 w-4 rounded border"
                      style={{
                        backgroundColor:
                          defaultCategoryColors[formData.category],
                      }}
                    />
                    <span>
                      Usa colore predefinito (
                      {formData.category === "hard" ? "Blu" : "Arancione"})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description" className="mb-2 block">
                Descrizione
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descrizione della competenza (opzionale)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annulla
            </Button>
            <Button onClick={handleEdit} disabled={!formData.name.trim()}>
              Salva Modifiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Eliminazione */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Competenza</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare la competenza \&quot;
              {selectedSkill?.name}
              \&quot;? Questa azione rimuoverà la competenza da tutti i
              dipendenti e non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDelete}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
