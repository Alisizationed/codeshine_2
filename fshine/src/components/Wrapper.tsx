"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import LoadingElement from "./ui/loading-circle";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  return <>{children}</>;

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn();
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return <LoadingElement />;
  }

  return <>{children}</>;
};

export default Wrapper;
