function App() {
  return (
    <div className="shell">
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      <header className="topbar">
        <div>
          <p className="eyebrow">TypeScript Frontend</p>
          <h1>A portfolio shell that now lives in TSX.</h1>
        </div>
      </header>

      <main className="grid">
        <section className="hero panel">
          <p className="kicker">React + TypeScript</p>
          <p className="lede">
            This UI is rendered from React components, typed with TypeScript, and bundled through
            Vite.
          </p>
        </section>

        <section className="panel">
          <p className="section-label">Run it</p>
          <div className="command-stack">
            <code>npm install</code>
            <code>npm run dev</code>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;