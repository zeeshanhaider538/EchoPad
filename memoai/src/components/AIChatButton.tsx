"use client";
import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

export function AIChatBotButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  //   console.log("chatBoxOpen", chatBoxOpen);
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
