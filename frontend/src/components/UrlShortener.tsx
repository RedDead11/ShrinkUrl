import { useState } from "react";
import UrlForm from "./UrlForm";
import ResultCard from "./ResultCard";
import HistoryList from "./HistoryList";
import { API_BASE_URL } from "../config";

export interface HistoryItem {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
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

  const handleSuccess = (originalUrl: string, code: string) => {
    setShortCode(code);
    const newItem: HistoryItem = {
      originalUrl,
      shortCode: code,
      shortUrl: `${API_BASE_URL}/${code}`,
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

  return (
    <div className="url-form">
      {!shortCode ? (
        <UrlForm onSuccess={handleSuccess} />
      ) : (
        <ResultCard shortCode={shortCode} onReset={handleReset} />
      )}
      {history.length > 0 && <HistoryList history={history} />}
    </div>
  );
};

export default UrlShortener;