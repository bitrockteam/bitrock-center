import { FetchTeam } from "@/api/server/user/fetchMyTeam";
import { getRoleBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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

export function TeamMemberCard({ teamMember }: { teamMember?: FetchTeam }) {
  if (!teamMember)
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
      >
        <Card className="h-full min-w-2xs max-w-sm flex flex-col justify-center">
          <CardFooter className="flex-col items-center gap-4">
            <p>Aggiungi membro</p>
            <AddDialogMemberTeam />
          </CardFooter>
        </Card>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
    >
      <>
        <Card className="min-w-2xs max-w-sm flex flex-col gap-4 h-fit">
          <CardHeader className="gap-4">
            <CardTitle className="flex flex-row items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {teamMember.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {teamMember.name}
            </CardTitle>
            <CardDescription className="text-left">
              {getRoleBadge(teamMember.role)}
            </CardDescription>
            {/* <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="mr-1 h-3 w-3" /> {teamMember.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    </motion.div>
  );
}
