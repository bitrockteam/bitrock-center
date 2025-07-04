import { useTeamApi } from "@/hooks/useTeamApi";
import { getRoleBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { Mail, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AddDialogMemberTeam } from "./add-dialog-member-team";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { TeamMemberCardProps } from "./types";

export function TeamMemberCard({
  teamMember,
  isOwner = false,
  onMemberRemoved,
}: TeamMemberCardProps) {
  const { removeTeamMember } = useTeamApi();

  if (!teamMember) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
      >
        <Card className="h-full min-w-2xs max-w-sm flex flex-col justify-center">
          <CardFooter className="flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <p>Aggiungi membro</p>
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
    >
      <div className="relative w-full">
        <Link
          href={`/utenti/${teamMember.id}`}
          className="w-full"
          aria-label={`Visualizza dettagli di ${teamMember.name}`}
        >
          <Card className="min-w-2xs max-w-sm flex flex-col gap-4 h-fit hover:shadow-md transition-shadow">
            <CardHeader className="gap-4">
              <CardTitle className="flex flex-row items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      teamMember.avatar_url ||
                      "/placeholder.svg?height=32&width=32"
                    }
                    alt={`Avatar di ${teamMember.name}`}
                  />
                  <AvatarFallback>
                    {teamMember.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{teamMember.name}</span>
              </CardTitle>
              <CardDescription className="text-left">
                {getRoleBadge(teamMember.role)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground truncate">
                  {teamMember.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Remove button - only show for team owners */}
        {isOwner && (
          <div className="absolute top-2 right-2">
            <RemoveMemberDialog
              teamMember={teamMember}
              onConfirm={handleRemoveMember}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
