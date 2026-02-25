import { useState } from "react";
import { API_BASE_URL } from "../config";

interface Props {
  onSuccess: (originalUrl: string, shortCode: string) => void;
}

const UrlForm = ({ onSuccess }: Props) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!url) return;

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Only http and https URLs are supported.");
        return;
      }
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (res.status === 429) {
        setError("Too many requests, please wait a few minutes.");
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Something went wrong");
        return;
      }

      const data = await res.json();
      if (data.shortCode) {
        onSuccess(url, data.shortCode);
        setUrl("");
      }
    } catch {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="input-section">
        <input
          type="text"
          placeholder="Paste your long link here..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          disabled={loading}
        />
        <button type="submit" className="main-btn" disabled={loading || !url}>
          {loading ? <span className="spinner"></span> : "Shorten"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default UrlForm;