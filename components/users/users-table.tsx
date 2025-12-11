"use client";

import type { FindUsersWithProjects } from "@/app/server-actions/user/findUsersWithProjects";
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
import { Role, type user } from "@/db";
import { useApi } from "@/hooks/useApi";
import { canUserEdit, formatDisplayName } from "@/services/users/utils";
import { getRoleBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function UsersTable({
  users,
  refetch,
  user,
}: {
  users: FindUsersWithProjects[];
  refetch: () => void;
  user: user | null;
}) {
  const router = useRouter();
  const { callApi } = useApi();

  const handleViewUser = (id: string) => {
    router.push(`/utenti/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative">
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
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nessun utente trovato
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((us, index) => (
                  <motion.tr
                    key={us.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group/row cursor-pointer transition-all duration-300 hover:bg-muted/50 border-b"
                    onClick={() => handleViewUser(us.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 ring-2 ring-background group-hover/row:ring-primary/20 transition-all">
                          {us.avatar_url && <AvatarImage src={us.avatar_url} />}
                          <AvatarFallback>
                            {formatDisplayName({
                              name: us.name,
                              initials: true,
                            })}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium group-hover/row:text-primary transition-colors">
                          {us.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="group-hover/row:text-primary transition-colors">
                      {us.email}
                    </TableCell>
                    {canUserEdit({
                      currentUser: user ?? undefined,
                      user: us,
                    }) ? (
                      <TableCell>
                        <Select
                          onValueChange={async (e) => {
                            const roleIdSelected = e as Role;
                            try {
                              await callApi("/api/user/updateRole", {
                                method: "POST",
                                body: JSON.stringify({
                                  userId: us.id,
                                  role: roleIdSelected,
                                }),
                              });
                              refetch();
                            } catch (error) {
                              console.error("Failed to update user role:", error);
                            }
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
                      <TableCell>{getRoleBadge(us.role)}</TableCell>
                    )}

                    <TableCell className="group-hover/row:text-primary transition-colors">
                      {us.allocation.length || "-"}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
