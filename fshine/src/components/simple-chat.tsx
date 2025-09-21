'use client';

import { Card } from "@/components/ui/card"
import { useState } from 'react';
import { callGroqDirect } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import AboutCard from "@/components/cards/aboutcard";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SimpleChat() {
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

    try {
      const response = await callGroqDirect(input);
      const assistantMessage: Message = { content: response, role: 'assistant' };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage: Message = { 
        content: 'Sorry, there was an error connecting to the AI. Please check your API key.', 
        role: 'assistant' 
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (    
    <div className="group w-full overflow-auto ">
      {messages.length <= 0 ? ( 
        <AboutCard />  
      ) 
      : (
        <div className="max-w-xl mx-auto mt-10 mb-24">
          {messages.map((message, index) => (
            <div key={index} className="whitespace-pre-wrap flex mb-5">
              <div className={`${message.role === 'user' ? 'bg-slate-200 ml-auto' : 'bg-transparent'} p-2 rounded-lg`}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex mb-5">
              <div className="bg-transparent p-2 rounded-lg">
                <div className="animate-pulse">AI is thinking...</div>
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
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:border-none border-transparent focus:border-transparent focus-visible:ring-none"
                  placeholder='Ask me anything...'
                  disabled={isLoading}
                />
                <Button disabled={!input.trim() || isLoading}>
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
