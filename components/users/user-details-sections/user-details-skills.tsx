import { FindUserById } from "@/app/server-actions/user/findUserById";
import {
  getSeniorityLevelColor,
  getSeniorityLevelLabel,
  getSkillIcon,
} from "@/components/skills/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UserDetailsSkills({ user }: { user: FindUserById }) {
  const hardSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "hard") ??
    [];
  const softSkills =
    user?.user_skill.filter((empSkill) => empSkill.skill.category === "soft") ??
    [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hard Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Hard Skills</CardTitle>
          <CardDescription>Competenze tecniche e strumenti</CardDescription>
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
          <CardTitle>Soft Skills</CardTitle>
          <CardDescription>
            Competenze trasversali e relazionali
          </CardDescription>
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
  );
}
