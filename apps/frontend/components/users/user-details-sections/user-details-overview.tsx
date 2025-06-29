import { GetLatestEmployeeDevelopmentPlan } from "@/api/server/development-plan/getLatestEmployeeDevelopmentPlan";
import { FindUserById } from "@/api/server/user/findUserById";
import { getPlanProgress } from "@/components/development-plan/utils";
import {
  getSeniorityLevelColor,
  getSeniorityLevelLabel,
} from "@/components/skills/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  Award,
  Calendar,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDetailsOverview({
  user,
  plan: activePlan,
}: {
  user: FindUserById;
  plan?: GetLatestEmployeeDevelopmentPlan;
}) {
  const router = useRouter();

  // Raggruppa le competenze per categoria
  const hardSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "hard") ??
    [];
  const softSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "soft") ??
    [];

  const planProgress = activePlan ? getPlanProgress(activePlan) : null;

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
              <span className="text-2xl font-bold">
                {user?.user_skill.length}
              </span>
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
                  <span className="text-lg font-semibold">
                    {planProgress.percentage}%
                  </span>
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
                    onClick={() =>
                      router.push(`/utenti/${user?.id}/development-plan`)
                    }
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
                  <p className="text-sm text-muted-foreground">
                    Nessun piano attivo
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() =>
                    router.push(`/utenti/${user?.id}/development-plan`)
                  }
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
          <CardTitle>Competenze Principali</CardTitle>
          <CardDescription>
            Le competenze più rilevanti del dipendente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hard Skills */}
            <div>
              <h4 className="font-medium mb-3">Hard Skills</h4>
              <div className="space-y-2">
                {hardSkills.slice(0, 5).map((empSkill) => {
                  const SkillIcon =
                    (empSkill.skill?.icon as unknown as LucideIcon) ||
                    (() => <span>🔧</span>);
                  return (
                    <div
                      key={empSkill.skill.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <SkillIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {empSkill.skill.name}
                        </span>
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
                  const SkillIcon =
                    (empSkill.skill?.icon as unknown as LucideIcon) ||
                    (() => <span>🔧</span>);
                  return (
                    <div
                      key={empSkill.skill.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <SkillIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {empSkill.skill.name}
                        </span>
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
    </>
  );
}
