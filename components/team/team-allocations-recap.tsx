"use client";

import type { TeamMemberAllocationRecap } from "@/app/server-actions/team/fetchTeamAllocationsRecap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Role } from "@/db";
import { formatDisplayName } from "@/services/users/utils";
import { getRoleBadge } from "@/utils/mapping";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface TeamAllocationsRecapProps {
  allocationsRecap: TeamMemberAllocationRecap[];
}

export function TeamAllocationsRecap({ allocationsRecap }: TeamAllocationsRecapProps) {
  if (allocationsRecap.length === 0) {
    return null;
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Riepilogo Allocazioni Team</CardTitle>
              <CardDescription>
                Panoramica delle allocazioni, progetti correnti e giorni di ferie per ogni membro
                del team
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Utente</TableHead>
                  <TableHead className="font-semibold">Ruolo</TableHead>
                  <TableHead className="font-semibold">Progetto Corrente</TableHead>
                  <TableHead className="font-semibold">% Allocazione</TableHead>
                  <TableHead className="font-semibold">Fine Allocazione</TableHead>
                  <TableHead className="font-semibold">Ferie Rimanenti</TableHead>
                  <TableHead className="font-semibold">Ferie Pianificate</TableHead>
                  <TableHead className="font-semibold">Allocazioni Attive</TableHead>
                  <TableHead className="font-semibold">Totale Allocazioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocationsRecap.map((member, index) => (
                  <motion.tr
                    key={member.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group cursor-pointer transition-colors hover:bg-muted/50 border-b"
                  >
                    <TableCell>
                      <Link
                        href={`/utenti/${member.userId}`}
                        className="flex items-center space-x-3 transition-colors hover:text-primary"
                        aria-label={`Visualizza dettagli di ${member.userName}`}
                      >
                        <Avatar className="h-9 w-9 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                          <AvatarImage
                            src={member.userAvatarUrl || "/logo.png"}
                            alt={`Avatar di ${member.userName}`}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-semibold">
                            {formatDisplayName({
                              name: member.userName,
                              initials: true,
                            })}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold group-hover:text-primary transition-colors">
                            {member.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">{member.userEmail}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.userRole as Role)}</TableCell>
                    <TableCell>
                      {member.currentProject ? (
                        <Link
                          href={`/progetti/${member.currentProject.id}`}
                          className="flex items-center gap-1.5 font-medium text-primary hover:underline transition-colors"
                          aria-label={`Visualizza progetto ${member.currentProject.name}`}
                        >
                          <span>{member.currentProject.name}</span>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.currentProject ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{member.currentProject.percentage}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.latestAllocationEndDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{formatDate(member.latestAllocationEndDate)}</span>
                        </div>
                      ) : member.activeAllocations > 0 ? (
                        <span className="text-muted-foreground">Non definita</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 font-medium ${
                          member.daysOffLeft <= 5
                            ? "text-destructive"
                            : member.daysOffLeft <= 10
                              ? "text-yellow-600 dark:text-yellow-500"
                              : "text-green-600 dark:text-green-500"
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        {member.daysOffLeft} giorni
                      </span>
                    </TableCell>
                    <TableCell>
                      {member.daysOffPlanned > 0 ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {member.daysOffPlanned} giorni
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {member.activeAllocations}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{member.totalAllocations}</span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
