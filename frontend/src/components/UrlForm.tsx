import { useState } from "react";
import { BsCopy } from "react-icons/bs";  // Add this import

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.shortCode) setShortCode(data.shortCode);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setUrl("");
    setShortCode("");
    setCopied(false);
  };

  return (
    <div className="url-form">
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

      {shortCode && (
        <div className="result-container">
          <p className="success-msg">Your short link is ready!</p>
          
          <div className="result-card">
            <div className="short-link-display">
              <span className="short-link-text">http://localhost:3000/{shortCode}</span>
              <button 
                onClick={handleCopy} 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                aria-label="Copy short link"
              >
                {copied ? (
                  <>
                    <BsCopy /> Copied!
                  </>
                ) : (
                  <>
                    <BsCopy /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <button className="secondary-btn" onClick={resetForm}>
            Shorten another
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
