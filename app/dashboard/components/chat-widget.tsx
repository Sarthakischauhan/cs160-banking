// components/ChatWidget.tsx
"use client";
import { BotIcon } from "lucide-react";
import React, { useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage(goalAmount?: number) {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userMsg.text }),
      });

      const json = await res.json();
      const assistantText = json.assistant ?? "Sorry, no reply.";
      const assistantMsg: Message = {
        id: "a-" + Date.now().toString(),
        role: "assistant",
        text: assistantText,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: "e-" + Date.now().toString(),
          role: "assistant",
          text: "Error contacting assistant.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(
        () =>
          scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          }),
        50,
      );
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="
          fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg 
          bg-blue-600 text-white flex items-center justify-center
          dark:bg-blue-500 hover:cursor-pointer
        "
        aria-label="Open assistant"
      >
        <BotIcon className="w-7 h-7" />
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="
            fixed bottom-20 right-6 z-50 w-80 max-h-[70vh] flex flex-col
            bg-white border rounded-lg shadow-xl
            dark:bg-gray-900 dark:border-gray-700
          "
        >
          {/* Header */}
          <div className="px-4 py-2 border-b dark:border-gray-700">
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              Financial Assistant
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Ask about buying a house, budgets, and timelines.
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`
                    inline-block px-3 py-1 rounded-md
                    ${
                      m.role === "user"
                        ? "bg-blue-100 text-gray-900 dark:bg-blue-600/40 dark:text-gray-100"
                        : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    }
                  `}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything..."
                className="
                  flex-1 px-3 py-2 rounded-md text-sm border 
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                "
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="
                  px-3 py-2 rounded-md bg-blue-600 text-white
                  dark:bg-blue-500
                "
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tip: include your savings goal in your message.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
