import Note from "@/components/ui/Note";
import { getUserNotes } from "@/db/repositories/notes";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

// import React from 'react'
export const metadata: Metadata = {
  title: "MemoAI - Notes",
};
export default async function NotesPage() {
  const { userId } = await auth();
  if (!userId) throw Error("UserId Undefined");
  const allNotes = await getUserNotes(userId);
  console.log(allNotes);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {" You don't have any notes yet. You should create one?"}
        </div>
      )}
    </div>
  );
}
