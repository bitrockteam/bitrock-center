"use client";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TeamMemberCard } from "./team-member-card";
import { FetchMyTeam } from "@/api/server/user/fetchTeam";
import { FetchTeam } from "@/api/server/user/fetchMyTeam";
import { user } from "@bitrock/db";

export function TeamMemberContainer({
  myTeam,
  team,
  isOwner = true,
  user,
}: {
  myTeam: FetchMyTeam;
  team: FetchTeam[];
  isOwner?: boolean;
  user: user;
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
      <Tabs defaultValue={`${isOwner ? "team-member" : "my-team"}`}>
        <TabsList className="mb-6">
          {isOwner && (
            <TabsTrigger className="w-2xs" value="team-member">
              {user.name}&apos;s Team
            </TabsTrigger>
          )}
          <TabsTrigger className="w-2xs" value="my-team">
            My Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team-member">
          <div className="flex flex-wrap gap-4">
            {team.map((member) => (
              <TeamMemberCard key={member.id} teamMember={member} />
            ))}
            <TeamMemberCard />
          </div>
        </TabsContent>
        <TabsContent value="my-team">
          <div className="flex flex-col space-y-4">
            <p>Referente: {myTeam.referent?.name}</p>
            <div className="flex flex-wrap gap-4">
              {myTeam.members.map((member) => (
                <TeamMemberCard key={member.id} teamMember={member} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
