import { useEffect, useState } from "react";
import UrlForm from "./UrlForm";
import ResultCard from "./ResultCard";
import HistoryList from "./HistoryList";
import { API_BASE_URL } from "../config";

export interface HistoryItem {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
}

const HISTORY_KEY = "shrinkurl_history";

const loadHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history: HistoryItem[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    console.error("Failed to save history to localStorage");
  }
};

const UrlShortener = () => {
  const [shortCode, setShortCode] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);

  useEffect(() => {
    const refreshClicks = async () => {
      // Only run if there is actually history to refresh
      if (history.length === 0) return;

      try {
        const updated = await Promise.all(
          history.map(async (item) => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/stats/${item.shortCode}`,
              );
              if (!res.ok) return item; // Handle 404s/errors
              const data = await res.json();
              return { ...item, clicks: data.clicks ?? item.clicks };
            } catch {
              return item;
            }
          }),
        );

        // Set history INSIDE the async function
        setHistory(updated);
        saveHistory(updated);
      } catch (err) {
        console.error("Refresh failed", err);
      }
    };

    refreshClicks();
    // Empty array means: "Only run this once when the component mounts"
  }, []);

  const handleSuccess = async (originalUrl: string, code: string) => {
    setShortCode(code);

    let clicks = 0;
    try {
      const res = await fetch(`${API_BASE_URL}/stats/${code}`);
      const data = await res.json();
      clicks = data.clicks ?? 0;
    } catch {
      // if stats fail, just default to 0
    }

    const newItem: HistoryItem = {
      originalUrl,
      shortCode: code,
      shortUrl: `${API_BASE_URL}/${code}`,
      clicks,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 5);
      saveHistory(updated);
      return updated;
    });
  };

  const handleReset = () => {
    setShortCode("");
  };

  const handleClear = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <div className="url-form">
      {!shortCode ? (
        <UrlForm onSuccess={handleSuccess} />
      ) : (
        <ResultCard shortCode={shortCode} onReset={handleReset} />
      )}
      {history.length > 0 && <HistoryList history={history} onClear={handleClear}/>}
    </div>
  );
};

export default UrlShortener;
