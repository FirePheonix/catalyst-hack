// ─────────────────────────────────────────────────────────────
//  Paste the Google Form link here when it's ready.
//  While it's empty, every "Register now" button shows "link drops soon".
// ─────────────────────────────────────────────────────────────
export const REGISTER_URL = 'https://forms.gle/o4HoboARsKq5L3Mb8'

// All times are IST (UTC+05:30).
export const DATES = {
  regClose: new Date('2026-11-18T17:00:00+05:30'),
  psReveal: new Date('2026-11-18T18:00:00+05:30'),
  buildEnd: new Date('2026-11-19T18:00:00+05:30'),
  pitchDay: new Date('2026-11-20T00:00:00+05:30'),
  pitchEnd: new Date('2026-11-21T00:00:00+05:30'),
}

// "Hackathon Timeline" frame. `doneAt` is when the step counts as passed.
export const TIMELINE = [
  {
    day: '18',
    sup: 'th',
    time: '5 PM',
    text: 'Form last registration date.',
    doneAt: DATES.regClose,
  },
  {
    day: '18',
    sup: 'th',
    time: '6 PM',
    text: 'Problem statements revealed.',
    doneAt: DATES.psReveal,
  },
  {
    day: '19',
    sup: 'th',
    time: '6 PM',
    text: 'Final submissions open (pitch video (demo) + PPT).',
    doneAt: DATES.buildEnd,
  },
  {
    day: '20',
    sup: 'th',
    text: 'Top 10 shortlisted teams → pitching round (offline, on campus).',
    doneAt: DATES.pitchEnd,
  },
  {
    day: '20',
    sup: 'th',
    text: 'Results declaration and prize ceremony (offline, on campus).',
    doneAt: DATES.pitchEnd,
  },
]

// Prize rule: every registered team adds ₹200 to the pool (prizes unlock at 25 teams).
// One more winner every 25 teams; the pool is split equally between the winners.
//   25 → ₹5,000 (1 winner)   30 → ₹6,000 (all to the winner)
//   50 → ₹5,000 × 2          70 → ₹7,000 × 2          75 → ₹5,000 × 3  …
export const PRIZE = { perTeam: 200, minTeams: 25, teamsPerWinner: 25 }

export function prizeFor(teams) {
  if (teams < PRIZE.minTeams) return { pool: 0, winners: 0, each: 0 }
  const winners = Math.floor(teams / PRIZE.teamsPerWinner)
  const pool = teams * PRIZE.perTeam
  return { pool, winners, each: Math.round(pool / winners) }
}

export const formatINR = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

// "Prize pool" frame: the first team count of each winner bracket, plus how it grows.
export const PRIZE_TIERS = [
  {
    teams: 25,
    prizes: [{ label: 'Winner', amount: '₹5,000' }],
    grows: '30 teams → ₹6,000 to winner',
  },
  {
    teams: 50,
    prizes: [
      { label: '1st Prize', rank: '1', sup: 'st', amount: '₹5,000' },
      { label: 'Runner-up', amount: '₹5,000' },
    ],
    grows: '70 teams → ₹7,000 each',
  },
  {
    teams: 75,
    prizes: [
      { label: '1st Prize', rank: '1', sup: 'st', amount: '₹5,000' },
      { label: '2nd Prize', rank: '2', sup: 'nd', amount: '₹5,000' },
      { label: '3rd Prize', rank: '3', sup: 'rd', amount: '₹5,000' },
    ],
    grows: '+1 winner every 25 teams',
  },
]

// "Mentors" frame. icon: trophy | code | work | grad
export const MENTORS = [
  {
    name: 'Shubham Singh',
    avatar: '/images/web/mentor-shubham.webp',
    points: [
      { icon: 'trophy', text: '4 time hackathon winner' },
      { icon: 'code', text: 'GSoC’25 – Sugarlabs' },
      { icon: 'code', text: 'GSoC’26 – NumFocus' },
      { icon: 'grad', text: '3rd year' },
    ],
  },
  {
    name: 'Rohan Tewari',
    avatar: '/images/web/mentor-rohan.webp',
    points: [
      { icon: 'work', text: 'Ex intern – IIT KGP' },
      { icon: 'trophy', text: '2x hackathon winner' },
      { icon: 'grad', text: '3rd year' },
    ],
  },
]

// "We ran a poll" frame.
export const POLL = { yes: 100, no: 19, asked: 150 }

export const FAQS = [
  {
    q: 'What exactly is Catalyst?',
    a: 'A 24-hour intra-college hackathon by the Technical Society. You solve real open source problems: the statements drop on Nov 18 at 6 PM, you build until Nov 19 at 6 PM, and the top 10 teams pitch on campus on Nov 20.',
  },
  {
    q: 'When do registrations close?',
    a: 'Nov 18 at 5 PM IST, one hour before the problem statements are revealed. Late entries can’t be accepted once the statements are out.',
  },
  {
    q: 'How big can my team be?',
    a: 'Teams can have a maximum of 3 members.',
  },
  {
    q: 'How much is the prize money?',
    a: 'Every registered team adds ₹200 to the prize pool, and prizes unlock at 25 teams. Every 25 teams adds one more winner, and the pool is split equally. 25 teams: ₹5,000 to the winner. 30 teams: ₹6,000, all to the winner. 50 teams: ₹5,000 each for the winner and runner-up. 70 teams: ₹7,000 each. 75 teams: ₹5,000 each for the top 3, and it keeps growing from there.',
  },
  {
    q: 'What do we submit?',
    a: 'A pitch video with a demo of what you built, plus a PPT. Final submissions open on Nov 19 at 6 PM, when the build phase ends.',
  },
  {
    q: 'Where does the pitching round happen?',
    a: 'Offline, on campus, on Nov 20. The top 10 shortlisted teams pitch, and results and the prize ceremony follow the same day.',
  },
  {
    q: 'Do I need prior open source experience?',
    a: 'No. If you can read a codebase and write some code, you are in. Catalyst is a good way to make your first meaningful open source contribution.',
  },
  {
    q: 'Which languages or stacks are allowed?',
    a: 'Anything that solves the problem: Go, Rust, Python, JS, C++ or whatever else fits. The problem statement decides the tools, not us.',
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
