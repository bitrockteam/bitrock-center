import { ProjectStatus } from "@/db";
import { z } from "zod";

export const addProjectSchema = z.object({
  name: z.string().min(1, "This field is required"),
  client: z.string().min(1, "This field is required"),
  description: z.string().min(1, "This field is required"),
  start_date: z.string().min(1, "This field is required"),
  end_date: z.string().optional(),
  status: z.nativeEnum(ProjectStatus, {
    error: () => "This field is required",
  }),
});

export const addMemberProjectSchema = z
  .object({
    user_id: z.string({
      error: (issue) =>
        issue.input === undefined ? "È obbligatorio selezionare un membro" : "Not a string",
    }),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    percentage: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.start_date > data.end_date) {
      ctx.addIssue({
        code: "custom",
        message: "La data di inizio deve essere precedente alla data di fine",
        path: ["start_date"],
      });
    }
  });
