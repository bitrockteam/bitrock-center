"use client";
import { useTeamApi } from "@/hooks/useTeamApi";
import { motion } from "framer-motion";
import { HandMetal, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TeamAllocationsRecap } from "./team-allocations-recap";
import { TeamMemberCard } from "./team-member-card";
import { TeamUpdateIndicator } from "./team-update-indicator";
import type { TeamMemberContainerProps } from "./types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TeamMemberContainer({
  myTeam,
  team,
  isOwner = true,
  user,
  allocationsRecap = [],
  ownerTeamAllocationsRecap = [],
}: TeamMemberContainerProps) {
  const { refreshTeamData, isUpdating } = useTeamApi();
  const [searchQuery, setSearchQuery] = useState("");

  const handleMemberRemoved = async () => {
    // Use the centralized refresh function
    await refreshTeamData();
  };

  const filteredTeam = useMemo(() => {
    if (!searchQuery.trim()) return team;
    const query = searchQuery.toLowerCase();
    return team.filter(
      (member) =>
        member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
    );
  }, [team, searchQuery]);

  const filteredMyTeam = useMemo(() => {
    if (!searchQuery.trim()) return myTeam.members;
    const query = searchQuery.toLowerCase();
    return myTeam.members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
    );
  }, [myTeam.members, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  const activeAllocations = ownerTeamAllocationsRecap.filter((a) => a.activeAllocations > 0).length;

  return (
    <>
      <TeamUpdateIndicator isUpdating={isUpdating} />
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <HandMetal className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team</h1>
              <p className="text-muted-foreground">Gestisci il tuo team e collaboratori</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isOwner && (
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                {team.length} {team.length === 1 ? "Membro" : "Membri"}
              </Badge>
            )}
            {activeAllocations > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                {activeAllocations} Allocazioni Attive
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca membri del team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 md:w-[400px]"
            aria-label="Cerca membri del team"
          />
        </motion.div>

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
            <TabsTrigger className="w-2xs" value="my-team" aria-label="Il mio team">
              My Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team-member" className="space-y-4">
            <div className="flex flex-col space-y-4">
              {filteredTeam.length === 0 && searchQuery ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12"
                >
                  <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">Nessun membro trovato</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prova a modificare la tua ricerca
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex flex-wrap gap-4"
                >
                  {filteredTeam.map((member) => (
                    <motion.div key={member.id} variants={item}>
                      <TeamMemberCard
                        teamMember={member}
                        isOwner={isOwner}
                        onMemberRemoved={handleMemberRemoved}
                      />
                    </motion.div>
                  ))}
                  {(!searchQuery || filteredTeam.length > 0) && (
                    <motion.div variants={item}>
                      <TeamMemberCard isOwner={isOwner} onMemberRemoved={handleMemberRemoved} />
                    </motion.div>
                  )}
                </motion.div>
              )}
              <TeamAllocationsRecap allocationsRecap={ownerTeamAllocationsRecap} />
            </div>
          </TabsContent>

          <TabsContent value="my-team" className="space-y-4">
            <div className="flex flex-col space-y-4">
              {myTeam.referent ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border bg-muted/30 p-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Referente:{" "}
                    <span className="font-medium text-foreground">{myTeam.referent.name}</span>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border border-dashed bg-muted/20 p-4"
                >
                  <p className="text-sm text-muted-foreground">Nessun referente assegnato</p>
                </motion.div>
              )}
              {filteredMyTeam.length === 0 && searchQuery ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12"
                >
                  <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">Nessun membro trovato</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prova a modificare la tua ricerca
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex flex-wrap gap-4"
                >
                  {filteredMyTeam.map((member) => (
                    <motion.div key={member.id} variants={item}>
                      <TeamMemberCard teamMember={member} onMemberRemoved={handleMemberRemoved} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
              <TeamAllocationsRecap allocationsRecap={allocationsRecap} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
