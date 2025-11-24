"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TextCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // reset after 1.5s
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={copyToClipboard}
      className="flex items-center gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
