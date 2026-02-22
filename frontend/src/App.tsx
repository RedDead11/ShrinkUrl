import UrlForm from "./components/UrlForm";
import "./App.css";

function App() {
  return (
    <main className="app-container">
      <header className="brand-section">
        <h1>Shrink<span>URL</span></h1>
        <p>Create short, powerful links in seconds.</p>
      </header>
      <UrlForm />
    </main>
  );
}

export default App;
