"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTimeEntriesByUser } from "@/lib/mock-data";
import { formatDisplayName } from "@/services/users/utils";
import { project, user } from "@bitrock/db";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Clock, Edit, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddUserDialog from "./add-user-dialog";

export default function UserDetail({
  id,
  users,
  userById,
  projects,
}: Readonly<{
  id: string;
  users: user[];
  userById: user;
  projects: project[];
}>) {
  const router = useRouter();

  const [showEditDialog, setShowEditDialog] = useState(false);

  const timeEntries = getTimeEntriesByUser(id);

  if (!userById) {
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

  // Calcola il totale delle ore lavorate
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/utenti")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            {userById.avatar_url && <AvatarImage src={userById?.avatar_url} />}
            <AvatarFallback>
              {formatDisplayName({ name: userById.name, initials: true })}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formatDisplayName({ name: userById.name })}
            </h1>
            {userById.role && (
              <div className="flex items-center space-x-2">{userById.role}</div>
            )}
          </div>
        </div>

        {
          <Button
            className="cursor-pointer"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifica Utente
          </Button>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Informazioni Contatto
            </CardTitle>
            <CardDescription>Dettagli dell&apos;utente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Mail className="mr-1 h-3 w-3" /> {userById.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Telefono:</p>
                {/* <p className="text-sm text-muted-foreground flex items-center">
                  <Phone className="mr-1 h-3 w-3" />{" "}
                  {user.phone || "Non disponibile"}
                </p> */}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ruolo:</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {userById.role}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Referente:</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {users.find((us) => us.id === userById.referent_id)?.name ||
                    "Nessuno"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ore Totali:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> {totalHours} ore
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Progetti Attivi:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Briefcase className="mr-1 h-3 w-3" /> {projects.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog per modificare l'utente */}
      {userById && (
        <AddUserDialog
          open={showEditDialog}
          onComplete={(isOpen) => {
            setShowEditDialog(isOpen);
          }}
          editData={userById}
          user={userById}
        />
      )}
    </motion.div>
  );
}
