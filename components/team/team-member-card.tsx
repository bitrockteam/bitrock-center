import { useTeamApi } from "@/hooks/useTeamApi";
import { getRoleBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { Mail, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { AddDialogMemberTeam } from "./add-dialog-member-team";
import { RemoveMemberDialog } from "./remove-member-dialog";
import type { TeamMemberCardProps } from "./types";

export function TeamMemberCard({
  teamMember,
  isOwner = false,
  onMemberRemoved,
}: TeamMemberCardProps) {
  const { removeTeamMember } = useTeamApi();

  if (!teamMember) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="w-full min-w-2xs max-w-sm"
      >
        <Card className="group relative h-full flex flex-col justify-center overflow-hidden border-2 border-dashed transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardFooter className="relative flex-col items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="font-medium">Aggiungi membro</p>
              <p className="text-xs text-muted-foreground text-center">
                Aggiungi un nuovo membro al team
              </p>
            </div>
            <AddDialogMemberTeam />
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const handleRemoveMember = async () => {
    const result = await removeTeamMember(teamMember.id);
    if (result.success) {
      onMemberRemoved?.();
    } else {
      throw new Error(result.error);
    }
  };

  return (
    <div className="relative w-full min-w-2xs max-w-sm">
      <Link
        href={`/utenti/${teamMember.id}`}
        className="w-full"
        aria-label={`Visualizza dettagli di ${teamMember.name}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative gap-4">
              <CardTitle className="flex flex-row items-center gap-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                    {teamMember.avatar_url && (
                      <AvatarImage
                        src={teamMember.avatar_url}
                        alt={`Avatar di ${teamMember.name}`}
                      />
                    )}
                    <AvatarFallback>{teamMember.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="truncate font-semibold">{teamMember.name}</span>
              </CardTitle>
              <CardDescription className="text-left">
                {getRoleBadge(teamMember.role)}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 group-hover:bg-muted transition-colors">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground truncate">{teamMember.email}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>

      {/* Remove button - only show for team owners */}
      {isOwner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute top-2 right-2 z-10"
        >
          <RemoveMemberDialog teamMember={teamMember} onConfirm={handleRemoveMember} />
        </motion.div>
      )}
    </div>
  );
}
