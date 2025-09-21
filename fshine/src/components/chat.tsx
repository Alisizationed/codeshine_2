'use client';

import { Card } from "@/components/ui/card";
import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import AboutCard from "@/components/cards/aboutcard";
import { useStreamLlamaResponse } from "@/api/apiComponents";

export const maxDuration = 30;

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const mutation = useStreamLlamaResponse({
    onSuccess: (chunk: any) => {
      if (!chunk || typeof chunk !== "string") return;

      // Split streaming data by lines starting with "data:"
      const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

      lines.forEach((line) => {
        try {
          const json = JSON.parse(line.replace(/^data:/, ""));
          if (json.response === undefined) return;

          setMessages((prev) => {
            const last = prev[prev.length - 1];

            // Append to last assistant message if it's streaming
            if (last?.role === "assistant" && !json.done) {
              return [
                ...prev.slice(0, -1),
                { ...last, content: (last.content as string) + json.response },
              ];
            }

            // Otherwise create a new assistant message
            return [
              ...prev,
              { role: "assistant", content: json.response },
            ];
          });
        } catch (err) {
          console.error("Failed to parse chunk:", line, err);
        }
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];
    setMessages(newMessages);

    mutation.mutate({ body: input });

    setInput("");
  };

  return (
    <div className="group w-full overflow-auto">
      {messages.length <= 0 ? (
        <AboutCard />
      ) : (
        <div className="max-w-xl mx-auto mt-10 mb-24">
          {messages.map((message, index) => (
            <div key={index} className="whitespace-pre-wrap flex mb-5">
              <div
                className={`${
                  message.role === "user"
                    ? "bg-slate-200 ml-auto"
                    : "bg-gray-100"
                } p-2 rounded-lg`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-10 w-full">
        <div className="w-full max-w-xl mx-auto">
          <Card className="p-2">
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                  placeholder="Ask me anything..."
                />
                <Button disabled={!input.trim() || mutation.isPending}>
                  <IconArrowUp />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
