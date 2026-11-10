// ─────────────────────────────────────────────────────────────
//  Paste the Google Form link here when it's ready.
//  While it's empty, every "Register now" button shows "link drops soon".
// ─────────────────────────────────────────────────────────────
export const REGISTER_URL = ''

// All times are IST (UTC+05:30).
export const DATES = {
  psReveal: new Date('2026-11-17T12:00:00+05:30'),
  buildEnd: new Date('2026-11-19T12:00:00+05:30'),
  pitchDay: new Date('2026-11-20T00:00:00+05:30'),
  pitchEnd: new Date('2026-11-21T00:00:00+05:30'),
}

export const PHASES = [
  {
    id: '01',
    kicker: 'Round zero',
    title: 'Problem statements revealed',
    date: 'Nov 17',
    time: '12:00 noon IST',
    start: DATES.psReveal,
    end: DATES.psReveal,
    body: 'The problem statements go live at noon. They come from real open source pain points: bugs, missing tooling and rough edges developers hit every day.',
  },
  {
    id: '02',
    kicker: 'Round one',
    title: 'Build solution round',
    date: 'Nov 17 → Nov 19',
    time: '12:00 noon → 12:00 noon',
    start: DATES.psReveal,
    end: DATES.buildEnd,
    body: '48 hours to go from idea to working solution. Pick a problem, write code, commit often and ship something that works before the clock hits zero.',
  },
  {
    id: '03',
    kicker: 'Round two',
    title: 'Pitching round & results',
    date: 'Nov 20',
    time: 'Offline',
    start: DATES.pitchDay,
    end: DATES.pitchEnd,
    body: 'Teams pitch their builds in person to the judges. Demos, questions, then the results are announced the same day.',
  },
]

export const FAQS = [
  {
    q: 'What exactly is Catalyst?',
    a: 'A 48-hour hackathon by the Technical Society. You solve real open source problems: the statements drop on Nov 17 at noon, you build until Nov 19 at noon, and the best teams pitch on Nov 20.',
  },
  {
    q: 'Do I need prior open source experience?',
    a: 'No. If you can read a codebase and write some code, you are in. Catalyst is a good way to make your first meaningful open source contribution.',
  },
  {
    q: 'Which languages or stacks are allowed?',
    a: 'Anything that solves the problem: Go, Rust, Python, JS, C++ or whatever else fits. The problem statement decides the tools, not us.',
  },
  {
    q: 'How much is the prize money?',
    a: 'The prize pool depends on participation: the more teams register, the bigger it gets. Once registrations close, the final pool is announced and split across the top 3 teams.',
  },
  {
    q: 'Where does the pitching round happen?',
    a: 'The pitching round on Nov 20 is held offline. Venue and reporting time will be shared with registered teams closer to the date.',
  },
  {
    q: 'How do I register?',
    a: 'Hit any "Register now" button and fill in the Google Form. Team details, eligibility and contact info are all collected there.',
  },
  {
    q: 'When are problem statements released?',
    a: 'Tuesday, Nov 17 at 12:00 noon IST. The 48-hour build clock starts at that moment.',
  },
]

export const IMG = {
  spikes: '/images/web/spikes.webp',
  boxes: '/images/web/boxes.webp',
  cloud1: '/images/web/cloud-1.webp',
  cloud2: '/images/web/cloud-2.webp',
  wordmark: '/images/web/wordmark.webp',
  statue: '/images/web/statue.webp',
  steve: '/images/web/steve.webp',
  gopher: '/images/web/gopher.webp',
  techsoc: '/images/web/techsoc.webp',
  iiits: '/images/web/iiits.webp',
  algozenith: '/images/web/algozenith.webp',
}
