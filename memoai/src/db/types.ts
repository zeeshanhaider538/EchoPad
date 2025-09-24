// src/db/types.ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { notes } from "./schema";

// Row type (full object when selecting from DB)
export type Note = InferSelectModel<typeof notes>;

// Insert payload type (for db.insert)
export type NewNote = InferInsertModel<typeof notes>;

// Update payload type (all fields optional, e.g. PATCH)
export type UpdateNote = Partial<NewNote>;
