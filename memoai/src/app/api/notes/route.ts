import { db } from "@/db";
import { notesIndex } from "@/db/pinecone";
import {
  //   deletedNotes,
  getNoteById,
  //   updatedNotes,
} from "@/db/repositories/notes";
import { notes } from "@/db/schema";
import { getEmbedding } from "@/lib/google";
import {
  createNoteSchema,
  deleteNoteSchema,
  updatedNoteSchema,
} from "@/lib/validation/notes";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { title, content } = parseResult.data;
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized " }, { status: 401 });
    }
    const embedding = await getEmbeddingForNote(title, content);
    // console.log("embedding", embedding);
    const note = await db.transaction(async (tx) => {
      const note = await tx
        .insert(notes)
        .values({
          user_id: userId,
          title: title,
          content: content ?? null,
        })
        .returning();
      await notesIndex.upsert([
        {
          id: note[0].id.toString(),
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });

    return Response.json(note[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updatedNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { id, title, content } = parseResult.data;
    const { userId } = await auth();

    const note = await getNoteById(id);
    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    if (!userId || userId !== note.user_id) {
      return Response.json({ error: "Unauthorized " }, { status: 401 });
    }
    const embedding = await getEmbeddingForNote(title, content);
    const updatedNote = await db.transaction(async (tx) => {
      const updatedNote = await tx
        .update(notes)
        .set({
          title,
          content,
          updated_at: sql`NOW()`,
        })
        .where(eq(notes.id, id))
        .returning();

      await notesIndex.upsert([
        {
          id: note.id.toString(),
          values: embedding,
          metadata: { userId },
        },
      ]);
      return updatedNote;
    });

    return Response.json({ note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { id } = parseResult.data;
    const { userId } = await auth();

    const note = await getNoteById(id);
    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    if (!userId || userId !== note.user_id) {
      return Response.json({ error: "Unauthorized " }, { status: 401 });
    }
    await db.transaction(async (tx) => {
      const deletedNote = await tx
        .delete(notes)
        .where(eq(notes.id, id))
        .returning();

      await notesIndex.deleteOne(id.toString());
      return deletedNote;
    });
    // await deletedNotes(id);
    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + (content ?? ""));
}
