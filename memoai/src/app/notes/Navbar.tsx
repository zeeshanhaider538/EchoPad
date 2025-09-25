"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteDialoge from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
export default function Navbar() {
  const { theme } = useTheme();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className="max-w-7xl m-auto flex justify-between items-center flex-wrap gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image
              src={logo}
              alt="Memo AI logo"
              width={40}
              height={40}
              className="w-auto h-auto"
            />
            <span className="font-bold pt-2.5">Memo AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                theme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton />
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>
      <AddNoteDialoge
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
}
