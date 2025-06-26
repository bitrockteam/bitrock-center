"use client";
import { FetchMyTeam } from "@/api/server/user/fetchMyTeam";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TeamMemberCard } from "./team-member-card";
import { FetchTeam } from "@/api/server/user/fetchTeam";

export function TeamMemberContainer({
  myTeam,
  team,
  isOwner = true,
}: {
  myTeam: FetchMyTeam[];
  team: FetchTeam;
  isOwner?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team </h1>
        <p className="text-muted-foreground">Gestisci il tuo team</p>
      </div>
      <Tabs defaultValue={`${isOwner ? "my-team" : "team-member"}`}>
        <TabsList className="mb-6">
          {isOwner && (
            <TabsTrigger className="w-2xs" value="my-team">
              My Team
            </TabsTrigger>
          )}
          <TabsTrigger className="w-2xs" value="team-member">
            {team.referent?.name}&apos;s Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-team">
          <div className="flex flex-wrap gap-4">
            {myTeam.map((member) => (
              <TeamMemberCard key={member.id} teamMember={member} />
            ))}
            <TeamMemberCard />
          </div>
        </TabsContent>
        <TabsContent value="team-member">
          <div className="flex flex-wrap gap-4">
            {team.members.map((member) => (
              <TeamMemberCard key={member.id} teamMember={member} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
