"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SeniorityLevel } from "@/db";
import {
  type EmployeeWithSkills,
  type Skill,
  skillsApi,
  useEmployeesWithSkills,
  useSkillsCatalog,
} from "@/hooks/useSkillsApi";
import type { FindUserById } from "@/app/server-actions/user/findUserById";
import SkillsManagementModal from "@/components/users/skills-management-modal";
import { useApi } from "@/hooks/useApi";
import { formatDisplayName } from "@/services/users/utils";
import { motion } from "framer-motion";
import { Eye, Filter, Search, Settings, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSeniorityLevelLabel, getSkillIcon } from "@/components/skills/utils";
import { getSkillColor } from "@/components/skills/color-palette";

export default function EmployeesSkillsList({
  canManageSkills = false,
}: {
  canManageSkills?: boolean;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSeniorityLevels, setSelectedSeniorityLevels] = useState<SeniorityLevel[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FindUserById | null>(null);

  const employeesApi = useEmployeesWithSkills();
  const skillsCatalogApi = useSkillsCatalog();
  const userApi = useApi<FindUserById>();

  // Filtra i dipendenti in base ai criteri
  const filteredEmployees = useMemo(() => {
    return employeesApi.data?.filter((employee: EmployeeWithSkills) => {
      // Filtro per nome
      const nameMatch = `${employee.name}`.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro per competenze (solo skills attive)
      const skillsMatch =
        selectedSkills.length === 0 ||
        selectedSkills.every((skillId) =>
          employee.user_skill.some((empSkill) => {
            return empSkill.skill.id === skillId && empSkill.skill.active;
          })
        );

      // Filtro per livello di seniority
      const seniorityMatch =
        selectedSeniorityLevels.length === 0 ||
        employee.user_skill.some((empSkill) => {
          const { skill } = empSkill;
          return skill?.active && selectedSeniorityLevels.includes(empSkill.seniorityLevel);
        });

      return nameMatch && skillsMatch && seniorityMatch;
    });
  }, [employeesApi.data, searchTerm, selectedSkills, selectedSeniorityLevels]);

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleSeniorityToggle = (level: SeniorityLevel) => {
    setSelectedSeniorityLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedSeniorityLevels([]);
    setSearchTerm("");
  };

  const hasActiveFilters =
    selectedSkills.length > 0 || selectedSeniorityLevels.length > 0 || searchTerm;

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to fetch the skills catalog and employees with skills on mount
  useEffect(() => {
    skillsApi.fetchSkillsCatalog(skillsCatalogApi);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to fetch the employees with skills on mount
  useEffect(() => {
    skillsApi.fetchEmployeesWithSkills(employeesApi);
  }, []);

  const handleOpenSkillsModal = async (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    // Fetch user data for the modal
    try {
      const userData = await userApi.callApi<FindUserById>(`/api/user/${employeeId}`);
      setSelectedUser(userData);
      setShowSkillsModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSelectedUser(null);
    }
  };

  const handleCloseSkillsModal = () => {
    setShowSkillsModal(false);
    setSelectedEmployeeId(null);
    setSelectedUser(null);
  };

  const handleUserUpdate = async () => {
    if (selectedEmployeeId) {
      try {
        const userData = await userApi.callApi<FindUserById>(`/api/user/${selectedEmployeeId}`);
        if (userData) {
          setSelectedUser(userData);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
    // Also refresh the employees list
    await skillsApi.fetchEmployeesWithSkills(employeesApi);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Dipendenti e Competenze</CardTitle>
              <CardDescription>
                {filteredEmployees?.length} di {employeesApi.data?.length} dipendenti
              </CardDescription>
            </div>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              {/* Ricerca per nome */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cerca dipendenti..."
                  className="w-full pl-8 sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtri */}
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtri
                    {hasActiveFilters && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filtri</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="mr-1 h-3 w-3" />
                          Pulisci
                        </Button>
                      )}
                    </div>

                    {/* Filtro per competenze */}
                    <div>
                      <label htmlFor="skills" className="text-sm font-medium">
                        Competenze
                      </label>
                      <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
                        {skillsCatalogApi.data?.map((skill: Skill) => {
                          const LucideIcon = getSkillIcon(skill.icon);
                          return (
                            <div key={skill.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={skill.id}
                                checked={selectedSkills.includes(skill.id)}
                                onCheckedChange={() => handleSkillToggle(skill.id)}
                              />
                              <label
                                htmlFor={skill.id}
                                className="text-sm font-normal cursor-pointer flex-1 flex items-center gap-2"
                              >
                                <LucideIcon className="h-3 w-3" />
                                {skill.name}
                              </label>
                              <Badge variant="outline" className="text-xs">
                                {skill.category === "hard" ? "Hard" : "Soft"}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filtro per livello di seniority */}
                    <div>
                      <label htmlFor="seniorityLevels" className="text-sm font-medium">
                        Livello di Seniority
                      </label>
                      <div className="mt-2 space-y-2">
                        {(["junior", "middle", "senior"] as SeniorityLevel[]).map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                              id={level}
                              checked={selectedSeniorityLevels.includes(level)}
                              onCheckedChange={() => handleSeniorityToggle(level)}
                            />
                            <label
                              htmlFor={level}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {getSeniorityLevelLabel(level)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filtri attivi */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skillId) => {
                const skill = skillsCatalogApi.data?.find((s: Skill) => s.id === skillId);
                const LucideIcon = getSkillIcon(skill?.icon);
                return skill ? (
                  <Badge
                    key={skillId}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    <LucideIcon className="h-3 w-3" />
                    {skill.name}
                    <Button
                      onClick={() => handleSkillToggle(skillId)}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
              {selectedSeniorityLevels.map((level) => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {getSeniorityLevelLabel(level)}
                  <Button
                    onClick={() => handleSeniorityToggle(level)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-4">
            {filteredEmployees?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nessun dipendente trovato con i criteri selezionati
              </div>
            ) : (
              filteredEmployees?.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="group/employee border-2 rounded-lg p-4 transition-all duration-300 hover:border-primary/50 hover:bg-muted/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        {employee.avatar_url && <AvatarImage src={employee.avatar_url} />}
                        <AvatarFallback>
                          {formatDisplayName({
                            name: employee.name,
                            initials: true,
                          })}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {
                              employee.user_skill.filter((empSkill) => empSkill?.skill.active)
                                .length
                            }{" "}
                            competenze
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canManageSkills && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSkillsModal(employee.id)}
                          className="transition-all duration-300 hover:scale-105"
                          aria-label={`Gestisci competenze di ${employee.name}`}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Competenze
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/utenti/${employee.id}?tab=skills`)}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Dettagli
                      </Button>
                    </div>
                  </div>

                  {/* Lista competenze con nome + seniority integrati */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {employee.user_skill
                        .filter((empSkill) => empSkill.skill.active)
                        .map((empSkill) => {
                          const LucideIcon = getSkillIcon(empSkill.skill.icon);
                          const skillColor = getSkillColor(
                            empSkill.skill.color,
                            empSkill.skill.category
                          );
                          const getStarCount = (level: SeniorityLevel): number => {
                            switch (level) {
                              case "junior":
                                return 1;
                              case "middle":
                                return 2;
                              case "senior":
                                return 3;
                              default:
                                return 1;
                            }
                          };
                          const starCount = getStarCount(empSkill.seniorityLevel);
                          return empSkill.skill ? (
                            <Tooltip key={empSkill.skill.id}>
                              <TooltipTrigger asChild>
                                <Badge
                                  className="text-xs flex items-center gap-1.5 text-white border-0 cursor-default"
                                  style={{
                                    backgroundColor: skillColor,
                                  }}
                                >
                                  <LucideIcon className="h-3 w-3" />
                                  <span>{empSkill.skill.name}</span>
                                  <div className="flex items-center gap-0.5 ml-1">
                                    {Array.from({ length: starCount }).map((_, index) => (
                                      <Star
                                        key={`star-${empSkill.skill.id}-${index}`}
                                        className="h-2.5 w-2.5 fill-white text-white"
                                      />
                                    ))}
                                  </div>
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getSeniorityLevelLabel(empSkill.seniorityLevel)}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : null;
                        })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Skills Management Modal */}
      <SkillsManagementModal
        open={showSkillsModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseSkillsModal();
          } else {
            setShowSkillsModal(true);
          }
        }}
        user={selectedUser}
        canManageSkills={canManageSkills}
        onUserUpdate={handleUserUpdate}
      />
    </motion.div>
  );
}
