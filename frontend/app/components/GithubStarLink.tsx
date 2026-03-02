const REPO_URL = "https://github.com/dhuruvandb/zero-config";

export default function GithubStarLink() {
  return (
    <a
      className="github-link"
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Star zero-config on GitHub"
    >
      <span className="github-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          role="img"
          focusable="false"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.59 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.66-.22.66-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.54 1.07 1.54 1.07.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05a9.26 9.26 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.64 1.03 2.76 0 3.92-2.34 4.78-4.57 5.03.36.32.68.96.68 1.94 0 1.4-.01 2.53-.01 2.88 0 .27.18.59.67.49A10.02 10.02 0 0 0 22 12.26C22 6.59 17.52 2 12 2z" />
        </svg>
      </span>
      <span className="github-text">GitHub</span>
    </a>
  );
}
