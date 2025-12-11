"use client";

import type { TeamMemberAllocationRecap } from "@/app/server-actions/team/fetchTeamAllocationsRecap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDisplayName } from "@/services/users/utils";
import { getRoleBadge } from "@/utils/mapping";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Link from "next/link";

interface TeamAllocationsRecapProps {
  allocationsRecap: TeamMemberAllocationRecap[];
}

export function TeamAllocationsRecap({
  allocationsRecap,
}: TeamAllocationsRecapProps) {
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
      <Card>
        <CardHeader>
          <CardTitle>Riepilogo Allocazioni Team</CardTitle>
          <CardDescription>
            Panoramica delle allocazioni, progetti correnti e giorni di ferie
            per ogni membro del team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utente</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Progetto Corrente</TableHead>
                <TableHead>% Allocazione</TableHead>
                <TableHead>Fine Allocazione</TableHead>
                <TableHead>Ferie Rimanenti</TableHead>
                <TableHead>Ferie Pianificate</TableHead>
                <TableHead>Allocazioni Attive</TableHead>
                <TableHead>Totale Allocazioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocationsRecap.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <Link
                      href={`/utenti/${member.userId}`}
                      className="flex items-center space-x-3 hover:underline"
                      aria-label={`Visualizza dettagli di ${member.userName}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.userAvatarUrl || "/logo.png"}
                          alt={`Avatar di ${member.userName}`}
                        />
                        <AvatarFallback>
                          {formatDisplayName({
                            name: member.userName,
                            initials: true,
                          })}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.userEmail}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{getRoleBadge(member.userRole)}</TableCell>
                  <TableCell>
                    {member.currentProject ? (
                      <Link
                        href={`/progetti/${member.currentProject.id}`}
                        className="hover:underline text-primary"
                        aria-label={`Visualizza progetto ${member.currentProject.name}`}
                      >
                        {member.currentProject.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.currentProject
                      ? `${member.currentProject.percentage}%`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {member.latestAllocationEndDate
                      ? formatDate(member.latestAllocationEndDate)
                      : member.activeAllocations > 0
                      ? "Non definita"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        member.daysOffLeft <= 5
                          ? "text-destructive font-medium"
                          : member.daysOffLeft <= 10
                          ? "text-yellow-600 font-medium"
                          : ""
                      }
                    >
                      {member.daysOffLeft} giorni
                    </span>
                  </TableCell>
                  <TableCell>
                    {member.daysOffPlanned > 0 ? (
                      <span className="text-blue-600 font-medium">
                        {member.daysOffPlanned} giorni
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {member.activeAllocations}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {member.totalAllocations}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
