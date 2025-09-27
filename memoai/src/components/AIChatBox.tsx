import { cn } from "@/lib/utils";
import { UIMessage, useChat } from "@ai-sdk/react";
import { Bot, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const { messages, sendMessage, error, setMessages } = useChat();
  const [input, setInput] = useState("");
  //   console.log("Ai Chatbot box open ", open);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(
      { text: input },

      //   {
      //     data: { userId: "123", source: "chatbox" },
      //   }
    );
    setInput("");
  };
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <div className="flex max-h-[70vh] flex-col">
        <button onClick={onClose} className="mb-1 ms-auto block">
          <XCircle size={30} />
        </button>
        <div className="flex h-[600px] flex-col rounded bg-background shadow-xl border">
          <div className="h-full mt-3 px-3 overflow-y-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} status={status} />
            ))}
          </div>
          <form onSubmit={handleSubmit} className="m-3 flex gap-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say Something ..."
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({
  message,
  status,
}: {
  message: UIMessage;
  status: string;
}) {
  const { user } = useUser();
  const isAiMessage = message.role === "assistant";

  console.log("loading on req", status);

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}

      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {message.parts.map((part, idx) =>
          part.type === "text" ? <span key={idx}>{part.text}</span> : null,
        )}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User Image"
          height={100}
          width={100}
          className="ml-2 rounded-full w-10 h-10 object-cover"
        />
      )}
    </div>
  );
}
