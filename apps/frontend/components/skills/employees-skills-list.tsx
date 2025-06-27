"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X, Eye } from "lucide-react"
import {
  getEmployeesWithSkills,
  getSkillsCatalog,
  getSkillById,
  getSeniorityLevelLabel,
  getSeniorityLevelColor,
  type SeniorityLevel,
} from "@/lib/mock-skills-data"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function EmployeesSkillsList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedSeniorityLevels, setSelectedSeniorityLevels] = useState<SeniorityLevel[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const employees = getEmployeesWithSkills()
  const skillsCatalog = getSkillsCatalog()

  // Filtra i dipendenti in base ai criteri
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Filtro per nome
      const nameMatch = `${employee.name} ${employee.surname}`.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro per competenze
      const skillsMatch =
        selectedSkills.length === 0 ||
        selectedSkills.every((skillId) => employee.skills.some((empSkill) => empSkill.skillId === skillId))

      // Filtro per livello di seniority
      const seniorityMatch =
        selectedSeniorityLevels.length === 0 ||
        employee.skills.some((empSkill) => selectedSeniorityLevels.includes(empSkill.seniorityLevel))

      return nameMatch && skillsMatch && seniorityMatch
    })
  }, [employees, searchTerm, selectedSkills, selectedSeniorityLevels])

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  const handleSeniorityToggle = (level: SeniorityLevel) => {
    setSelectedSeniorityLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedSeniorityLevels([])
    setSearchTerm("")
  }

  const hasActiveFilters = selectedSkills.length > 0 || selectedSeniorityLevels.length > 0 || searchTerm

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Dipendenti e Competenze</CardTitle>
              <CardDescription>
                {filteredEmployees.length} di {employees.length} dipendenti
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
                    {hasActiveFilters && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />}
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
                      <label className="text-sm font-medium">Competenze</label>
                      <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
                        {skillsCatalog.map((skill) => (
                          <div key={skill.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill.id}
                              checked={selectedSkills.includes(skill.id)}
                              onCheckedChange={() => handleSkillToggle(skill.id)}
                            />
                            <label htmlFor={skill.id} className="text-sm font-normal cursor-pointer flex-1">
                              {skill.name}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              {skill.category === "hard" ? "Hard" : "Soft"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filtro per livello di seniority */}
                    <div>
                      <label className="text-sm font-medium">Livello di Seniority</label>
                      <div className="mt-2 space-y-2">
                        {(["junior", "middle", "senior"] as SeniorityLevel[]).map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                              id={level}
                              checked={selectedSeniorityLevels.includes(level)}
                              onCheckedChange={() => handleSeniorityToggle(level)}
                            />
                            <label htmlFor={level} className="text-sm font-normal cursor-pointer flex-1">
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
                const skill = getSkillById(skillId)
                return skill ? (
                  <Badge key={skillId} variant="secondary" className="text-xs">
                    {skill.name}
                    <button onClick={() => handleSkillToggle(skillId)} className="ml-1 hover:bg-muted rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null
              })}
              {selectedSeniorityLevels.map((level) => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {getSeniorityLevelLabel(level)}
                  <button onClick={() => handleSeniorityToggle(level)} className="ml-1 hover:bg-muted rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nessun dipendente trovato con i criteri selezionati
              </div>
            ) : (
              filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar || "/placeholder.svg?height=48&width=48"} />
                        <AvatarFallback>
                          {employee.name.charAt(0)}
                          {employee.surname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {employee.name} {employee.surname}
                        </h3>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={employee.active ? "outline" : "secondary"}
                            className={employee.active ? "border-green-500 text-green-500" : ""}
                          >
                            {employee.active ? "Attivo" : "Inattivo"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{employee.skills.length} competenze</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/skills/${employee.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Dettagli
                    </Button>
                  </div>

                  {/* Lista competenze */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((empSkill) => {
                        const skill = getSkillById(empSkill.skillId)
                        return skill ? (
                          <div key={empSkill.skillId} className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                            <Badge className={`text-xs text-white ${getSeniorityLevelColor(empSkill.seniorityLevel)}`}>
                              {getSeniorityLevelLabel(empSkill.seniorityLevel)}
                            </Badge>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
