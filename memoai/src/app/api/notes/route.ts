import { db } from "@/db";
import { notes } from "@/db/schema";
import { createNoteSchema } from "@/lib/validation/notes";
import { auth } from "@clerk/nextjs/server";

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
    const note = await db
      .insert(notes)
      .values({
        user_id: userId,
        title: title,
        content: content ?? null,
      })
      .returning();
    return Response.json(note[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
