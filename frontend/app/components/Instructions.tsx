import SectionCard from "./SectionCard";

export default function Instructions() {
  return (
    <SectionCard title="💻 How To Use" subtitle="Open your terminal and run one command.">
      <div className="notice-card" style={{ borderLeftColor: "var(--primary-2)" }}>
        <h3>⚡ No server needed — everything runs locally</h3>
        <ol>
          <li>Open your terminal</li>
          <li>Run <code className="inline-code">npx zero-config-cli my-project</code></li>
          <li>Follow the interactive prompts (5 steps)</li>
          <li>Choose to install dependencies (optional)</li>
          <li>Start coding!</li>
        </ol>
      </div>

      <p className="section-subtitle">Looking for the old web generator?</p>
      <p>
        The project generator has moved to the CLI for a faster, more flexible experience.
        The web app now serves as documentation and a quick reference for available stacks.
      </p>
    </SectionCard>
  );
}