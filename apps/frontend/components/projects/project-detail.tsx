"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, Edit, Users } from "lucide-react"
import { getProjectById, getTimeEntriesByProject } from "@/lib/mock-data"
import AddProjectDialog from "./add-project-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProjectDetail({ id }: { id: string }) {
  const router = useRouter()
  const [showEditDialog, setShowEditDialog] = useState(false)

  const project = getProjectById(id)
  const timeEntries = getTimeEntriesByProject(id)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Progetto non trovato</h2>
        <p className="text-muted-foreground mb-4">Il progetto richiesto non esiste o è stato rimosso.</p>
        <Button onClick={() => router.push("/progetti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai Progetti
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Attivo</Badge>
      case "completed":
        return <Badge variant="outline">Completato</Badge>
      case "on-hold":
        return <Badge variant="secondary">In Pausa</Badge>
      case "planned":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Pianificato
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Calcola il totale delle ore lavorate sul progetto
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/progetti")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground">Cliente: {project.client}</p>
              {getStatusBadge(project.status)}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifica Progetto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informazioni Progetto</CardTitle>
            <CardDescription>Dettagli e date del progetto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Descrizione:</p>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Data Inizio:</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" /> {project.startDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Data Fine:</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" /> {project.endDate || "Non definita"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ore Totali:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> {totalHours} ore
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team di Progetto</CardTitle>
            <CardDescription>Membri assegnati al progetto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg?height=40&width=40"} />
                    <AvatarFallback>
                      {member.name.charAt(0)}
                      {member.surname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name} {member.surname}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timesheet" className="w-full">
        <TabsList>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="tasks">Attività</TabsTrigger>
          <TabsTrigger value="documents">Documenti</TabsTrigger>
        </TabsList>
        <TabsContent value="timesheet">
          <Card>
            <CardHeader>
              <CardTitle>Ore Registrate</CardTitle>
              <CardDescription>Ore lavorate su questo progetto</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Ore</TableHead>
                    <TableHead>Descrizione</TableHead>
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nessuna registrazione trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={entry.user.avatar || "/placeholder.svg?height=24&width=24"} />
                              <AvatarFallback>
                                {entry.user.name.charAt(0)}
                                {entry.user.surname.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {entry.user.name} {entry.user.surname}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.hours}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              entry.status === "approved"
                                ? "outline"
                                : entry.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {entry.status === "approved"
                              ? "Approvato"
                              : entry.status === "pending"
                                ? "In attesa"
                                : "Rifiutato"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Attività</CardTitle>
              <CardDescription>Attività associate al progetto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nessuna attività disponibile</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documenti</CardTitle>
              <CardDescription>Documenti associati al progetto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nessun documento disponibile</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog per modificare il progetto */}
      <AddProjectDialog open={showEditDialog} onOpenChange={setShowEditDialog} editData={project} />
    </motion.div>
  )
}

