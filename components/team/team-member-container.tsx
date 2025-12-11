"use client";
import { useTeamApi } from "@/hooks/useTeamApi";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TeamAllocationsRecap } from "./team-allocations-recap";
import { TeamMemberCard } from "./team-member-card";
import { TeamUpdateIndicator } from "./team-update-indicator";
import type { TeamMemberContainerProps } from "./types";

export function TeamMemberContainer({
  myTeam,
  team,
  isOwner = true,
  user,
  allocationsRecap = [],
  ownerTeamAllocationsRecap = [],
}: TeamMemberContainerProps) {
  const { refreshTeamData, isUpdating } = useTeamApi();

  const handleMemberRemoved = async () => {
    // Use the centralized refresh function
    await refreshTeamData();
  };

  return (
    <>
      <TeamUpdateIndicator isUpdating={isUpdating} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Gestisci il tuo team</p>
        </div>

        <Tabs defaultValue={isOwner ? "team-member" : "my-team"}>
          <TabsList className="mb-6" aria-label="Seleziona sezione team">
            {isOwner && (
              <TabsTrigger
                className="w-2xs"
                value="team-member"
                aria-label={`Team di ${user.name}`}
              >
                {user.name}&apos;s Team
              </TabsTrigger>
            )}
            <TabsTrigger
              className="w-2xs"
              value="my-team"
              aria-label="Il mio team"
            >
              My Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team-member" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-4">
                {team.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    teamMember={member}
                    isOwner={isOwner}
                    onMemberRemoved={handleMemberRemoved}
                  />
                ))}
                <TeamMemberCard
                  isOwner={isOwner}
                  onMemberRemoved={handleMemberRemoved}
                />
              </div>
              <TeamAllocationsRecap
                allocationsRecap={ownerTeamAllocationsRecap}
              />
            </div>
          </TabsContent>

          <TabsContent value="my-team" className="space-y-4">
            <div className="flex flex-col space-y-4">
              {myTeam.referent ? (
                <p className="text-sm text-muted-foreground">
                  Referente:{" "}
                  <span className="font-medium">{myTeam.referent.name}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nessun referente assegnato
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {myTeam.members.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    teamMember={member}
                    onMemberRemoved={handleMemberRemoved}
                  />
                ))}
              </div>
              <TeamAllocationsRecap allocationsRecap={allocationsRecap} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
}
