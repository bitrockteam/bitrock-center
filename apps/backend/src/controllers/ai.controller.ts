import { type Express, type Request, type Response } from "express";
import {
  generateNaturalLanguageFromSQLOutput,
  generateSQLFromQuestion,
} from "../ai/geminiClient";
import { supabase } from "../config/supabase";
import { authenticateToken } from "../middleware/authMiddleware";

export const createAiController = (app: Express) => {
  app.post(
    "/smart-search",
    authenticateToken,
    async (req: Request, res: Response) => {
      const { question } = req.body;

      console.log("🔍 AI Search Request:", question);

      try {
        // 1. Query Ollama locally
        const sql = await generateSQLFromQuestion(question);

        // Optional logging
        console.log("🧠 Generated SQL:", sql);

        // 2. Run the SQL against local Supabase (Postgres)
        const result = await supabase.rpc("execute_sql", { sql });
        console.log("📊 SQL Result:", result);

        if (result.error) {
          console.error("❌ SQL Execution Error:", result.error);
          return res.status(500).json({ error: result.error.message });
        }

        const formattedResult = await generateNaturalLanguageFromSQLOutput(
          result.data,
        );

        res.json({
          sql,
          data: result.data,
          error: result.error,
          output: formattedResult,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error processing the request" });
      }
    },
  );
};
