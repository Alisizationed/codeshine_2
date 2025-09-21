<<<<<<< HEAD

'use client';
import Chat from "@/components/chat";
import { signIn } from "next-auth/react";

export default async function Home() {
  return <Chat />;
}
=======
import Chat from "@/components/chat";

export default function Home() {
  return (
    <>
    <Chat/>
    </>
  )
}
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
