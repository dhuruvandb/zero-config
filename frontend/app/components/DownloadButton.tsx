interface DownloadButtonProps {
  loading: boolean;
  canDownload: boolean;
  onDownload: () => void;
}

export default function DownloadButton({
  loading,
  canDownload,
  onDownload,
}: DownloadButtonProps) {
  return (
    <button
      type="button"
      className="primary-button"
      onClick={onDownload}
      disabled={loading || !canDownload}
    >
      {loading ? "Generating..." : "Download Stack"}
    </button>
  );
}
