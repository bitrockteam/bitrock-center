"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getReferentName } from "@/app/server-actions/user/getReferentName";
import { getLLMConfig } from "@/app/server-actions/user/getLLMConfig";
import type { user } from "@/db";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  User,
  Building2,
  Calendar,
  Settings as SettingsIcon,
  Brain,
  Key,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: user;
  activeSection: "profile" | "settings";
  version: string;
}

export const RightSidebar = ({
  isOpen,
  onClose,
  user,
  activeSection,
  version,
}: RightSidebarProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-96 bg-background border-l z-50 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {activeSection === "profile" ? "Profilo" : "Impostazioni"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Chiudi sidebar"
                tabIndex={0}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6 min-w-0">
                {activeSection === "profile" ? (
                  <ProfileSection user={user} />
                ) : (
                  <SettingsSection version={version} />
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProfileSection = ({ user }: { user: user }) => {
  const [referentName, setReferentName] = useState<string | null>(null);
  const [loadingReferent, setLoadingReferent] = useState(false);

  useEffect(() => {
    const fetchReferentName = async () => {
      if (user.referent_id) {
        setLoadingReferent(true);
        try {
          const name = await getReferentName(user.referent_id);
          setReferentName(name);
        } catch (error) {
          console.error("Error fetching referent name:", error);
        } finally {
          setLoadingReferent(false);
        }
      }
    };

    fetchReferentName();
  }, [user.referent_id]);

  const initials = user.name
    .trim()
    .split(" ")
    .map((l) => l[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="mt-1">{user.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Ruolo</p>
                <p className="text-sm font-medium">{user.role}</p>
              </div>
            </div>
            {user.referent_id && (
              <>
                <Separator />
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Referente</p>
                    <p className="text-sm font-medium">
                      {loadingReferent ? "Caricamento..." : (referentName ?? "N/A")}
                    </p>
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Membro dal</p>
                <p className="text-sm font-medium">
                  {new Date(user.created_at).toLocaleDateString("it-IT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {user.custom_days_off_left !== null && (
              <>
                <Separator />
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Giorni di ferie rimanenti</p>
                    <p className="text-sm font-medium">{user.custom_days_off_left}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SettingsSection = ({ version }: { version: string }) => {
  const [llmConfig, setLlmConfig] = useState<{
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    hasApiKey: boolean;
    maskedApiKey: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLLMConfig = async () => {
      try {
        const config = await getLLMConfig();
        setLlmConfig(config);
      } catch (error) {
        console.error("Error fetching LLM config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLLMConfig();
  }, []);

  return (
    <div className="space-y-6 min-w-0">
      <Card className="min-w-0">
        <CardHeader className="min-w-0">
          <CardTitle className="flex items-center space-x-2 min-w-0">
            <SettingsIcon className="h-5 w-5 shrink-0" />
            <span className="break-words">Configurazione LLM</span>
          </CardTitle>
          <CardDescription className="break-words">
            Informazioni sul provider e modello LLM utilizzato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">Caricamento...</div>
          ) : llmConfig ? (
            <>
              <div className="flex items-start space-x-3 min-w-0">
                <Brain className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">Provider</p>
                  <p className="text-sm text-muted-foreground break-words">{llmConfig.provider}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-3 min-w-0">
                <Brain className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">Modello</p>
                  <p className="text-sm text-muted-foreground break-words">{llmConfig.model}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-3 min-w-0">
                <Key className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">API Key</p>
                  <p className="text-sm text-muted-foreground font-mono break-all overflow-wrap-anywhere">
                    {llmConfig.hasApiKey ? (
                      llmConfig.maskedApiKey || "Configurata"
                    ) : (
                      <span className="text-destructive">Non configurata</span>
                    )}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-3 min-w-0">
                <SettingsIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {llmConfig.temperature}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-3 min-w-0">
                <SettingsIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">Max Tokens</p>
                  <p className="text-sm text-muted-foreground break-words">{llmConfig.maxTokens}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Errore nel caricamento della configurazione
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="min-w-0">
          <CardTitle className="flex items-center space-x-2 min-w-0">
            <Info className="h-5 w-5 shrink-0" />
            <span className="break-words">Informazioni App</span>
          </CardTitle>
          <CardDescription className="break-words">
            Versione e dettagli dell&apos;applicazione
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-sm font-medium shrink-0">Versione</span>
            <span className="text-sm text-muted-foreground break-words text-right">{version}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
