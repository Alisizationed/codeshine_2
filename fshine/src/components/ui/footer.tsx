"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-10">
      <Separator />
      <Card className="rounded-none shadow-none border-none bg-transparent">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-2 py-6 text-sm text-muted-foreground">
          <div>© {year} AgroTech. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
