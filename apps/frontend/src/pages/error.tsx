import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md space-y-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="rounded-full bg-destructive/10 p-4 dark:bg-destructive/20">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Qualcosa è andato storto
          </h1>
          <p className="text-muted-foreground">
            Si è verificato un errore durante l&apos;elaborazione della
            richiesta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Torna alla Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
