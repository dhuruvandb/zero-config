import GithubStarLink from "./GithubStarLink";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="header-band">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="header-top">
          <div className="header-kicker">Zero-Config Starter Hub</div>
          <div className="header-actions">
            <GithubStarLink />
            <ThemeToggle />
          </div>
        </div>
        <h1 className="header-title">🚀 Zero-Config Starter Templates</h1>
        <p className="header-subtitle">
          Download, Install, Run - Start Building Instantly.
        </p>
      </div>
    </header>
  );
}
