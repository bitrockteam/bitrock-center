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

import { useUpdateRoleForUser } from "@/api/useUpdateRoleForUser";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { useSessionContext } from "@/app/utenti/SessionData";
import { formatDisplayName } from "@/services/users/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function UsersTable() {
  const router = useRouter();

  const { users, roles, refetchUsers } = useSessionContext();
  const { user } = useAuth();
  const { updateRoleForUser } = useUpdateRoleForUser();

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
                users?.map((us) => {
                  console.log({ us });

                  return (
                    <TableRow
                      key={us.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewUser(us.id)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={us.avatar_url} />
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
                      {user?.role?.label === "Admin" ? (
                        <TableCell>
                          <Select
                            onValueChange={(e) => {
                              console.log({ e });

                              const roleIdSelected = e as string;
                              updateRoleForUser(us.id, roleIdSelected).then(
                                () => {
                                  refetchUsers();
                                },
                              );
                            }}
                            value={us.role.id}
                          >
                            <SelectTrigger className="min-w-[120px]">
                              <SelectValue placeholder="Seleziona stato" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((s) => (
                                <SelectItem value={s.id} key={s.id}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      ) : (
                        <TableCell>{us.role?.label ?? "Developer"}</TableCell>
                      )}

                      <TableCell>{0}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
