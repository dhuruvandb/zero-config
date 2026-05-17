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
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const { loading, error, setError, downloadTemplates } = useTemplateDownload();

  const canDownload = Boolean(selectedFrontend && selectedBackend && selectedDatabase);

  const handleDownload = async () => {
    if (!selectedFrontend || !selectedBackend || !selectedDatabase) {
      setError("Please select a frontend, a backend, and a database");
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
          selectedDatabase={selectedDatabase}
          onSelectFrontend={setSelectedFrontend}
          onSelectBackend={setSelectedBackend}
          onSelectDatabase={setSelectedDatabase}
          onClearError={() => setError(null)}
        />

        <Instructions
          selectedFrontend={selectedFrontend}
          selectedBackend={selectedBackend}
          selectedDatabase={selectedDatabase}
        />

        {error ? (
          <div className="error-banner" role="alert">
            {error}
          </div>
        ) : null}

        <SelectedStack
          selectedFrontend={selectedFrontend}
          selectedBackend={selectedBackend}
          selectedDatabase={selectedDatabase}
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