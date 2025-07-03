import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Clock, Target, TrendingUp } from "lucide-react";

export default function UserDetailsActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attività Recenti</CardTitle>
        <CardDescription>Cronologia delle attività e modifiche</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-green-100">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Competenza aggiornata</p>
              <p className="text-xs text-muted-foreground">
                TypeScript promosso a Senior level
              </p>
              <p className="text-xs text-muted-foreground">2 giorni fa</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-blue-100">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Obiettivo completato</p>
              <p className="text-xs text-muted-foreground">
                Completato corso avanzato TypeScript
              </p>
              <p className="text-xs text-muted-foreground">1 settimana fa</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-purple-100">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Nuova competenza aggiunta</p>
              <p className="text-xs text-muted-foreground">
                Aggiunta competenza in Kubernetes
              </p>
              <p className="text-xs text-muted-foreground">2 settimane fa</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-orange-100">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Piano di sviluppo creato</p>
              <p className="text-xs text-muted-foreground">
                Nuovo piano di sviluppo per Q1 2024
              </p>
              <p className="text-xs text-muted-foreground">1 mese fa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
