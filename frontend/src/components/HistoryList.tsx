import { BsCopy } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GoHistory } from "react-icons/go";
import type { HistoryItem } from "./UrlShortener";

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

interface Props {
  history: HistoryItem[];
  onClear: () => void;
}

const HistoryList = ({ history, onClear }: Props) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="history-container">
      <h2 className="history-title">
        <GoHistory /> Recent Links
      </h2>
      <button className="clear-history-btn" onClick={onClear}>
        Clear
      </button>
      <div className="history-list">
        {history.map((item, index) => (
          <div className="history-card" key={index}>
            <div className="history-urls">
              <span className="history-original" title={item.originalUrl}>
                {formatOriginalUrl(item.originalUrl)}
              </span>
              <span className="history-short">{item.shortUrl}</span>
              <span className="history-clicks-badge">
                {item.clicks} {item.clicks === 1 ? "visit" : "visits"}
              </span>
            </div>
            <div className="history-actions">
              <button
                className="history-copy-btn"
                onClick={() => handleCopy(item.shortUrl)}
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
  );
};

export default HistoryList;
