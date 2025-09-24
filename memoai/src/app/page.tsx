import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/notes");
  return (
    <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="MemoAI logo" width={100} height={100} />
        <span className="font-extrabold tracking-tight text-4xl lg:text-5xl pt-6">
          Memo AI
        </span>
      </div>
      <p className="text-center max-w-prose">
        An Intelligent Note Taking app with AI Integrations, built with OpenAI,
        Pinecone, Next.js, Shadcn UI, Clerk and more...
      </p>

      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
