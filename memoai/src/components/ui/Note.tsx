import { Note as NoteModal } from "@/db/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

interface NoteProp {
  note: NoteModal;
}

export default function Note({ note }: NoteProp) {
  const wasUpdated = !!note.updated_at && note.updated_at > note.created_at;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updated_at : note.created_at
  )?.toDateString();
  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        // onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          {/* <CardContent>{note.content ? note.content : null}</CardContent> */}
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (Updated)"}
          </CardDescription>
          <CardContent>
            <p className="whitespace-pre-line">{note.content}</p>
          </CardContent>
        </CardHeader>
      </Card>
      {/* <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
      /> */}
    </>
  );
}
