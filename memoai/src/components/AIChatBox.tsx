import { cn } from "@/lib/utils";
import { UIMessage, useChat } from "@ai-sdk/react";
import { Bot, Trash, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const { messages, sendMessage, error, setMessages, status } = useChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);
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

  const isLastMessageIsUser = messages[messages.length - 1]?.role === "user";

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
        <div className="flex h-[600px] flex-col rounded bg-background shadow-xl border overflow-y-auto">
          <div className="h-full mt-3 px-3 overflow-y-auto" ref={scrollRef}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLastMessageIsUser && status === "submitted" && (
              <ChatMessage
                message={{
                  id: "thinking",
                  role: "assistant",
                  parts: [{ type: "text", text: "Thinking..." }],
                }}
              />
            )}
            {error && (
              <ChatMessage
                message={{
                  id: "error",
                  role: "assistant",
                  parts: [
                    {
                      type: "text",
                      text: "Something went wrong. Please Try again later.",
                    },
                  ],
                }}
              />
            )}
            {!error && messages.length === 0 && (
              <div className="flex justify-center items-center h-full gap-3">
                <Bot />
                Ask the AI a question about your Notes.
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="m-3 flex gap-1 h-auto">
            <Button
              title="Clear Chat"
              variant="outline"
              size="icon"
              type="button"
              className="shrink-0"
              onClick={() => setMessages([])}
            >
              <Trash />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say Something ..."
              ref={inputRef}
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: UIMessage }) {
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
