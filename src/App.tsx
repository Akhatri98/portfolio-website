import { useEffect, useState, type ReactNode } from 'react';

/* A plain, single-page CV. All content lives in the data blocks below;
   the components under them do nothing but lay it out in reading order. */

const PROFILE = {
  name: 'Adeel Khatri',
  role: 'Mathematics & Computer Science, NYU Courant',
  location: 'New York, NY',
  blurb: [
    'I\'m still thinking about what to put here. Stay tuned.',
  ],
};

const CONTACT = [
  { text: 'adeelkhatri98@gmail.com', href: 'mailto:adeelkhatri98@gmail.com' },
  { text: 'ak14245@nyu.edu', href: 'mailto:ak14245@nyu.edu' },
  { text: 'GitHub', href: 'https://github.com/Akhatri98' },
  { text: 'LinkedIn', href: 'https://linkedin.com/in/adeelk98' },
];

const PROJECTS: {
  name: string; stack: string; status: 'active' | 'in progress' | 'archived';
  yr: number; repo: string; note: string;
}[] = [
    {
      name: 'Finley, a live-data trading RAG', stack: 'Python, RAG, Gemini, Pinecone',
      status: 'active', yr: 2026,
      repo: 'https://github.com/Akhatri98/nytw_mmhacks_finley', note: '',
    },
    {
      name: 'Equity news prediction model', stack: 'Python, scikit-learn, Flask, Docker',
      status: 'active', yr: 2026,
      repo: 'https://github.com/Akhatri98/TF-IDF-news-model', note: '',
    },
    {
      name: 'Cross-asset momentum allocator', stack: 'Python, pandas, Streamlit',
      status: 'archived', yr: 2025,
      repo: '', note: 'Private — I use this to actually trade, so I\'m not comfortable sharing the code publicly.',
    },
    {
      name: 'This website', stack: 'React, Vite, TypeScript',
      status: 'active', yr: 2026,
      repo: 'https://github.com/Akhatri98/portfolio-website', note: '',
    },
    {
      name: 'NHANES data analysis', stack: 'Python, pandas, scikit-learn',
      status: 'in progress', yr: 2026,
      repo: 'https://github.com/Akhatri98/NHANES-model', note: '',
    },
    {
      name: 'Job aggregator', stack: 'Python, Open Crawl, Supabase',
      status: 'active', yr: 2026,
      repo: 'https://internships.akhatri.dev/', note: '',
    },
    {
      name: 'LangChain Discord agent', stack: 'Python, LangChain, APIs',
      status: 'archived', yr: 2025,
      repo: '', note: 'Repo is private, but I\'m happy to share details of my work upon request.',
    },
    {
      name: 'Socratic AI', stack: 'Flask, TypeScript, n8n',
      status: 'archived', yr: 2025,
      repo: 'https://github.com/arkanemystic/socraticAI', note: '',
    },
  ];

const EXPERIENCE = [
  {
    role: 'Engineer',
    co: 'Biject',
    when: 'May 2026 — present',
    bullets: ['Biject Boy.'],
  },
  {
    role: 'Software engineering intern',
    co: 'Hawala',
    when: 'June 2025 — August 2025',
    bullets: ['Full-stack development on web applications using React, TypeScript, and Supabase.'],
  },
  {
    role: 'Undergraduate research assistant',
    co: 'Ohio State University, College of Veterinary Medicine',
    when: 'February 2025 — February 2026',
    bullets: ['Data extraction and analysis with OCR pipelines and R.'],
  },
  {
    role: 'IT assistant',
    co: 'Ohio State University, Fisher College of Business',
    when: 'September 2024 — May 2026',
    bullets: ['AV and network install and maintenance.'],
  },
  {
    role: 'MCM coordinator',
    co: 'SIAM Student Chapter at Ohio State',
    when: 'August 2025 — May 2026',
    bullets: ['Event coordination.'],
  },
];

const EDUCATION = [
  {
    role: 'B.A. Mathematics',
    co: 'New York University',
    when: 'September 2026 — May 2028',
    bullets: ['Joint mathematics and computer science program.', 'B.A. / M.S. program potentially, TBD'],
  },
  {
    role: 'Transfer',
    co: 'The Ohio State University',
    when: 'August 2024 — May 2026',
    bullets: [
      'Pursued a B.S. in Computer Science & Engineering and a B.S. in Mathematics.',
      'Directed reading program in number theory.',
    ],
  },
  {
    role: 'Dual enrollment',
    co: 'The University of Toledo',
    when: 'August 2023 — May 2024',
    bullets: ['A lot of math and physics coursework.'],
  },
  {
    role: 'Dual enrollment',
    co: 'Bowling Green State University',
    when: 'January 2022 — July 2023',
    bullets: ['Spanish coursework for the most part.'],
  },
  {
    role: 'Honors high school diploma',
    co: 'Undisclosed',
    when: 'August 2020 — May 2024',
    bullets: ['Ranked in the top 5% of the graduating class.'],
  },
];

/* `term` marks a course that hasn't been taken yet; everything without one is
   finished. */
const COURSES: {
  field: string;
  items: { name: string; focus: string; term?: string }[];
}[] = [
    {
      field: 'Mathematics',
      items: [
        { name: 'AP Calculus 2', focus: 'limits, differentiation, integration, series' },
        { name: 'Calculus 3', focus: 'multivariable calculus, partial derivatives, multiple integrals' },
        { name: 'Linear Algebra', focus: 'vector spaces, eigentheory' },
        { name: 'Differential Equations', focus: 'ordinary differential equations, Laplace transforms' },
        { name: 'Partial Differential Equations', focus: 'heat and wave equations, separation of variables, Fourier series' },
        { name: 'Abstract Algebra', focus: 'groups, rings, fields' },
        { name: 'Real Analysis', focus: 'sequences, continuity, metric spaces' },
        { name: 'Discrete Math', focus: 'combinatorics, logic, graph theory, proof techniques' },
        { name: 'Probability', focus: 'combinatorics, random variables, distributions' },
        { name: 'Statistics', focus: 'estimation, hypothesis testing, regression' },
      ],
    },
    {
      field: 'Computer science',
      items: [
        { name: 'AP Computer Science Principles', focus: 'computational thinking, basic data, internet principles' },
        { name: 'AP Computer Science A', focus: 'object-oriented programming, Java, basic algorithms' },
        { name: 'Intro to OOP', focus: 'classes, inheritance, polymorphism' },
        { name: 'Advanced Web Design', focus: 'frontend frameworks, responsive layout' },
        { name: 'Data Structures', focus: 'trees, graphs, hashing, memory management' },
        { name: 'Computer Architecture', focus: 'pipelines, memory hierarchy, ISA, digital logic' },
        { name: 'Operating Systems', focus: 'process scheduling, concurrency, memory management, virtual memory' },
        { name: 'Database Systems', focus: 'relational model, SQL, indexing, schema design' },
        { name: 'Algorithms', focus: 'complexity, dynamic programming, greedy algorithms' },
        { name: 'Python Programming', focus: 'syntax, scripts, data structures' },
        {
          name: 'Algorithmic Problem Solving', focus: 'TBD',
        },
        {
          name: 'Introduction to Computer Security', focus: 'TBD',
        },
        {
          name: 'Applied Internet Technology', focus: 'TBD',
        },
      ],
    },
    {
      field: 'Life sciences',
      items: [
        { name: 'AP Biology', focus: 'cell biology, genetics, evolution, ecology' },
        { name: 'AP Chemistry', focus: 'stoichiometry, thermodynamics, equilibrium, kinetics' },
        { name: 'Intro to Psychology', focus: 'cognition, behavior, research methods' },
        { name: 'AP Physics: Mechanics', focus: 'kinematics, Newtonian dynamics, rotation' },
        { name: 'Physics: Electricity & Magnetism', focus: 'Gauss’s law, circuits, Maxwell’s equations' },

      ],
    },
  ];

const SKILLS = [
  { group: 'Languages', items: 'Python, TypeScript, SQL, R, C, Java, Rust, Lean' },
  { group: 'Machine learning and data', items: 'pandas, NumPy, scikit-learn, SciPy, spaCy' },
  { group: 'Frameworks', items: 'React, Next.js, FastAPI, LangChain, Supabase' },
  { group: 'Infrastructure and tools', items: 'Git, Linux, Docker, HuggingFace, Pinecone' },
];

const READING: { title: string; author: string; tag: string; status: 'reading' | 'done' | 'queued'; rating: number }[] = [
  { title: 'Essential Topology', author: 'M.D. Crossley', tag: 'Mathematics', status: 'reading', rating: 0 },
  { title: 'Being and Nothingness', author: 'Jean-Paul Sartre', tag: 'Philosophy', status: 'reading', rating: 0 },
  { title: 'The Hunchback of Notre-Dame', author: 'Victor Hugo', tag: 'Fiction', status: 'reading', rating: 0 },
  { title: 'Statistical Prediction and Machine Learning', author: 'J.T. Chen', tag: 'Machine learning', status: 'reading', rating: 0 },

  { title: 'The Alchemy of Happiness', author: 'Al-Ghazali', tag: 'Philosophy', status: 'done', rating: 5 },
  { title: 'Meditations', author: 'Marcus Aurelius', tag: 'Philosophy', status: 'done', rating: 3 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', tag: 'Fiction', status: 'done', rating: 5 },
  { title: '1984', author: 'George Orwell', tag: 'Fiction', status: 'done', rating: 4 },
  { title: 'Maxims and Reflections', author: 'J.W. von Goethe', tag: 'Philosophy', status: 'done', rating: 3 },
  { title: 'Elementary Number Theory', author: 'G.A. Jones & J.M. Jones', tag: 'Mathematics', status: 'done', rating: 4 },
  { title: 'The Quran', author: 'Traditional', tag: 'Theology', status: 'done', rating: 5 },
  { title: 'Tao Te Ching', author: 'Lao Tzu', tag: 'Philosophy', status: 'done', rating: 4 },

  { title: 'A Concise Course in Algebraic Topology', author: 'J.P. May', tag: 'Mathematics', status: 'queued', rating: 0 },
  { title: 'Proofs from THE BOOK', author: 'M. Aigner & G.M. Ziegler', tag: 'Mathematics', status: 'queued', rating: 0 },
  { title: 'The Anduril Thesis', author: 'K. Harrison & S. Maini', tag: 'Systems', status: 'queued', rating: 0 },
  { title: 'The Beginning of Guidance', author: 'Al-Ghazali', tag: 'Philosophy', status: 'queued', rating: 0 },
];

const READING_GROUPS: { label: string; status: 'reading' | 'done' | 'queued' }[] = [
  { label: 'Currently reading', status: 'reading' },
  { label: 'Read', status: 'done' },
  { label: 'On the shelf', status: 'queued' },
];

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'coursework', label: 'Coursework' },
  { id: 'reading', label: 'Reading' },
];

type Theme = 'light' | 'dark';

/* The inline script in index.html has already stamped <html data-theme>, so
   we read the edition off the document rather than guessing it again. */
function useEdition(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Until the reader picks an edition, keep following the system setting.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!localStorage.getItem('theme')) setTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    setTheme((cur) => {
      const next: Theme = cur === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private browsing — the choice just won't outlive the tab */
      }
      return next;
    });
  };

  return [theme, toggle];
}

/* Sections are numbered in the order SECTIONS lists them, so the contents up
   top and the headings below can never drift apart. */
function numberOf(id: string) {
  return String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0');
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id}>
      <h2><span className="n">{numberOf(id)}</span>{title}</h2>
      {children}
    </section>
  );
}

function Positions({ rows }: { rows: typeof EXPERIENCE }) {
  return (
    <ul className="entries">
      {rows.map((e) => (
        <li key={`${e.role}-${e.co}`}>
          <p className="entry-head">
            <span className="entry-title">{e.role}</span>
            <span className="entry-date">{e.when}</span>
          </p>
          <p className="entry-sub">{e.co}</p>
          {e.bullets.map((b, j) => <p className="entry-note" key={j}>{b}</p>)}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [theme, toggleEdition] = useEdition();

  return (
    <main>
      <header>
        <h1>{PROFILE.name}</h1>
        <p className="meta">
          <span>{PROFILE.role}</span>
          <span>{PROFILE.location}</span>
        </p>
        <p className="contact">
          {CONTACT.map((c) => (
            <a
              key={c.href}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              {c.text}
            </a>
          ))}
        </p>
      </header>

      <nav>
        <ul className="toc">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                <span className="n">{numberOf(s.id)}</span>{s.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="edition"
          onClick={toggleEdition}
          aria-label={theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </nav>

      <Section id="about" title="About">
        {PROFILE.blurb.map((p, i) => <p key={i}>{p}</p>)}
      </Section>

      <Section id="skills" title="Skills">
        <dl className="pairs">
          {SKILLS.map((s) => (
            <div key={s.group}>
              <dt>{s.group}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="education" title="Education">
        <Positions rows={EDUCATION} />
      </Section>

      <Section id="experience" title="Experience">
        <Positions rows={EXPERIENCE} />
      </Section>

      <Section id="projects" title="Projects">
        <ul className="entries">
          {PROJECTS.map((p) => (
            <li key={p.name}>
              <p className="entry-head">
                <span className="entry-title">
                  {p.repo
                    ? <a href={p.repo} target="_blank" rel="noreferrer">{p.name}</a>
                    : p.name}
                </span>
                <span className="entry-date">{p.yr}</span>
              </p>
              <p className="entry-sub">
                {p.stack} ·{' '}
                <span className="status">{p.status}</span>
              </p>
              {p.note && <p className="entry-note">{p.note}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="coursework" title="Coursework">
        {COURSES.map((g) => (
          <div className="subsection" key={g.field}>
            <h3>{g.field}</h3>
            <ul className="listing">
              {g.items.map((c) => (
                <li key={c.name}>
                  <span className="row-name">
                    {c.name}
                    {c.term && <span className="term">{c.term}</span>}
                  </span>
                  <span className="row-note">{c.focus}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section id="reading" title="Reading">
        {READING_GROUPS.map((g) => (
          <div className="subsection" key={g.status}>
            <h3>{g.label}</h3>
            <ul className="listing">
              {READING.filter((b) => b.status === g.status).map((b) => (
                <li key={b.title}>
                  <span className="row-name title">{b.title}</span>
                  <span className="row-note">
                    {b.author}
                    <span className="muted"> ({b.tag.toLowerCase()})</span>
                    {b.rating > 0 && <span className="rating">{'★'.repeat(b.rating)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

    </main>
  );
}
