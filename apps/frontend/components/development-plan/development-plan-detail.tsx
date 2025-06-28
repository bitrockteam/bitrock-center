"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getUserById } from "@/lib/mock-data";
import {
  addGoal,
  getDevelopmentPlanById,
  getGoalProgress,
  getGoalStatus,
  getLatestDevelopmentPlan,
  removeGoal,
  updateGoal,
  updateTodoStatus,
  type Goal,
  type TodoItem,
} from "@/lib/mock-development-plan-data";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit,
  Plus,
  Save,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DevelopmentPlanDetail({
  userId,
  planId,
}: {
  userId: string;
  planId: string;
}) {
  const router = useRouter();
  const user = getUserById();
  const plan = getDevelopmentPlanById(planId);
  const latestPlan = getLatestDevelopmentPlan(userId);
  const isLatestPlan = plan?.id === latestPlan?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    todos: [] as TodoItem[],
  });
  const [newTodo, setNewTodo] = useState("");

  if (!user || !plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Piano non trovato</h2>
        <p className="text-muted-foreground mb-4">
          Il piano di sviluppo richiesto non esiste.
        </p>
        <Button
          onClick={() => router.push(`/utenti/${userId}/development-plan`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai Piani
        </Button>
      </div>
    );
  }

  const handleTodoToggle = (
    goalId: string,
    todoId: string,
    completed: boolean,
  ) => {
    if (!isLatestPlan) return;
    updateTodoStatus(planId, goalId, todoId, completed);
    // Force re-render
    window.location.reload();
  };

  const handleSaveGoal = () => {
    if (!editingGoal) return;
    updateGoal(planId, editingGoal.id, editingGoal);
    setEditingGoal(null);
    window.location.reload();
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    addGoal(planId, newGoal);
    setNewGoal({ title: "", description: "", todos: [] });
    setShowAddGoalDialog(false);
    window.location.reload();
  };

  const handleDeleteGoal = (goalId: string) => {
    removeGoal(planId, goalId);
    setGoalToDelete(null);
    window.location.reload();
  };

  const addTodoToNewGoal = () => {
    if (!newTodo.trim()) return;
    const todo: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodo,
      completed: false,
    };
    setNewGoal((prev) => ({ ...prev, todos: [...prev.todos, todo] }));
    setNewTodo("");
  };

  const removeTodoFromNewGoal = (todoId: string) => {
    setNewGoal((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== todoId),
    }));
  };

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
            onClick={() => router.push(`/utenti/${userId}/development-plan`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Piano di Sviluppo
            </h1>
            <p className="text-muted-foreground">
              {user.name} {user.surname} -{" "}
              {new Date(plan.createdDate).toLocaleDateString("it-IT")}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {isLatestPlan ? (
                <Badge className="bg-green-500">Piano Attuale</Badge>
              ) : (
                <Badge variant="outline">Piano Precedente</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {plan.goals.length} obiettivi
              </span>
            </div>
          </div>
        </div>
        {isLatestPlan && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAddGoalDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Obiettivo
            </Button>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Annulla
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifica
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {!isLatestPlan && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-amber-800 dark:text-amber-200">
                Questo è un piano precedente e non può essere modificato. Solo
                il piano più recente può essere aggiornato.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {plan.goals.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nessun obiettivo definito
                </h3>
                <p className="text-muted-foreground mb-4">
                  Aggiungi obiettivi per iniziare a tracciare il progresso.
                </p>
                {isLatestPlan && (
                  <Button onClick={() => setShowAddGoalDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Aggiungi Primo Obiettivo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          plan.goals.map((goal, index) => {
            const status = getGoalStatus(goal);
            const progress = getGoalProgress(goal);
            const progressPercentage =
              (progress.completed / progress.total) * 100;
            const isEditingThisGoal = editingGoal?.id === goal.id;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {isEditingThisGoal ? (
                          <div className="space-y-3">
                            <Input
                              value={editingGoal.title}
                              onChange={(e) =>
                                setEditingGoal({
                                  ...editingGoal,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Titolo obiettivo"
                            />
                            <Textarea
                              value={editingGoal.description}
                              onChange={(e) =>
                                setEditingGoal({
                                  ...editingGoal,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Descrizione obiettivo"
                              rows={3}
                            />
                          </div>
                        ) : (
                          <>
                            <CardTitle>{goal.title}</CardTitle>
                            <CardDescription>
                              {goal.description}
                            </CardDescription>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          variant={
                            status === "completed" ? "default" : "secondary"
                          }
                        >
                          {status === "completed" ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Completato
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              In Corso
                            </>
                          )}
                        </Badge>
                        {isLatestPlan && isEditing && (
                          <div className="flex space-x-1">
                            {isEditingThisGoal ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleSaveGoal}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingGoal(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingGoal(goal)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setGoalToDelete(goal.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progresso
                          </span>
                          <span className="font-medium">
                            {progress.completed}/{progress.total} attività
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Attività</h4>
                        <div className="space-y-2">
                          {goal.todos.map((todo) => (
                            <div
                              key={todo.id}
                              className="flex items-center space-x-3"
                            >
                              <Checkbox
                                checked={todo.completed}
                                onCheckedChange={(checked) =>
                                  handleTodoToggle(
                                    goal.id,
                                    todo.id,
                                    checked as boolean,
                                  )
                                }
                                disabled={!isLatestPlan}
                              />
                              <span
                                className={
                                  todo.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }
                              >
                                {todo.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Dialog per aggiungere nuovo obiettivo */}
      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Obiettivo</DialogTitle>
            <DialogDescription>
              Crea un nuovo obiettivo per il piano di sviluppo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titolo</label>
              <Input
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                placeholder="Titolo dell'obiettivo"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrizione</label>
              <Textarea
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                placeholder="Descrizione dell'obiettivo"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Attività</label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Aggiungi un'attività"
                    onKeyPress={(e) => e.key === "Enter" && addTodoToNewGoal()}
                  />
                  <Button onClick={addTodoToNewGoal} disabled={!newTodo.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {newGoal.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{todo.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTodoFromNewGoal(todo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddGoalDialog(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleAddGoal} disabled={!newGoal.title.trim()}>
              Aggiungi Obiettivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog di conferma eliminazione */}
      <AlertDialog
        open={!!goalToDelete}
        onOpenChange={(open) => !open && setGoalToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Obiettivo</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo obiettivo? Questa azione non
              può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => goalToDelete && handleDeleteGoal(goalToDelete)}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
