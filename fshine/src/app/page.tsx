
'use client';
import Chat from "@/components/chat";
import { signIn } from "next-auth/react";

export default async function Home() {
  return <Chat />;
}