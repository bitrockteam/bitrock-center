import { z } from "zod";

export const addProjectSchema = z.object({
  name: z.string({ required_error: "This field is required" }),
  client: z.string({ required_error: "This field is required" }),
  description: z.string({ required_error: "This field is required" }),
  start_date: z.string({ required_error: "this field is required" }),
  end_date: z.string().optional(),
  status_id: z.string({ required_error: "this field is required" }),
});

export const addMemberProjectSchema = z.object({
  user_id: z.string({ required_error: "This field is required" }),
  start_date: z.date().optional(),
  end_date: z.string().optional(),
  percentage: z.number().optional(),
});
