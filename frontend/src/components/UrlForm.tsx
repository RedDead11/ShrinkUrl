import { useState } from "react";
import { BsCopy } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GoHistory } from "react-icons/go";
import "./UrlForm.css"; 

interface HistoryItem {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
}

const formatOriginalUrl = (url: string, maxLen = 38): string => {
  try {
    const { hostname, pathname, search } = new URL(url);
    const path = (pathname + search).replace(/\/$/, "");
    const display = hostname + path;
    return display.length > maxLen ? display.slice(0, maxLen) + "…" : display;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen) + "…" : url;
  }
};

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // FIX 1: Clear old errors when starting a new request
    
    if (!url) return;

    // Frontend validation logic
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
    setCopied(false);

    try {
      const res = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Something went wrong");
        return;
      }

      const data = await res.json();
      if (data.shortCode) {
        setShortCode(data.shortCode);
        const newItem: HistoryItem = {
          originalUrl: url,
          shortCode: data.shortCode,
          shortUrl: `http://localhost:3000/${data.shortCode}`,
        };
        setHistory((prev) => [newItem, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleMainCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHistoryCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setUrl("");
    setShortCode("");
    setCopied(false);
    setError(null);
  };

  return (
    <div className="url-form">
      {!shortCode ? (
        <>
          <form onSubmit={handleSubmit} className="input-section">
            <input
              type="text"
              placeholder="Paste your long link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="main-btn" disabled={loading || !url}>
              {loading ? <span className="spinner"></span> : "Shorten"}
            </button>
          </form>
          {/* FIX 2: Render the error message below the form */}
          {error && <div className="error-message">{error}</div>}
        </>
      ) : (
        <div className="result-container">
          <div className="result-card">
            <div className="short-link-display">
              <span className="short-link-text">
                http://localhost:3000/{shortCode}
              </span>
              <button
                onClick={handleMainCopy}
                className={`copy-btn ${copied ? "copied" : ""}`}
                aria-label="Copy short link"
              >
                <BsCopy /> {copied ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={`http://localhost:3000/${shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-btn"
              >
                <FaExternalLinkAlt /> Visit
              </a>
            </div>
          </div>

          <button className="reset-link-btn" onClick={resetForm}>
            Shorten another
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-container">
          <h2 className="history-title">
            <GoHistory /> Recent Links
          </h2>
          <div className="history-list">
            {history.map((item, index) => (
              <div className="history-card" key={index}>
                <div className="history-urls">
                  <span className="history-original" title={item.originalUrl}>
                    {formatOriginalUrl(item.originalUrl)}
                  </span>
                  <span className="history-short">{item.shortUrl}</span>
                </div>
                <div className="history-actions">
                  <button
                    className="history-copy-btn"
                    onClick={() => handleHistoryCopy(item.shortUrl)}
                    title="Copy short link"
                  >
                    <BsCopy />
                  </button>
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="history-visit-btn"
                    title="Visit link"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;