"use client";

import type { FindUserById } from "@/app/server-actions/user/findUserById";
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
import { motion } from "framer-motion";
import { Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const formatPermissionId = (id: string): string => {
  return id
    .replace(/_/g, " ")
    .replace(/CAN/g, "")
    .replace(/SEE/g, "View")
    .replace(/CREATE/g, "Create")
    .replace(/EDIT/g, "Edit")
    .replace(/DELETE/g, "Delete")
    .replace(/APPROVE/g, "Approve")
    .replace(/DEAL/g, "Manage")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getPermissionCategory = (id: string): string => {
  if (id.includes("CLIENT")) return "Client";
  if (id.includes("WORK_ITEM")) return "Work Item";
  if (id.includes("PERMIT")) return "Permit";
  if (id.includes("PERMISSION")) return "Permission";
  if (id.includes("USER")) return "User";
  if (id.includes("PROJECT")) return "Project";
  return "General";
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function UserDetailsPermissions({ user }: { user: FindUserById }) {
  const router = useRouter();
  const [selectedPermission, setSelectedPermission] = useState<Permissions | undefined>(undefined);
  const { loading, error, reset } = useApi();
  const { removePermission } = useRemovePermission();
  const { assignPermission } = useAssignPermission();
  const { assignBulkPermissions } = useAssignBulkPermissions();

  const availablePermissions = useMemo(() => {
    if (!user) return [];
    return Object.values(Permissions).filter(
      (perm) => !user.user_permission?.some((p) => p.permission_id === perm)
    );
  }, [user]);

  const hasAvailablePermissions = availablePermissions.length > 0;

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Nessun utente trovato</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        {user.user_permission && user.user_permission.length > 0 ? (
          <div className="space-y-4">
            {(() => {
              const grouped = user.user_permission.reduce(
                (acc, p) => {
                  const category = getPermissionCategory(p.permission_id);
                  if (!acc[category]) {
                    acc[category] = [];
                  }
                  acc[category].push(p);
                  return acc;
                },
                {} as Record<string, typeof user.user_permission>
              );

              return Object.entries(grouped).map(([category, permissions]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-medium">
                      {category}
                    </Badge>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  >
                    {permissions.map((p) => (
                      <motion.div
                        key={p.permission_id}
                        variants={item}
                        whileHover={{
                          y: -2,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <Card
                          className="group relative aspect-square overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                          tabIndex={0}
                          aria-label={`Permission: ${formatPermissionId(p.permission_id)}`}
                          role="article"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <button
                            type="button"
                            className="absolute right-2 top-2 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1"
                            aria-label={`Remove permission ${p.permission_id}`}
                            tabIndex={0}
                            onClick={async () => {
                              if (!user) return;
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
                                if (!user) return;
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
                          <CardContent className="relative flex h-full flex-col items-center justify-center p-2.5 text-center">
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-colors">
                              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-sm font-semibold leading-tight">
                              {formatPermissionId(p.permission_id)}
                            </h3>
                            <p className="mt-1 text-[10px] font-mono text-muted-foreground break-all opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              {p.permission_id}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8">
            <Shield className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              Nessun permesso assegnato a questo utente
            </p>
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
                if (!user || !selectedPermission) return;
                try {
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
                  if (!user) return;
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
  );
}
