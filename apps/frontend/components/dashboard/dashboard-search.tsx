"use client";

import { useAiSearch } from "@/api/ai/useAiSearch";
import { motion } from "framer-motion";
import { Dot, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function DashboardSearch() {
  const [querySearch, setQuerySearch] = useState("");
  const { search, loading, result } = useAiSearch();

  const handleSearch = () => {
    if (querySearch.trim()) {
      // Handle search logic here
      console.log("Searching for:", querySearch);
      search(querySearch);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  // Capture the enter key press to trigger search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      handleSearch();
    }
  };

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <div className="relative flex items-center gap-2 ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
          <Input
            type="search"
            placeholder="Chiedi qualcosa..."
            className="w-full pl-8"
            value={querySearch}
            onChange={(e) => setQuerySearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleSearch} color="primary" disabled={loading}>
            {loading ? (
              <>
                <Dot className="h-4 w-4 animate-pulse" />
                Sto pensando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Cerca
              </>
            )}
          </Button>
        </div>
        {result && (
          <div>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.output || "Nessun risultato trovato."}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
