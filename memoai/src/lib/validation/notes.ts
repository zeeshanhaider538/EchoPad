import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
});

export type createNoteSchema = z.infer<typeof createNoteSchema>;

export const updatedNoteSchema = createNoteSchema.extend({
  id: z.int().min(1),
});
export const deleteNoteSchema = z.object({
  id: z.int().min(1),
});
