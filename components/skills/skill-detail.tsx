"use client";

import type { SkillWithUsers } from "@/app/server-actions/skills/getSkillById";
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
import { formatDisplayName } from "@/services/users/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getSeniorityLevelColor,
  getSeniorityLevelLabel,
  getSkillIcon,
} from "./utils";

export default function SkillDetail({ skill }: { skill: SkillWithUsers }) {
  const router = useRouter();

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Skill non trovata</h2>
        <p className="text-muted-foreground mb-4">
          La skill richiesta non esiste o è stata rimossa.
        </p>
        <Button onClick={() => router.push("/skills")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alle Skills
        </Button>
      </div>
    );
  }

  const SkillIcon = getSkillIcon(skill.icon);
  const employeesWithSkill = skill.user_skill || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/skills")}
            aria-label="Torna alle skills"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <SkillIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{skill.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={skill.category === "hard" ? "default" : "secondary"}
                >
                  {skill.category === "hard" ? "Hard Skill" : "Soft Skill"}
                </Badge>
                {!skill.active && (
                  <Badge variant="destructive">Non attiva</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Description */}
      {skill.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descrizione</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{skill.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Employees with this skill */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Dipendenti con questa skill</span>
              </CardTitle>
              <CardDescription>
                {employeesWithSkill.length === 0
                  ? "Nessun dipendente possiede questa skill"
                  : `${employeesWithSkill.length} dipendente${
                      employeesWithSkill.length !== 1 ? "i" : ""
                    } possiede${
                      employeesWithSkill.length !== 1 ? "ono" : ""
                    } questa skill`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {employeesWithSkill.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nessun dipendente ha ancora questa skill assegnata.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {employeesWithSkill.map((userSkill) => {
                const employee = userSkill.user;
                const displayName = formatDisplayName({ name: employee.name });
                const initials = formatDisplayName({
                  name: employee.name,
                  initials: true,
                });

                return (
                  <motion.div
                    key={`${userSkill.user_id}-${userSkill.skill_id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar>
                        <AvatarImage
                          src={employee.avatar_url || "/logo.png"}
                          alt={displayName}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{displayName}</h4>
                        {employee.email && (
                          <p className="text-sm text-muted-foreground">
                            {employee.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={`text-white ${getSeniorityLevelColor(
                        userSkill.seniorityLevel
                      )}`}
                    >
                      {getSeniorityLevelLabel(userSkill.seniorityLevel)}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
