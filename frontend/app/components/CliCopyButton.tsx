"use client";

import { useState } from "react";

interface CliCopyButtonProps {
  command: string;
}

export default function CliCopyButton({ command }: CliCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      className="cli-copy-button"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy command"}
    >
      {copied ? "✓ Copied!" : "📋 Copy"}
    </button>
  );
}
