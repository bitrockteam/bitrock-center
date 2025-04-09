"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSessionContext } from "@/app/utenti/SessionData";
import { formatDisplayName } from "@/services/users/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const getRoleBadge = (role?: string) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-purple-500">Amministratore</Badge>;
    case "manager":
      return <Badge className="bg-blue-500">Manager</Badge>;
    case "developer":
      return <Badge variant="outline">Sviluppatore</Badge>;
    case "designer":
      return (
        <Badge variant="outline" className="border-pink-500 text-pink-500">
          Designer
        </Badge>
      );
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

export default function UsersTable() {
  const router = useRouter();

  const { users, roles } = useSessionContext();
  console.log({ users });

  const handleViewUser = (id: string) => {
    router.push(`/utenti/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Progetti</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Nessun utente trovato
                  </TableCell>
                </TableRow>
              ) : (
                (Array.isArray(users) ? users : [])?.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {formatDisplayName({
                              name: user.name,
                              initials: true,
                            })}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {getRoleBadge(
                        roles?.find((role) => role.id === user.role_id)?.label,
                      )}
                    </TableCell>
                    <TableCell>{0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
