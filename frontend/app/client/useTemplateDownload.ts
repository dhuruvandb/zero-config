"use client";

import { useState } from "react";

const DEFAULT_BACKEND_URL = "http://localhost:8000";

interface DownloadPayload {
  templates: string[];
  filename: string;
  errorMessage: string;
}

export function useTemplateDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplates = async ({
    templates,
    filename,
    errorMessage,
  }: DownloadPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL}/api/templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ templates }),
        }
      );

      if (!response.ok) {
        let detail = "";
        try {
          const errorData = await response.json();
          detail = errorData?.message || "";
        } catch {
          detail = "";
        }
        throw new Error(detail || errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download templates. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, downloadTemplates };
}
