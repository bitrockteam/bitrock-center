import { redirect } from "next/navigation";
import { getPermissions } from "@/app/server-actions/permission/getPermissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";

export const dynamic = "force-dynamic";

export default async function PermissionsPage() {
  const [data] = await Promise.all([getPermissions()]);
  const CAN_SEE_PERMISSIONS = await hasPermission(Permissions.CAN_SEE_PERMISSIONS);

  if (!CAN_SEE_PERMISSIONS) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id} tabIndex={0} aria-label={`permission ${p.id}`}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-sm text-muted-foreground">
                    No permissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
