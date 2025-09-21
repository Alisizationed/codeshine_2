'use client';

import { Card } from "@/components/ui/card"
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import AboutCard from "@/components/cards/aboutcard";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { content: input, role: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Simulate AI response for demo purposes
    setTimeout(() => {
      const responses = [
        "Hello! I'm a demo AI assistant. To get real AI responses, you'll need a valid Groq API key.",
        "I can help you with questions, but I'm currently running in demo mode.",
        "This is a placeholder response. Please get a Groq API key to enable real AI functionality.",
        "Demo mode: I understand your question, but I need a valid API key to provide real responses.",
        "I'm here to help! However, I'm currently in demo mode. Get a Groq API key to unlock full AI capabilities."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const assistantMessage: Message = { content: randomResponse, role: 'assistant' };
      setMessages([...newMessages, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }
  
  return (    
    <div className="group w-full overflow-auto ">
      {messages.length <= 0 ? ( 
        <div className="max-w-xl mx-auto mt-10">
          <div className="green-card">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-primary">🌿 Demo AI Chat</h3>
              <p className="text-sm text-muted-foreground">Currently in demo mode</p>
            </div>
            <div className="p-6 pt-0 text-sm text-muted-foreground/90 leading-normal prose">
              <p className="mb-3">This is a demo version of the AI chat. To get real AI responses:</p>
              <ol className="list-decimal list-inside mb-3 space-y-1">
                <li>Go to <a href="https://console.groq.com/" target="_blank" className="underline text-primary hover:text-primary/80">https://console.groq.com/</a></li>
                <li>Sign up for a free account</li>
                <li>Create an API key</li>
                <li>Update your .env file with the new key</li>
              </ol>
              <p className="text-primary font-semibold">⚠️ Current API key is invalid. Please get a new one from Groq console.</p>
            </div>
          </div>
        </div>
      ) 
      : (
        <div className="max-w-xl mx-auto mt-10 mb-24">
          {messages.map((message, index) => (
            <div key={index} className="whitespace-pre-wrap flex mb-5">
              <div className={`${message.role === 'user' ? 'bg-secondary ml-auto' : 'bg-muted'} p-3 rounded-lg shadow-sm`}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex mb-5">
              <div className="bg-muted p-3 rounded-lg shadow-sm">
                <div className="animate-pulse text-primary">🌿 AI is thinking...</div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="fixed inset-x-0 bottom-10 w-full ">
        <div className="w-full max-w-xl mx-auto">
          <Card className="p-2">
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="text"
                  value={input}
                  onChange={event => {
                    setInput(event.target.value);
                  }}
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:border-none border-transparent focus:border-transparent focus-visible:ring-none green-input"
                  placeholder='Ask me anything...'
                  disabled={isLoading}
                />
                <Button disabled={!input.trim() || isLoading} className="green-button">
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
