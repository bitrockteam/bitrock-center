"use client";

import type React from "react";

import { useAiSearch } from "@/api/ai/useAiSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import BlobAnimation from "./blob-animation";
import ThinkingIndicator from "./thinking-indicator";

export default function AIAssistant() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { search, loading, result, reset } = useAiSearch();

  // Funzione per gestire l'invio della richiesta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Imposta lo stato su "thinking"

    await search(query);
  };

  // Regola l'altezza della textarea in base al contenuto
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] py-6 min-w-[50vw]">
      {/* Header */}
      <div className="text-center mb-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Bot className="h-8 w-8" />
            Rocky
          </h1>
          <p className="text-muted-foreground mt-2">
            Il tuo assistente AI per Bitrock Hours
          </p>
        </motion.div>
      </div>

      {/* Blob Animation */}
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {!loading && !result && (
            <motion.div
              key="blob"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              {/* <AIBlob /> */}
              <BlobAnimation />
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <ThinkingIndicator />
              <p className="text-muted-foreground mt-4">
                Sto elaborando la tua richiesta...
              </p>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-full max-w-3xl px-4"
            >
              <Card className="bg-slate-600/10 dark:bg-slate-800/20 rounded-lg p-6 border border-primary/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-2 h-fit">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-lg">{result.output}</p>
                      {result.data && (
                        // table data

                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(result.data?.[0]).map((key) => {
                                return <TableHead key={key}>{key}</TableHead>;
                              })}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.data.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={6}
                                  className="text-center py-6 text-muted-foreground"
                                >
                                  Nessuna richiesta trovata
                                </TableCell>
                              </TableRow>
                            ) : (
                              result.data.map((item, index) => (
                                <TableRow key={index}>
                                  {Object.entries(item).map(([key, value]) => (
                                    <TableCell key={key}>
                                      {value ? value.toString() : "-"}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          reset();
                          setQuery("");
                        }}
                      >
                        Nuova domanda
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-3xl px-4 mt-8"
      >
        <form onSubmit={handleSubmit} className="flex flex-row gap-2">
          <Input
            ref={inputRef}
            placeholder="Chiedi qualcosa a Rocky..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-10 resize-none"
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-8"
            >
              {loading ? (
                "Elaborazione..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Chiedi
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
