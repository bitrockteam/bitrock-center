"use client";

import type { Permissions } from "@/app/server-actions/permission/getPermissions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Shield, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

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

const getPermissionColor = (id: string): string => {
  if (id.includes("CREATE"))
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  if (id.includes("EDIT"))
    return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
  if (id.includes("DELETE"))
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  if (id.includes("APPROVE"))
    return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
  if (id.includes("SEE") || id.includes("VIEW"))
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
};

export default function PermissionsContent({ permissions }: { permissions: Permissions }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    const query = searchQuery.toLowerCase();
    return permissions.filter(
      (p) =>
        p.id.toLowerCase().includes(query) || formatPermissionId(p.id).toLowerCase().includes(query)
    );
  }, [permissions, searchQuery]);

  const categories = useMemo(() => {
    const cats = new Set(permissions.map((p) => getPermissionCategory(p.id)));
    return Array.from(cats);
  }, [permissions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
            <p className="text-muted-foreground">Manage system access and capabilities</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            {permissions.length} {permissions.length === 1 ? "Permission" : "Permissions"}
          </Badge>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 md:w-[400px]"
          aria-label="Search permissions"
        />
      </motion.div>

      {/* Permissions Grid */}
      {filteredPermissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12"
        >
          <Shield className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">No permissions found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search query</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredPermissions.map((permission) => (
            <motion.div
              key={permission.id}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card
                className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                tabIndex={0}
                aria-label={`Permission: ${formatPermissionId(permission.id)}`}
                role="article"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="relative p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-colors">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPermissionColor(permission.id)}`}
                    >
                      {getPermissionCategory(permission.id)}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-base font-semibold leading-tight">
                    {formatPermissionId(permission.id)}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {permission.id}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Categories Summary */}
      {searchQuery === "" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border bg-muted/30 p-4"
        >
          <p className="mb-3 text-sm font-medium text-muted-foreground">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const count = permissions.filter(
                (p) => getPermissionCategory(p.id) === category
              ).length;
              return (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category} ({count})
                </Badge>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
