import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { notes } from "../schema";

export async function getUserNotes(userId: string) {
  const result = await db.select().from(notes).where(eq(notes.user_id, userId));
  return result;
}

export async function getNoteById(noteId: number) {
  const result = await db
    .select()
    .from(notes)
    .where(eq(notes.id, noteId))
    .limit(1);

  return result[0] ?? null;
}

type UpdateNoteProp = {
  title?: string; // optional but never null
  content?: string | null; // optional and can be null
};
export async function updatedNotes(id: number, data: UpdateNoteProp) {
  const [updatedNote] = await db
    .update(notes)
    .set({
      ...data,
      updated_at: sql`NOW()`,
    })
    .where(eq(notes.id, id))
    .returning();
  return updatedNote;
}

export async function deletedNotes(id: number) {
  const [deletedNote] = await db
    .delete(notes)
    .where(eq(notes.id, id))
    .returning();
  return deletedNote;
}
