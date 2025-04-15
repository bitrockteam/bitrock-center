"use client";

import UsersHeader from "@/components/users/users-header";
import UsersTable from "@/components/users/users-table";
import { SessionDataProvider } from "@/context/SessionData";

export default function UsersPage() {
  return (
    <SessionDataProvider>
      <div className="space-y-6">
        <UsersHeader />
        <UsersTable />
      </div>
    </SessionDataProvider>
  );
}
