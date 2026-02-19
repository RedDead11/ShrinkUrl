import { useState } from "react";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.shortCode) setShortCode(data.shortCode);
      else alert("Error creating short URL");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="url-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>

      {shortCode && (
        <div className="result">
          Short URL:{" "}
          <a
            href={`http://localhost:3000/${shortCode}`}
            target="_blank"
            rel="noreferrer"
          >
            {`http://localhost:3000/${shortCode}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
