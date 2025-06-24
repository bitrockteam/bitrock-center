import { ProjectStatus } from "@bitrock/db";
import { z } from "zod";

export const addProjectSchema = z.object({
  name: z.string({ required_error: "This field is required" }),
  client: z.string({ required_error: "This field is required" }),
  description: z.string({ required_error: "This field is required" }),
  start_date: z.string({ required_error: "this field is required" }),
  end_date: z.string().optional(),
  status: z.nativeEnum(ProjectStatus, {
    errorMap: () => ({
      message: "This field is required",
    }),
  }),
});

export const addMemberProjectSchema = z
  .object({
    user_id: z.string({
      required_error: "È obbligatorio selezionare un membro",
    }),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    percentage: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.start_date > data.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La data di inizio deve essere precedente alla data di fine",
        path: ["start_date"],
      });
    }
  });
