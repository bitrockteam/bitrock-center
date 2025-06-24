"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FindUsers } from "@/api/server/user/findUsers";
import { updateUserRole } from "@/api/server/user/updateUserRole";
import { canUserEdit, formatDisplayName } from "@/services/users/utils";
import { Role, user } from "@bitrock/db";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function UsersTable({
  users,
  refetch,
  user,
}: {
  users: FindUsers[];
  refetch: () => void;
  user: user | null;
}) {
  const router = useRouter();

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
                users?.map((us) => (
                  <TableRow
                    key={us.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewUser(us.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {us.avatar_url && <AvatarImage src={us.avatar_url} />}
                          <AvatarFallback>
                            {formatDisplayName({
                              name: us.name,
                              initials: true,
                            })}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{us.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{us.email}</TableCell>
                    {canUserEdit({ currentUser: user!, user: us }) ? (
                      <TableCell>
                        <Select
                          onValueChange={(e) => {
                            const roleIdSelected = e as Role;
                            updateUserRole(us.id, roleIdSelected).then(() =>
                              refetch(),
                            );
                          }}
                          value={us.role}
                        >
                          <SelectTrigger className="min-w-[120px]">
                            <SelectValue placeholder="Seleziona stato" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(Role).map((s) => (
                              <SelectItem value={s} key={s}>
                                {s.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ) : (
                      <TableCell>{us.role}</TableCell>
                    )}

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
