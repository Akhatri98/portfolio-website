import { useEffect, useState } from "react";

type ApiItem = {
  id: number;
  name: string;
  value: number;
};

type ApiResponse = {
  data: ApiItem[];
  total: number;
  timestamp: string;
};

function App() {
  const [payload, setPayload] = useState<ApiResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const json = (await response.json()) as ApiResponse;
        if (!cancelled) {
          setPayload(json);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="shell">
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      <header className="topbar">
        <div>
          <p className="eyebrow">TypeScript Frontend</p>
          <h1>A portfolio shell that now lives in TSX.</h1>
        </div>
        <a className="ghost-link" href="/api/data" target="_blank" rel="noreferrer">
          Inspect API
        </a>
      </header>

      <main className="grid">
        <section className="hero panel">
          <p className="kicker">React + Flask</p>
          <p className="lede">
            The old static page is gone. This UI is rendered from React components, typed with
            TypeScript, and hydrated through Vite.
          </p>

          <div className="code-card">
            <span className="dot" />
            <code>fetch("/api/data") -&gt; render cards -&gt; ship</code>
          </div>
        </section>

        <section className="panel status-panel">
          <p className="section-label">Backend status</p>
          <div className={`status-pill status-${status}`}>
            <span />
            {status === "loading" && "Loading sample data"}
            {status === "ready" && "API connected"}
            {status === "error" && "API unavailable"}
          </div>

          <p className="muted">
            {payload
              ? `Received ${payload.total} records at ${new Date(payload.timestamp).toLocaleString()}.`
              : "The interface will populate once the Flask API responds."}
          </p>
        </section>

        <section className="panel">
          <p className="section-label">Sample data</p>
          <div className="card-list">
            {payload?.data.map((item) => (
              <article key={item.id} className="data-card">
                <div>
                  <p className="card-title">{item.name}</p>
                  <p className="muted">Item #{item.id}</p>
                </div>
                <strong>${item.value}</strong>
              </article>
            ))}

            {!payload && (
              <article className="data-card placeholder">
                <p className="card-title">Waiting for API payload</p>
                <p className="muted">Start Flask and this panel will fill in automatically.</p>
              </article>
            )}
          </div>
        </section>

        <section className="panel">
          <p className="section-label">Run it</p>
          <div className="command-stack">
            <code>npm install</code>
            <code>npm run dev</code>
            <code>flask --app main run</code>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;