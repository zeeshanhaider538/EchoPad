import { db } from "@/db";
import { notesIndex } from "@/db/pinecone";
import { notes } from "@/db/schema";
import { getEmbedding } from "@/lib/google";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  streamText,
  SystemModelMessage,
  UIMessage,
} from "ai";
import { inArray } from "drizzle-orm";

interface MessagePart {
  type: "text";
  text: string;
}
// interface ChatMessage {
//   id: string;
//   role: "user" | "assistant" | "system";
//   parts: MessagePart[];
// }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    // Take the last 6 messages
    const messagesTruncated = messages.slice(-6);

    // simpler version
    // let extratMessages = messages.map((m) => m.parts[0].text).join("\n");

    // Extract text from each message's parts
    const joinedText = messagesTruncated
      .map((m) =>
        m.parts
          .filter((p): p is MessagePart => p.type === "text")
          .map((p) => p.text)
          .join(" "),
      )
      .join("\n");

    const embedding = await getEmbedding(joinedText);
    const { userId } = await auth();
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
      filter: { userId },
    });
    // cast to number because notes.id is a PgSerial (number)
    const matches = vectorQueryResponse.matches.map((match) =>
      Number(match.id),
    );
    const relevantNotes = await db
      .select()
      .from(notes)
      .where(inArray(notes.id, matches));
    // console.log("Query Result ", relevantNotes);

    // Flatten your notes into a context string
    const notesContext =
      "You are an intelligent note-taking app. Answer based only on these notes:\n\n" +
      relevantNotes
        .map((note) => `Title: ${note.title}\nContent:\n${note.content}`)
        .join("\n\n");
    const systemMessage: SystemModelMessage = {
      role: "system",
      content: notesContext,
    };
    const response = await streamText({
      model: google("gemini-2.0-flash"),
      messages: [systemMessage, ...convertToModelMessages(messagesTruncated)],
    });
    // console.log("google gemini response", response);
    return response.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: false,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
