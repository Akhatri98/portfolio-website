import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const PROFILE = {
  name: 'ADEEL KHATRI',
  ticker: 'AK',
  role: 'Math + CS @ NYU Courant',
  location: 'NEW YORK, NY',
  status: 'ONLINE',
  blurb: [
    'yo.'
  ],
};

const METRICS: { lbl: string; val: string; chg: string; dir: 'up' | 'down' | 'flat' }[] = [
  { lbl: 'CAFFEINE INTAKE', val: '740MG', chg: '+5.4σ', dir: 'up' },
  { lbl: 'TOTAL GIT COMMITS', val: '230', chg: '+135 YoY', dir: 'up' },
  { lbl: 'LOC', val: '33.4K', chg: '+24% MoM', dir: 'up' },
  { lbl: 'LATEX COMPILE ERRORS', val: '37', chg: '+5 MoM', dir: 'up' },
  { lbl: 'MINECRAFT', val: '982H', chg: '0% this week', dir: 'flat' },
  { lbl: 'LEETCODES', val: '107', chg: '-52% YoY', dir: 'down' },
];

const METRIC_ARROW: Record<'up' | 'down' | 'flat', string> = { up: '▲', down: '▼', flat: '▬' };

const SKILLS: { group: string; items: { name: string; lvl: number }[] }[] = [
  {
    group: 'LANGUAGES',
    items: [
      { name: 'Python', lvl: 95 },
      { name: 'TypeScript', lvl: 88 },
      { name: 'SQL', lvl: 85 },
      { name: 'R', lvl: 80 },
      { name: 'C', lvl: 76 },
      { name: 'Java', lvl: 72 },
      { name: 'Rust', lvl: 68 },
      { name: 'Lean', lvl: 66 },
    ],
  },
  {
    group: 'ML / DATA',
    items: [
      { name: 'pandas', lvl: 92 },
      { name: 'NumPy', lvl: 90 },
      { name: 'scikit-learn', lvl: 84 },
      { name: 'SciPy', lvl: 80 },
      { name: 'spaCy', lvl: 72 },
    ],
  },
  {
    group: 'FRAMEWORKS',
    items: [
      { name: 'React', lvl: 88 },
      { name: 'Next.js', lvl: 84 },
      { name: 'FastAPI', lvl: 82 },
      { name: 'LangChain', lvl: 80 },
      { name: 'Supabase', lvl: 80 },
    ],
  },
  {
    group: 'INFRA / TOOLS',
    items: [
      { name: 'Git', lvl: 93 },
      { name: 'Linux', lvl: 88 },
      { name: 'Docker', lvl: 84 },
      { name: 'HuggingFace', lvl: 82 },
      { name: 'Pinecone', lvl: 75 },
    ],
  },
];

const PROJECTS = [
  {
    sym: 'FINLEY', name: 'Finley, Live-Data Trading RAG', stack: 'Python · RAG · Gemini · Pinecone', status: 'live', yr: 2026,
    repo: 'https://github.com/Akhatri98/nytw_mmhacks_finley', note: '',
  },
  {
    sym: 'EQNEWS', name: 'Equity News Prediction Model', stack: 'Python · scikit-learn · Flask · Docker', status: 'live', yr: 2026,
    repo: 'https://github.com/Akhatri98/TF-IDF-news-model', note: '',
  },
  {
    sym: 'MOMNTM', name: 'Cross-Asset Momentum Allocator', stack: 'Python · pandas · streamlit', status: 'live', yr: 2025,
    repo: '', note: 'PRIVATE - I use this to actually trade, so I\'m not comfortable sharing the code publicly.',
  },
  {
    sym: 'TRMNL', name: 'Terminal Portfolio (this site)', stack: 'React · Vite · TypeScript', status: 'live', yr: 2026,
    repo: 'https://github.com/Akhatri98/portfolio-website', note: '',
  },
  {
    sym: 'NHANES', name: 'NHANES Data Analysis', stack: 'Python · pandas · scikit-learn', status: 'wip', yr: 2026,
    repo: 'https://github.com/Akhatri98/NHANES-model', note: '',
  },
  {
    sym: 'JBOT', name: 'Job Aggregator Bot', stack: 'Python · Open Crawl · Supabase', status: 'wip', yr: 2026,
    repo: 'https://github.com/Akhatri98/Job-Bot', note: '',
  },
  {
    sym: 'DSCAGENT', name: 'LangChain Discord Agent', stack: 'Python · LangChain · APIs', status: 'arch', yr: 2025,
    repo: '', note: 'Repo is private, but I\'m happy to share details of my work upon request.',
  },
  {
    sym: 'SOCAI', name: 'Socratic AI', stack: 'Flask · TypeScript · n8n', status: 'arch', yr: 2025,
    repo: 'https://github.com/arkanemystic/socraticAI', note: '',
  },
];

const EXPERIENCE = [
  {
    role: 'Member of Technical Staff',
    co: 'Stealth',
    when: 'MAY 2026 — PRESENT',
    bullets: [
      'Modernizing regtech.',
    ],
  },
  {
    role: 'SWE Intern',
    co: 'Hawala',
    when: 'JUN 2025 — AUG 2025',
    bullets: [
      'Full-stack development on web applications using React, TypeScript, and Supabase.',
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    co: 'OSU, College of Veterinary Medicine',
    when: 'FEB 2025 — FEB 2026',
    bullets: [
      'Data extraction and analysis with OCR pipelines and R.',
    ],
  },
  {
    role: 'IT Assistant',
    co: 'OSU, Fisher College of Business',
    when: 'SEP 2024 — MAY 2026',
    bullets: [
      'AV/Network install and maintenance.',
    ],
  },
  {
    role: 'MCM Coordinator',
    co: 'SIAM Student Chapter at OSU',
    when: 'AUG 2025 — MAY 2026',
    bullets: [
      'Event coordination.',
    ],
  },
];

const EDUCATION = [
  {
    role: 'B.A. Mathematics',
    co: 'NEW YORK UNIVERSITY (NYU)',
    when: 'SEP 2026 — MAY 2028',
    bullets: [
      'Joint Mathematics and Computer Science program.',
    ],
  },
  {
    role: 'Transfer',
    co: 'THE OHIO STATE UNIVERSITY (OSU)',
    when: 'AUG 2024 — MAY 2026',
    bullets: [
      'Pursued a B.S. in Computer Science & Engineering and a B.S. in Mathematics.',
      'Directed reading program in number theory.',
    ],
  },
  {
    role: 'Dual Enrollment',
    co: 'THE UNIVERSITY OF TOLEDO (UT)',
    when: 'AUG 2023 — MAY 2024',
    bullets: [
      'A lot of math/physics coursework.',
    ],
  },
  {
    role: 'Dual Enrollment',
    co: 'BOWLING GREEN STATE UNIVERSITY (BGSU)',
    when: 'JAN 2022 — JUL 2023',
    bullets: [
      'Spanish coursework for the most part.',
    ],
  },
  {
    role: 'Honors High School Diploma',
    co: 'Undisclosed',
    when: 'AUG 2020 — MAY 2024',
    bullets: [
      'Ranked in the top 5% of the graduating class.',
    ],
  },
];

const COURSES = [
  {
    field: 'MATHEMATICS',
    items: [
      { name: 'AP Calculus 2', focus: 'limits · differentiation · integration · series' },
      { name: 'Calculus 3', focus: 'multivariable calculus · partial derivatives · multiple integrals' },
      { name: 'Linear Algebra', focus: 'vector spaces · eigentheory' },
      { name: 'Differential Equations', focus: 'ordinary differential equations · laplace transforms' },
      { name: 'Abstract Algebra', focus: 'groups · rings · fields' },
      { name: 'Real Analysis', focus: 'sequences · continuity · metric spaces' },
      { name: 'Discrete Math', focus: 'combinatorics · logic · graph theory · proof techniques' },
      { name: 'Probability', focus: 'combinatorics · random variables · distributions' },
      { name: 'Statistics', focus: 'estimation · hypothesis testing · regression' },
    ],
  },
  {
    field: 'COMPUTER SCIENCE',
    items: [
      { name: 'AP Computer Science Principles', focus: 'computational thinking · basic data · internet principles' },
      { name: 'AP Computer Science A', focus: 'object-oriented programming · java · basic algorithms' },
      { name: 'Intro to OOP', focus: 'classes · inheritance · polymorphism' },
      { name: 'Advanced Web Design', focus: 'frontend frameworks · responsive layout' },
      { name: 'Data Structures', focus: 'trees · graphs · hashing · memory management' },
      { name: 'Computer Architecture', focus: 'pipelines · memory hierarchy · ISA · digital logic' },
      { name: 'Operating Systems', focus: 'process scheduling · concurrency · memory management · virtual memory' },
      { name: 'Database Systems', focus: 'relational model · SQL · indexing · schema design' },
      { name: 'Algorithms', focus: 'complexity · dynamic programming · greedy algorithms' },
      { name: 'Python Programming', focus: 'syntax · scripts · data structures' },
    ],
  },
  {
    field: 'PHYSICS',
    items: [
      { name: 'AP Physics: Mechanics', focus: 'kinematics · newtonian dynamics · rotation' },
      { name: 'Physics: Electricity & Magnetism', focus: 'gauss’s law · circuits · maxwell’s equations' },
    ],
  },
];

const READING = [
  { title: 'The Alchemy of Happiness', author: 'Al-Ghazali', tag: 'PHILOSOPHY', status: 'done', rating: 5 },
  { title: 'Meditations', author: 'Marcus Aurelius', tag: 'PHILOSOPHY', status: 'done', rating: 3 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', tag: 'FICTION', status: 'done', rating: 5 },
  { title: '1984', author: 'George Orwell', tag: 'FICTION', status: 'done', rating: 4 },
  { title: 'Maxims and Reflections', author: 'J.W. von Goethe', tag: 'PHILOSOPHY', status: 'done', rating: 3 },
  { title: 'Elementary Number Theory', author: 'G.A. Jones & J.M. Jones', tag: 'MATH', status: 'done', rating: 4 },
  { title: 'The Quran', author: 'Traditional', tag: 'THEOLOGY', status: 'done', rating: 5 },
  { title: 'Tao Te Ching', author: 'Lao Tzu', tag: 'PHILOSOPHY', status: 'done', rating: 4 },

  { title: 'Essential Topology', author: 'M.D. Crossley', tag: 'MATH', status: 'reading', rating: 0 },
  { title: 'Being and Nothingness', author: 'Jean-Paul Sartre', tag: 'PHILOSOPHY', status: 'reading', rating: 0 },
  { title: 'The Hunchback of Notre-Dame', author: 'Victor Hugo', tag: 'FICTION', status: 'reading', rating: 0 },
  { title: 'Statistical Prediction and Machine Learning', author: 'J.T. Chen', tag: 'ML', status: 'reading', rating: 0 },

  { title: 'A Concise Course in Algebraic Topology', author: 'J.P. May', tag: 'MATH', status: 'queued', rating: 0 },
  { title: 'Proofs from THE BOOK', author: 'M. Aigner & G.M. Ziegler', tag: 'MATH', status: 'queued', rating: 0 },
  { title: 'The Anduril Thesis', author: 'Anduril', tag: 'SYSTEMS', status: 'queued', rating: 0 },
  { title: 'The Beginning of Guidance', author: 'Al-Ghazali', tag: 'PHILOSOPHY', status: 'queued', rating: 0 },
];

const ACTIVITY = [
  { ts: '06/23/2026 16:17:02', tag: 'INFRA', tx: 'Created homelab server on salvaged ChromeBook', up: true },
  { ts: '06/21/2026 11:21:35', tag: 'INFO', tx: 'Defeated the Moon Lord in Terraria', up: true },
  { ts: '05/26/2026 14:12:07', tag: 'TRADE', tx: 'Entered short position on $TASE.TA', up: true },
  { ts: '04/29/2026 17:58:43', tag: 'MATH', tx: 'Presented number theory reading program results', up: true },
  { ts: '04/19/2026 09:10:17', tag: 'MATH', tx: 'Formally completed my first Lean project (NNG)', up: true },
  { ts: '03/15/2026 20:48:59', tag: 'INFO', tx: 'Completed construction of a LEGO bird (Model: 10331)', up: false },
];

const CONTACT = [
  { lbl: 'EMAIL', val: 'adeelkhatri98@gmail.com', href: 'mailto:adeelkhatri98@gmail.com' },
  { lbl: 'PHONE', val: '+1 (419) 819-1781', href: 'tel:+14198191781' },
  { lbl: 'GITHUB', val: 'github.com/Akhatri98', href: 'https://github.com/Akhatri98' },
  { lbl: 'LINKEDIN', val: 'linkedin.com/in/adeelk98', href: 'https://linkedin.com/in/adeelk98' },
  { lbl: 'LOCATION', val: 'New York, NY', href: '' },
];

const TAPE_SYMBOLS = [
  { sym: 'NVDA', name: 'NVIDIA', seed: 174.20, chg: 1.84 },
  { sym: 'AMD', name: 'Adv. Micro Devices', seed: 168.50, chg: 2.31 },
  { sym: 'MU', name: 'Micron Technology', seed: 118.90, chg: -0.92 },
  { sym: 'GLD', name: 'SPDR Gold Trust', seed: 305.40, chg: 0.47 },
  { sym: 'SLV', name: 'iShares Silver Trust', seed: 33.10, chg: 1.12 },
  { sym: 'QQQ', name: 'Invesco Nasdaq 100', seed: 538.70, chg: 0.63 },
  { sym: 'PPLT', name: 'abrdn Platinum', seed: 96.40, chg: -1.27 },
  { sym: 'XLV', name: 'Health Care SPDR', seed: 138.20, chg: 0.28 },
  { sym: 'IHI', name: 'iShares Medical Devices', seed: 61.80, chg: -0.41 },
  { sym: 'USO', name: 'US Oil Fund', seed: 78.50, chg: 2.06 },
];

type View = 'DASH' | 'ABOUT' | 'SKILLS' | 'PROJECTS' | 'EXP' | 'EDU'
  | 'COURSES' | 'READING' | 'CONTACT' | 'HELP';

const NAV: { view: View; label: string; key: string }[] = [
  { view: 'DASH', label: 'DASHBOARD', key: '1' },
  { view: 'ABOUT', label: 'ABOUT', key: '2' },
  { view: 'SKILLS', label: 'SKILLS', key: '3' },
  { view: 'PROJECTS', label: 'PROJECTS', key: '4' },
  { view: 'EXP', label: 'EXPERIENCE', key: '5' },
  { view: 'EDU', label: 'EDUCATION', key: '6' },
  { view: 'COURSES', label: 'COURSES', key: '7' },
  { view: 'READING', label: 'READING', key: '8' },
  { view: 'CONTACT', label: 'CONTACT', key: '9' },
  { view: 'HELP', label: 'HELP', key: '0' },
];

const ALIASES: Record<string, View> = {
  DASH: 'DASH', HOME: 'DASH', MENU: 'DASH', MAIN: 'DASH', TOP: 'DASH',
  ABOUT: 'ABOUT', BIO: 'ABOUT', WHO: 'ABOUT', DES: 'ABOUT',
  SKILLS: 'SKILLS', SKILL: 'SKILLS', SKIL: 'SKILLS', SK: 'SKILLS', STACK: 'SKILLS',
  PROJECTS: 'PROJECTS', PROJ: 'PROJECTS', PRJ: 'PROJECTS', PROJECT: 'PROJECTS', WORKS: 'PROJECTS',
  EXP: 'EXP', XP: 'EXP', WORK: 'EXP', CAREER: 'EXP', JOBS: 'EXP',
  EDU: 'EDU', EDUCATION: 'EDU', SCHOOL: 'EDU',
  COURSES: 'COURSES', CRS: 'COURSES', SYLLABUS: 'COURSES', CLASSES: 'COURSES', COURSEWORK: 'COURSES',
  READING: 'READING', READ: 'READING', BOOKS: 'READING', BOOKLIST: 'READING', LIB: 'READING', RDG: 'READING',
  CONTACT: 'CONTACT', CT: 'CONTACT', REACH: 'CONTACT', EMAIL: 'CONTACT', HIRE: 'CONTACT',
  HELP: 'HELP', H: 'HELP', '?': 'HELP', INDEX: 'HELP',
};

const LINKS: Record<string, string> = {
  GH: 'https://github.com/Akhatri98',
  GITHUB: 'https://github.com/Akhatri98',
  LI: 'https://linkedin.com/in/adeelk98',
  LINKEDIN: 'https://linkedin.com/in/adeelk98',
  RESUME: '/resume.pdf',
};

const GO_CONTACT: Record<string, { val: string; href: string }> = {};
CONTACT.forEach((c) => { GO_CONTACT[c.lbl] = { val: c.val, href: c.href }; });
GO_CONTACT.GH = GO_CONTACT.GITHUB;
GO_CONTACT.LI = GO_CONTACT.LINKEDIN;
GO_CONTACT.MAIL = GO_CONTACT.EMAIL;
GO_CONTACT.CALL = GO_CONTACT.PHONE;
GO_CONTACT.RESUME = { val: 'resume.pdf', href: '/resume.pdf' };
GO_CONTACT.CV = GO_CONTACT.RESUME;
const GO_CONTACT_LIST = ['', 'CONTACT', 'CT', 'REACH', 'HIRE', 'SOCIAL', 'LINKS'];

const HELP_ROWS = [
  { c: 'DASH', d: 'Return to the main dashboard' },
  { c: 'ABOUT', d: 'Profile, background & summary' },
  { c: 'SKILLS', d: 'Technical proficiency matrix' },
  { c: 'PROJECTS', d: 'Project portfolio table' },
  { c: 'EXP', d: 'Employment history' },
  { c: 'EDU', d: 'Education & credentials' },
  { c: 'COURSES', d: 'Coursework syllabus by discipline' },
  { c: 'READING', d: 'Reading list & ratings' },
  { c: 'CONTACT', d: 'Contact details & social links' },
  { c: 'GO', d: 'List contact channels (then GO <CHANNEL> opens one)' },
  { c: 'GO <SYM>', d: 'Open a project repo, or show why it’s private' },
  { c: 'GH', d: 'Open GitHub profile (new tab)' },
  { c: 'LI', d: 'Open LinkedIn profile (new tab)' },
  { c: 'CLEAR', d: 'Clear the command log' },
  { c: 'HELP', d: 'Show this command index' },
];

type Quote = { sym: string; name: string; price: number; pct: number };
const FINNHUB_TOKEN: string = import.meta.env.VITE_FINNHUB_TOKEN ?? '';

async function fetchQuote(t: { sym: string; name: string }): Promise<Quote | null> {
  if (!FINNHUB_TOKEN) return null;
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${t.sym}&token=${FINNHUB_TOKEN}`);
    if (!res.ok) return null;
    const j = await res.json();
    if (typeof j.c !== 'number' || j.c === 0) return null;
    return { sym: t.sym, name: t.name, price: j.c, pct: typeof j.dp === 'number' ? j.dp : 0 };
  } catch {
    return null;
  }
}

function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>(() =>
    TAPE_SYMBOLS.map((t) => ({ sym: t.sym, name: t.name, price: t.seed, pct: t.chg }))
  );
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!FINNHUB_TOKEN) return;
    let cancelled = false;
    const load = async () => {
      const settled = await Promise.all(TAPE_SYMBOLS.map(fetchQuote));
      if (cancelled) return;
      let anyOk = false;
      setQuotes((prev) =>
        prev.map((q, i) => {
          const r = settled[i];
          if (r) { anyOk = true; return r; }
          return q;
        })
      );
      setLive(anyOk);
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return { quotes, live };
}

function Panel({
  title, right, children, className = '',
}: { title: string; right?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-hd">
        <span>{title}</span>
        {right && <span className="panel-right">{right}</span>}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function SkillBars({ items }: { items: { name: string; lvl: number }[] }) {
  return (
    <>
      {items.map((s) => (
        <div className="bar-row" key={s.name}>
          <span className="bar-name">{s.name}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${s.lvl}%` }} />
          </span>
          <span className="bar-val">{s.lvl.toFixed(1)}</span>
        </div>
      ))}
    </>
  );
}

function ExpList({ rows }: { rows: typeof EXPERIENCE }) {
  return (
    <>
      {rows.map((e, i) => (
        <div className="exp" key={i}>
          <div className="exp-top">
            <span>
              <span className="exp-role">{e.role}</span>{' '}
              <span className="hdr-sep">/</span> <span className="exp-co">{e.co}</span>
            </span>
            <span className="exp-when">{e.when}</span>
          </div>
          <ul>{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
        </div>
      ))}
    </>
  );
}

function Stars({ n }: { n: number }) {
  if (!n) return <span className="stars off">— — — — —</span>;
  return (
    <span className="stars">
      {'★'.repeat(n)}
      <span className="off">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

function ScreenDash({ clock }: { clock: string }) {
  return (
    <div className="screen cols-2">
      <Panel title="SECURITY DESCRIPTION" right={PROFILE.ticker} className="span-2">
        <dl className="kv">
          <dt>NAME</dt><dd>{PROFILE.name}</dd>
          <dt>ROLE</dt><dd>{PROFILE.role}</dd>
          <dt>LOCATION</dt><dd>{PROFILE.location}</dd>
          <dt>STATUS</dt><dd className="up">{PROFILE.status}</dd>
        </dl>
      </Panel>

      <Panel title="KEY STATISTICS" right={clock}>
        <div className="quotes">
          {METRICS.map((m) => (
            <div className="quote" key={m.lbl}>
              <div className="quote-lbl">{m.lbl}</div>
              <div className="quote-val">{m.val}</div>
              <div className={`quote-chg ${m.dir}`}>
                {METRIC_ARROW[m.dir]} {m.chg}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="TECH EXPOSURE — TOP HOLDINGS">
        <SkillBars items={SKILLS.flatMap((g) => g.items).sort((a, b) => b.lvl - a.lvl).slice(0, 6)} />
      </Panel>

      <Panel title="ACTIVITY LOG" right="LIVE" className="span-2">
        {ACTIVITY.map((a, i) => (
          <div className="log-line" key={i}>
            <span className="ts">{a.ts}</span>
            <span className={`tg ${a.up ? 'up' : 'down'}`}>{a.tag}</span>
            <span className="tx">{a.tx}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function ScreenAbout() {
  return (
    <div className="screen">
      <Panel title="ABOUT — PROFILE SUMMARY" right={PROFILE.ticker}>
        <div className="prose">
          {PROFILE.blurb.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Panel>
    </div>
  );
}

function ScreenSkills({ clock }: { clock: string }) {
  return (
    <div className="screen">
      <Panel title="SKILL PROFICIENCY MATRIX" right={clock}>
        {SKILLS.map((g) => (
          <div key={g.group}>
            <div className="subhd">{g.group}</div>
            <SkillBars items={g.items} />
          </div>
        ))}
      </Panel>
    </div>
  );
}

function ScreenProjects() {
  return (
    <div className="screen">
      <Panel title="PROJECT PORTFOLIO" right={`${PROJECTS.length} POSITIONS`}>
        <table className="tbl">
          <thead>
            <tr>
              <th>SYM</th><th>NAME</th><th>STACK</th><th>STATUS</th><th className="num">YR</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr key={p.sym}>
                <td className="sym">{p.sym}</td>
                <td>{p.name}</td>
                <td>{p.stack}</td>
                <td><span className={`tag ${p.status}`}>{p.status.toUpperCase()}</span></td>
                <td className="num">{p.yr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">
          ▸ Type <b>{'GO <SYM>'}</b> (e.g. <b>GO FINLEY</b>) to open a project's repo — or see why it's private.
        </p>
      </Panel>
    </div>
  );
}

function ScreenExp() {
  return (
    <div className="screen">
      <Panel title="EMPLOYMENT HISTORY"><ExpList rows={EXPERIENCE} /></Panel>
    </div>
  );
}

function ScreenEdu() {
  return (
    <div className="screen">
      <Panel title="EDUCATION & CREDENTIALS"><ExpList rows={EDUCATION} /></Panel>
    </div>
  );
}

function ScreenCourses() {
  return (
    <div className="screen">
      <Panel title="COURSEWORK SYLLABUS" right="MATH · CS">
        {COURSES.map((g) => (
          <div key={g.field}>
            <div className="subhd">{g.field}</div>
            <table className="tbl">
              <tbody>
                {g.items.map((c) => (
                  <tr key={c.name}>
                    <td className="sym" style={{ width: '42%' }}>{c.name}</td>
                    <td>{c.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function ScreenReading() {
  const done = READING.filter((b) => b.status === 'done').length;
  return (
    <div className="screen">
      <Panel title="READING LIST" right={`${READING.length} TITLES · ${done} READ`}>
        <table className="tbl">
          <thead>
            <tr>
              <th>TITLE</th><th>AUTHOR</th><th>SHELF</th><th>STATUS</th><th>RATING</th>
            </tr>
          </thead>
          <tbody>
            {READING.map((b) => (
              <tr key={b.title}>
                <td className="sym">{b.title}</td>
                <td>{b.author}</td>
                <td>{b.tag}</td>
                <td><span className={`tag ${b.status}`}>{b.status.toUpperCase()}</span></td>
                <td><Stars n={b.rating} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function ScreenContact() {
  return (
    <div className="screen">
      <Panel title="CONTACT — DIRECT LINES" right="GO <CHANNEL>">
        <div className="links">
          {CONTACT.map((c) => (
            <div className="link-row" key={c.lbl}>
              <span className="lk-lbl">{c.lbl}</span>
              <span>{c.val}</span>
              <span className="lk-go">{c.href ? `GO ${c.lbl} ▸` : ''}</span>
            </div>
          ))}
        </div>
        <p className="hint">
          Mouse is off — type <b>{'GO <CHANNEL>'}</b> to open a link (e.g. <b>GO LINKEDIN</b>).
          Bare <b>GO</b> lists every channel.
        </p>
      </Panel>
    </div>
  );
}

function ScreenHelp() {
  return (
    <div className="screen">
      <Panel title="COMMAND INDEX" right="TYPE A COMMAND + ENTER">
        <div className="help-grid">
          {HELP_ROWS.map((r) => (
            <div key={r.c} style={{ display: 'contents' }}>
              <span className="hc">{r.c}</span>
              <span className="hd">{r.d}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, color: 'var(--gray)', fontSize: 11 }}>
          Aliases work too — e.g. WORK/JOBS → EXP, BOOKS → READING. Use ↑/↓ for command history.
        </p>
      </Panel>
    </div>
  );
}

type LogEntry = { id: number; time: string; cmd: string; msg: string; ok: boolean };
const nowStr = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

export default function App() {
  const [view, setView] = useState<View>('DASH');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [log, setLog] = useState<LogEntry[]>(() => [
    { id: 0, time: nowStr(), cmd: 'SYS', msg: 'KHATRI//OS v4.8.26 — terminal ready.', ok: true },
    { id: 1, time: nowStr(), cmd: 'SYS', msg: 'Mouse disabled — keyboard only. Type HELP, GO <SYM>, or press 1–0 to navigate.', ok: true },
  ]);
  const [now, setNow] = useState(new Date());
  const { quotes, live } = useQuotes();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const logId = useRef(2);

  useLayoutEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / 1536, window.innerHeight / 864);
      document.documentElement.style.setProperty('--scale', String(s));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = useMemo(
    () => now.toLocaleTimeString('en-GB', { hour12: false }),
    [now]
  );
  const dateStr = useMemo(
    () => now.toLocaleDateString('en-CA', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase(),
    [now]
  );

  const focusInput = () => inputRef.current?.focus();

  const pushLog = (cmd: string, message: string, ok: boolean) => {
    setLog((prev) =>
      [...prev, { id: logId.current++, time: nowStr(), cmd, msg: message, ok }].slice(-40)
    );
  };

  const go = (v: View, label: string) => {
    setView(v);
    pushLog(v, `EXECUTED — ${label}`, true);
  };
  const goRef = useRef(go);
  goRef.current = go;

  const runGo = (arg: string) => {
    if (GO_CONTACT_LIST.includes(arg)) {
      pushLog('GO', 'CONTACT DIRECTORY ▾ — then GO <CHANNEL> to open one', true);
      CONTACT.forEach((c) => pushLog('GO', `${c.lbl.padEnd(9)} ${c.val}`, true));
      return;
    }
    const proj = PROJECTS.find((p) => p.sym === arg);
    if (proj) {
      if (proj.repo) {
        window.open(proj.repo, '_blank', 'noreferrer');
        pushLog('GO', `${proj.sym} ▸ OPENING REPO → ${proj.repo}`, true);
      } else {
        pushLog('GO', `${proj.sym} ▸ ${proj.note}`, true);
      }
      return;
    }
    const t = GO_CONTACT[arg];
    if (t) {
      if (t.href) {
        window.open(t.href, '_blank', 'noreferrer');
        pushLog('GO', `OPENING ${arg} → ${t.val}`, true);
      } else {
        pushLog('GO', `${arg} — ${t.val}`, true);
      }
      return;
    }
    pushLog('GO', `NO TARGET "${arg}" — try a project SYM, or GO CONTACT`, false);
  };

  const run = (raw: string) => {
    const line = raw.trim().toUpperCase();
    if (!line) return;
    setHistory((h) => [...h, line]);
    setHistIdx(-1);
    setInput('');

    const sp = line.indexOf(' ');
    const head = sp === -1 ? line : line.slice(0, sp);
    const arg = sp === -1 ? '' : line.slice(sp + 1).trim();

    if (head === 'CLEAR' || head === 'CLS') {
      setLog([{ id: logId.current++, time: nowStr(), cmd: 'SYS', msg: 'Log cleared.', ok: true }]);
      return;
    }
    if (head === 'GO') {
      runGo(arg);
      return;
    }
    if (ALIASES[line]) {
      const v = ALIASES[line];
      go(v, NAV.find((n) => n.view === v)?.label ?? v);
      return;
    }
    if (LINKS[line]) {
      window.open(LINKS[line], '_blank', 'noreferrer');
      pushLog(line, `OPENING → ${LINKS[line]}`, true);
      return;
    }
    pushLog(line, 'INVALID — type HELP for the command index', false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(input); return; }
    if (input === '' && /^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const item = NAV[e.key === '0' ? 9 : Number(e.key) - 1];
      if (item) go(item.view, item.label);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const i = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i); setInput(history[i]);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < 0) return;
      const i = histIdx + 1;
      if (i >= history.length) { setHistIdx(-1); setInput(''); }
      else { setHistIdx(i); setInput(history[i]); }
    }
  };

  useEffect(() => {
    const onWinKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!/^[0-9]$/.test(e.key)) return;
      if (document.activeElement === inputRef.current) return;
      const item = NAV[e.key === '0' ? 9 : Number(e.key) - 1];
      if (!item) return;
      e.preventDefault();
      goRef.current(item.view, item.label);
    };
    window.addEventListener('keydown', onWinKey);
    return () => window.removeEventListener('keydown', onWinKey);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const screen = {
    DASH: <ScreenDash clock={clock} />,
    ABOUT: <ScreenAbout />,
    SKILLS: <ScreenSkills clock={clock} />,
    PROJECTS: <ScreenProjects />,
    EXP: <ScreenExp />,
    EDU: <ScreenEdu />,
    COURSES: <ScreenCourses />,
    READING: <ScreenReading />,
    CONTACT: <ScreenContact />,
    HELP: <ScreenHelp />,
  }[view];

  return (
    <div className="frame">
      <div className="terminal">
        <div className="hdr">
          <span className="hdr-name">{PROFILE.name}</span>
          <span className="hdr-tick">{PROFILE.ticker}</span>
          <span className="hdr-mid">{PROFILE.role}</span>
        </div>

        <div className="cmd">
          <span className="cmd-prompt">{PROFILE.ticker}&gt;</span>
          <input
            ref={inputRef}
            className="cmd-input"
            value={input}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder="enter command — try HELP, GO, or a section"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            onBlur={() => window.setTimeout(focusInput, 0)}
          />
        </div>

        <div className="logfeed" ref={logRef}>
          {log.map((e) => (
            <div className="logf" key={e.id}>
              <span className="logf-t">{e.time}</span>
              <span className="logf-c">{PROFILE.ticker}&gt; {e.cmd}</span>
              <span className={`logf-m ${e.ok ? 'ok' : 'err'}`}>{e.msg}</span>
            </div>
          ))}
        </div>

        <div className="body">
          <nav className="side">
            {NAV.map((n) => (
              <div
                key={n.view}
                className={`nav-item ${view === n.view ? 'active' : ''}`}
              >
                <span className="nav-key">{n.key}</span>
                <span>{n.label}</span>
                <span className="nav-go">&lt;GO&gt;</span>
              </div>
            ))}
          </nav>
          <main className="main">{screen}</main>
        </div>

        <div className="tape">
          <div className="tape-track">
            {[...quotes, ...quotes].map((t, i) => (
              <span className="tape-item" key={i} title={t.name}>
                <span className="tape-sym">{t.sym}</span>
                <span className="tape-val">{t.price.toFixed(2)}</span>
                <span className={t.pct >= 0 ? 'up' : 'down'}>
                  {t.pct >= 0 ? '▲' : '▼'}{Math.abs(t.pct).toFixed(2)}%
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="status">
          <span><span className="blink">●</span> LIVE</span>
          <span>QUOTES: {live ? 'LIVE' : 'DELAYED'}</span>
          <span>{view} SCREEN</span>
          <span className="sp">{dateStr} · {clock}</span>
        </div>
      </div>
    </div>
  );
}
