import UrlShortener from "./components/UrlShortener";
import "./App.css";

function App() {
  return (
    <main className="app-container">
      <header className="brand-section">
        <h1>Shrink<span>URL</span></h1>
        <p>Create short, powerful links in seconds.</p>
      </header>
      <UrlShortener />
    </main>
  );
}

export default App;