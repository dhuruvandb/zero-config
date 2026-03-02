"use client";

import { useState } from "react";
import type { TemplateKey } from "./data/templates";
import Header from "./components/Header";
import StackSelector from "./components/StackSelector";
import Instructions from "./components/Instructions";
import SelectedStack from "./components/SelectedStack";
import DownloadButton from "./components/DownloadButton";
import Footer from "./components/Footer";
import { useTemplateDownload } from "./client/useTemplateDownload";

export default function Home() {
  const [selectedFrontend, setSelectedFrontend] = useState<TemplateKey | null>(
    null
  );
  const [selectedBackend, setSelectedBackend] = useState<TemplateKey | null>(
    null
  );
  const { loading, error, setError, downloadTemplates } = useTemplateDownload();

  const isStandalone = selectedFrontend === "nextjs";
  const canDownload = Boolean(
    isStandalone || (selectedFrontend && selectedBackend)
  );

  const handleDownload = async () => {
    if (isStandalone) {
      await downloadTemplates({
        templates: ["nextjs"],
        filename: "nextjs-fullstack.zip",
        errorMessage: "Failed to generate template",
      });
      return;
    }

    if (!selectedFrontend || !selectedBackend) {
      setError("Please select both a frontend and a backend");
      return;
    }

    await downloadTemplates({
      templates: [selectedFrontend, selectedBackend],
      filename: `${selectedFrontend}-${selectedBackend}-stack.zip`,
      errorMessage: "Failed to generate templates",
    });
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <StackSelector
          selectedFrontend={selectedFrontend}
          selectedBackend={selectedBackend}
          isStandalone={isStandalone}
          onSelectFrontend={setSelectedFrontend}
          onSelectBackend={setSelectedBackend}
          onClearBackend={() => setSelectedBackend(null)}
          onClearError={() => setError(null)}
        />

        <Instructions
          isStandalone={isStandalone}
          selectedFrontend={selectedFrontend}
          selectedBackend={selectedBackend}
        />

        {error ? (
          <div className="error-banner" role="alert">
            {error}
          </div>
        ) : null}

        <SelectedStack
          isStandalone={isStandalone}
          selectedFrontend={selectedFrontend}
          selectedBackend={selectedBackend}
        />

        <DownloadButton
          loading={loading}
          canDownload={canDownload}
          onDownload={handleDownload}
        />
      </main>
      <Footer />
    </div>
  );
}