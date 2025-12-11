"use client";

import type { FindUserById } from "@/app/server-actions/user/findUserById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Permissions } from "@/db";
import { useApi } from "@/hooks/useApi";
import { useAssignBulkPermissions } from "@/hooks/useAssignBulkPermissions";
import { useAssignPermission } from "@/hooks/useAssignPermission";
import { useRemovePermission } from "@/hooks/useRemovePermission";
import { formatDisplayName } from "@/services/users/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Target, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AddUserDialog from "./add-user-dialog";
import UserDetailsSections from "./user-details-sections";

export default function UserDetail({
  user,
  canDealPermissions = false,
  currentUserId,
}: Readonly<{
  user: FindUserById;
  canDealPermissions: boolean;
  currentUserId?: string;
}>) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permissions | undefined>(undefined);
  const { loading, error, reset } = useApi();
  const { removePermission } = useRemovePermission();
  const { assignPermission } = useAssignPermission();
  const { assignBulkPermissions } = useAssignBulkPermissions();

  const availablePermissions = useMemo(() => {
    return Object.values(Permissions).filter(
      (perm) => !user.user_permission?.some((p) => p.permission_id === perm)
    );
  }, [user.user_permission]);

  const hasAvailablePermissions = availablePermissions.length > 0;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Utente non trovato</h2>
        <p className="text-muted-foreground mb-4">
          L&apos;utente richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/utenti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna agli Utenti
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/utenti")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            {user.avatar_url && <AvatarImage src={user?.avatar_url} />}
            <AvatarFallback>
              {formatDisplayName({ name: user.name, initials: true })}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formatDisplayName({ name: user.name })}
            </h1>
            {user.role && <div className="flex items-center space-x-2">{user.role}</div>}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/utenti/${user.id}/development-plan`)}
          >
            <Target className="mr-2 h-4 w-4" />
            Development Plan
          </Button>
          {
            <Button className="cursor-pointer" onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifica Utente
            </Button>
          }
        </div>
      </div>

      <UserDetailsSections user={user} currentUserId={currentUserId} />

      {canDealPermissions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {user.user_permission && user.user_permission.length > 0 ? (
              // biome-ignore lint/a11y/useAriaPropsSupportedByRole: no explanation needed
              <div className="flex flex-wrap gap-2" aria-label="user permissions list">
                {user.user_permission.map((p) => (
                  <div key={p.permission_id} className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="text-xs pr-1"
                      aria-label={`user permission ${p.permission_id}`}
                    >
                      {p.permission_id}
                      <button
                        type="button"
                        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label={`Remove permission ${p.permission_id}`}
                        tabIndex={0}
                        onClick={async () => {
                          try {
                            await removePermission({
                              user_id: user.id,
                              permission_id: p.permission_id,
                            });
                            reset();
                            router.refresh();
                          } catch {
                            // handled by useApi
                          }
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            try {
                              await removePermission({
                                user_id: user.id,
                                permission_id: p.permission_id,
                              });
                              reset();
                              router.refresh();
                            } catch {
                              // handled by useApi
                            }
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nessun permesso assegnato a questo utente
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(v) => setSelectedPermission(v as Permissions)}
                  disabled={!hasAvailablePermissions}
                >
                  <SelectTrigger className="w-[280px]" aria-label="Select permission to assign">
                    <SelectValue placeholder="Select a permission" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePermissions.map((perm) => (
                      <SelectItem key={perm} value={perm}>
                        {perm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!selectedPermission || !hasAvailablePermissions || loading}
                  onClick={async () => {
                    try {
                      if (!selectedPermission) return;
                      await assignPermission({
                        user_id: user.id,
                        permission_id: selectedPermission,
                      });
                      reset();
                      setSelectedPermission(undefined);
                      router.refresh();
                    } catch {
                      // error handled by useApi
                    }
                  }}
                  aria-label="Assign selected permission"
                >
                  {loading ? "Assegnando…" : "Assegna"}
                </Button>
                {hasAvailablePermissions && (
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={async () => {
                      try {
                        await assignBulkPermissions({
                          user_id: user.id,
                          permission_ids: availablePermissions,
                        });
                        reset();
                        setSelectedPermission(undefined);
                        router.refresh();
                      } catch {
                        // error handled by useApi
                      }
                    }}
                    aria-label="Assign all remaining permissions"
                  >
                    {loading ? "Assegnando…" : "Add all"}
                  </Button>
                )}
              </div>
              {!hasAvailablePermissions && (
                <p className="text-sm text-muted-foreground">
                  Tutti i permessi disponibili sono già stati assegnati a questo utente.
                </p>
              )}
              {error && (
                <span className="text-sm text-red-600" role="alert">
                  {error}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Dialog per modificare l'utente */}
      {user && (
        <AddUserDialog
          open={showEditDialog}
          onComplete={(isOpen) => {
            setShowEditDialog(isOpen);
          }}
          editData={user}
          user={user}
        />
      )}
    </motion.div>
  );
}
