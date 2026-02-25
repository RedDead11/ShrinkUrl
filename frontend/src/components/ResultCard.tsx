import { useState } from "react";
import { BsCopy } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { API_BASE_URL } from "../config";

interface Props {
  shortCode: string;
  onReset: () => void;
}

const ResultCard = ({ shortCode, onReset }: Props) => {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${API_BASE_URL}/${shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="short-link-display">
          <span className="short-link-text">{shortUrl}</span>
          <button
            onClick={handleCopy}
            className={`copy-btn ${copied ? "copied" : ""}`}
            aria-label="Copy short link"
          >
            <BsCopy /> {copied ? "Copied!" : "Copy Link"}
          </button>
          
          {/* FIXED: Added <a */}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-btn"
          >
            <FaExternalLinkAlt /> Visit
          </a>
        </div>
      </div>
      <button className="reset-link-btn" onClick={onReset}>
        Shorten another
      </button>
    </div>
  );
};

export default ResultCard;