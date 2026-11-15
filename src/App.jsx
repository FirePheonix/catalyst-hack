import { useEffect, useState } from 'react'
import DitherField from './components/DitherField.jsx'
import DitherReveal from './components/DitherReveal.jsx'
import { Countdown, DitherHeading, Kicker, RegisterButton, getStage, useNow } from './components/bits.jsx'
import { HackathonDoodle, Laurel, PixelTrophy, Rays, useInView } from './components/pixel.jsx'
import { FAQS, IMG, POLL, PRIZE_TIERS, TIMELINE } from './data.js'

const NAV = [
  ['about', 'About'],
  ['timeline', 'Timeline'],
  ['prizes', 'Prizes'],
  ['format', 'Format'],
  ['faq', 'FAQ'],
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={() => setOpen(false)}>
          <img src={IMG.techsoc} alt="" />
          <span>catalyst</span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav__cta">
          <RegisterButton size="sm" label="Register" />
        </div>
        <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function ScheduleList({ className = '' }) {
  return (
    <ul className={`schedule ${className}`}>
      <li>
        <b>Nov 18</b>
        <span>Problem Statements Revealed</span>
      </li>
      <li>
        <b>Nov 19</b>
        <span>Hackathon Build Phase Ends</span>
      </li>
      <li>
        <b>Nov 20</b>
        <span>Pitching Round & Results</span>
      </li>
    </ul>
  )
}

function Hero({ now }) {
  return (
    <section className="hero" id="top">
      <img className="hero__statue" src={IMG.statue} alt="" aria-hidden="true" />
      <DitherField className="hero__field" mode="blobs" pixel={4} strength={0.9} />

      <DitherReveal src={IMG.spikes} className="hero__spikes float-slow" cell={8} duration={1600} eager />

      <div className="hero__cloud hero__cloud--left drift-a">
        <img className="hero__gopher bob" src={IMG.gopher} alt="Go gopher" />
        <DitherReveal src={IMG.cloud1} cell={6} delay={250} eager />
      </div>
      <div className="hero__cloud hero__cloud--right drift-b">
        <img className="hero__steve bob bob--late" src={IMG.steve} alt="Blocky miner with a pickaxe" />
        <DitherReveal src={IMG.cloud2} cell={6} delay={450} eager />
      </div>

      <ScheduleList className="hero__schedule" />

      <div className="hero__content">
        <p className="hero__presents">
          technical
          <br />
          society
          <br />
          presents
        </p>
        <h1 className="hero__title">
          <span className="sr-only">Catalyst</span>
          <DitherReveal src={IMG.wordmark} cell={5} duration={1000} delay={150} eager />
        </h1>
        <p className="hero__tagline">
          24 hours hackathon to solve the
          <br />
          biggest open source problems
        </p>

        <ScheduleList className="hero__schedule--inline" />

        <div className="hero__actions">
          <RegisterButton size="lg" />
          <a className="btn btn--ghost btn--lg" href="#timeline">
            <span className="btn__label">See timeline</span>
          </a>
        </div>
        <Countdown now={now} />
      </div>
    </section>
  )
}

function Marquee() {
  const items = ['catalyst', '24 hours', 'open source', 'nov 18 → 20', 'build', 'submit', 'pitch', 'up to ₹15,000 in prizes', 'register now']
  const row = items.map((t, i) => (
    <span key={i}>
      {t}
      <i aria-hidden="true">✦</i>
    </span>
  ))
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row}
        {row}
        {row}
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <div>
          <Kicker n="01">about</Kicker>
          <DitherHeading>What is catalyst?</DitherHeading>
          <p className="lead">
            A <em>24-hour hackathon</em> where you take on the biggest problems in open source: the bugs nobody fixed,
            the tools nobody built, and the rough edges every developer trips over.
          </p>
          <p className="body">
            Registrations close at <b>5 PM on Nov 18</b> and the problem statements drop an hour later, at <b>6 PM</b>.
            From that moment you have 24 hours to build a working solution. On <b>Nov 20</b>, the top 10 shortlisted
            teams pitch offline, on campus, and the results and prize ceremony follow the same day.
          </p>
          <div className="about__cta">
            <RegisterButton />
          </div>
        </div>

        <div className="about__visual">
          <DitherReveal src={IMG.statue} className="about__statue" cell={6} />
          <div className="stats">
            <div className="stat">
              <span className="stat__num">24</span>
              <span className="stat__label">hours to build</span>
            </div>
            <div className="stat">
              <span className="stat__num">03</span>
              <span className="stat__label">max per team</span>
            </div>
            <div className="stat">
              <span className="stat__num">10</span>
              <span className="stat__label">teams pitch on campus</span>
            </div>
            <div className="stat">
              <span className="stat__num">15K</span>
              <span className="stat__label">₹ max prize pool</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Poll() {
  const [ref, inView] = useInView()
  const total = POLL.yes + POLL.no
  const yesPct = Math.round((POLL.yes / total) * 100)
  const noPct = 100 - yesPct
  return (
    <section className="section poll" id="poll">
      <div className={`container poll__grid ${inView ? 'is-in' : ''}`} ref={ref}>
        <div className="poll__visual">
          <Rays className="poll__rays poll__rays--l" />
          <Rays className="poll__rays poll__rays--r" />
          <div className="wa" role="img" aria-label={`Poll: willing to participate in the hackathon? Yes ${POLL.yes}, No ${POLL.no}`}>
            <div className="wa__head">
              <img src={IMG.techsoc} alt="" />
              <div>
                <b>Technical Society</b>
                <span>Community admin</span>
              </div>
            </div>
            <p className="wa__q">Willing to participate in Hackathon next week.</p>
            <p className="wa__meta">Select one · Names hidden</p>
            <div className="wa__opt">
              <span className="wa__tick" aria-hidden="true">✓</span>
              <span className="wa__label">Yes</span>
              <span className="wa__count">{POLL.yes}</span>
              <span className="wa__bar">
                <i style={{ '--w': `${yesPct}%` }} />
              </span>
            </div>
            <div className="wa__opt">
              <span className="wa__radio" aria-hidden="true" />
              <span className="wa__label">No</span>
              <span className="wa__count">{POLL.no}</span>
              <span className="wa__bar">
                <i style={{ '--w': `${noPct}%` }} />
              </span>
            </div>
            <p className="wa__votes">View votes</p>
          </div>
          <p className="wa__tag">
            <span className="wa__dot" aria-hidden="true" />
            Poll response · Technical Society’s WhatsApp group
          </p>
        </div>

        <div className="poll__copy">
          <Kicker n="02">hype check</Kicker>
          <h2 className="poll__title">
            We ran a poll in <mark>Technical Society’s WhatsApp Group</mark>
          </h2>
          <p className="poll__sub">
            to gauge interest for our <span className="poll__chip">&lt;/&gt; Intra-College Hackathon</span>
          </p>
          <div className="poll__stats">
            <div className="poll__stat poll__stat--yes">
              <b>
                {POLL.yes} <i aria-hidden="true">✓</i>
              </b>
              <span>Students interested</span>
            </div>
            <div className="poll__stat poll__stat--no">
              <b>
                {POLL.no} <i aria-hidden="true">✕</i>
              </b>
              <span>Students not interested</span>
            </div>
          </div>
          <p className="poll__note">
            Out of <b>~{POLL.asked}</b> students, <b>{POLL.yes}</b> showed interest in participating, indicating a{' '}
            <mark>strong and positive response</mark> for the hackathon.
          </p>
        </div>
      </div>
    </section>
  )
}

function Timeline({ now }) {
  const stage = getStage(now)
  const nextIdx = TIMELINE.findIndex((t) => now < t.doneAt)
  return (
    <section className="section timeline" id="timeline">
      <div className="timeline__cloud timeline__cloud--l drift-a">
        <img className="timeline__gopher bob" src={IMG.gopher} alt="" />
        <DitherReveal src={IMG.cloud1} cell={6} />
      </div>
      <div className="timeline__cloud timeline__cloud--r drift-b">
        <img className="timeline__steve bob bob--late" src={IMG.steve} alt="" />
        <DitherReveal src={IMG.cloud2} cell={6} />
      </div>
      <div className="container">
        <div className="timeline__kicker">
          <Kicker n="03">timeline</Kicker>
        </div>
        <div className="sketch">
          <h2 className="sketch__title">
            <Rays className="sketch__rays sketch__rays--l" />
            <span>Hackathon Timeline</span>
            <Rays className="sketch__rays" />
          </h2>
          <p className="sketch__intro">
            Here’s the complete timeline for the Intra-College Hackathon. From registrations to final winners, here’s how
            it all goes down:
          </p>
          <ol className="sketch__list">
            {TIMELINE.map((t, i) => {
              const state = nextIdx === -1 || i < nextIdx ? 'done' : i === nextIdx ? 'next' : 'upcoming'
              return (
                <li key={i} className={`sketch__item is-${state}`}>
                  <span className="sketch__node" aria-hidden="true" />
                  <span className="sketch__date">
                    <span>
                      {t.day}
                      <sup>{t.sup}</sup> Nov
                    </span>
                    {t.time && <span>{t.time}</span>}
                  </span>
                  <span className="sketch__text">
                    {t.text}
                    {state === 'next' && <em className="sketch__next">← up next</em>}
                    {state === 'done' && <span className="sr-only"> (done)</span>}
                  </span>
                </li>
              )
            })}
          </ol>
          <HackathonDoodle className="sketch__doodle" />
        </div>

        <div className="timeline__now">
          <Countdown now={now} />
          {stage.key === 'pre' && <RegisterButton />}
        </div>
      </div>
    </section>
  )
}

function Prizes() {
  return (
    <section className="section prizes" id="prizes">
      <div className="container">
        <header className="poster-head">
          <Kicker n="04">prizes</Kicker>
          <h2 className="poster-head__title">
            prize pool
            <Rays className="poster-head__rays" />
          </h2>
          <p className="poster-head__sub">
            <span>Cash Prizes Based on Participation</span>
          </p>
        </header>

        <div className="tiers">
          {PRIZE_TIERS.map((tier) => (
            <article key={tier.teams} className={`tier ${tier.prizes.length > 2 ? 'tier--rows' : 'tier--stack'}`}>
              <header className="tier__head">
                <Laurel />
                <div>
                  <span className="tier__badge">{tier.teams} Teams</span>
                  <span className="tier__sub">Participating</span>
                </div>
                <Laurel flip />
              </header>
              <ul className="tier__list">
                {tier.prizes.map((p) => (
                  <li key={p.label}>
                    <PixelTrophy className="tier__trophy" />
                    <span className="tier__label">
                      {p.rank ? (
                        <>
                          {p.rank}
                          <sup>{p.sup}</sup> Prize
                        </>
                      ) : (
                        p.label
                      )}
                    </span>
                    <span className="tier__amt">{p.amount}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="prizes__note">
          The more teams register, the more prizes unlock: <b>₹10,000</b> at 50 teams, <b>₹15,000</b> at 75 teams.
        </p>

        <div className="finale" aria-hidden="true">
          <DitherReveal src={IMG.cloud1} className="finale__cloud finale__cloud--l drift-a" cell={6} />
          <div className="finale__cloud finale__cloud--r drift-b">
            <img className="finale__steve bob" src={IMG.steve} alt="" />
            <DitherReveal src={IMG.cloud2} cell={6} />
          </div>
          <div className="finale__center">
            <div className="finale__cup">
              <Rays className="finale__rays finale__rays--l" />
              <Rays className="finale__rays" />
              <PixelTrophy star className="finale__trophy" />
            </div>
            <DitherReveal src={IMG.cloud1} className="finale__mound" cell={6} />
          </div>
        </div>

        <div className="prizes__cta">
          <RegisterButton label="Grow the pool: register" />
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  ['Register', 'Fill in the Google Form with your team (max 3 members) before 5 PM on Nov 18.'],
  ['Pick a problem', 'At 6 PM on Nov 18, the statements go live. Choose the open source problem your team wants to own.'],
  ['Build for 24h', 'Spend 24 hours shipping a real, working solution. Push early, push often.'],
  ['Submit', 'When the build phase ends at 6 PM on Nov 19, send in a pitch video with a demo, plus your PPT.'],
  ['Pitch on campus', 'The top 10 shortlisted teams pitch offline on Nov 20. Results and the prize ceremony follow.'],
]

function Format() {
  return (
    <section className="section format" id="format">
      <DitherReveal src={IMG.cloud2} className="format__cloud drift-b" cell={6} />
      <div className="container">
        <Kicker n="05">format</Kicker>
        <DitherHeading>How it works</DitherHeading>
        <div className="steps">
          {STEPS.map(([title, body], i) => (
            <article className="step" key={title}>
              <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="step__title">{title}</h3>
              <p className="step__body">{body}</p>
            </article>
          ))}
          <article className="step step--blue">
            <DitherField className="step__field" mode="rise" pixel={3} strength={1.1} interactive={false} />
            <span className="step__n">→</span>
            <h3 className="step__title">Bring any stack</h3>
            <p className="step__body">Go, Rust, Python, JS, C++. If it solves the problem, it’s welcome.</p>
            <img src={IMG.gopher} className="step__gopher" alt="" />
          </article>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq" id="faq">
      <div className="container faq__grid">
        <div>
          <Kicker n="06">faq</Kicker>
          <DitherHeading>Questions?</DitherHeading>
          <p className="section__sub">Everything else gets answered once you register.</p>
          <img src={IMG.steve} alt="" className="faq__steve bob" />
        </div>
        <div className="faq__list">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={f.q}>
                <button
                  className="faq__q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <i aria-hidden="true">{isOpen ? '−' : '+'}</i>
                </button>
                <div className="faq__a" id={`faq-a-${i}`} role="region">
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section className="section partners">
      <div className="container">
        <p className="partners__title">powered by</p>
        <div className="partners__row">
          <figure>
            <img src={IMG.techsoc} alt="Technical Society logo" />
            <figcaption>Technical Society</figcaption>
          </figure>
          <figure>
            <img src={IMG.iiits} alt="IIIT Sonepat logo" />
            <figcaption>IIIT Sonepat</figcaption>
          </figure>
          <figure>
            <img src={IMG.algozenith} alt="Algozenith logo" className="partners__az" />
            <figcaption>Algozenith - IIIT Sonepat</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ now }) {
  return (
    <section className="final" id="register">
      <div className="final__inner container">
        <p className="kicker kicker--center">
          <span className="kicker__n">07</span>
          <span className="kicker__slash">/</span>register
        </p>
        <DitherHeading className="final__title">Your 24 hours start Nov 18.</DitherHeading>
        <p className="final__sub">Registrations close at 5 PM on Nov 18. Lock in your team before the problem statements drop.</p>
        <RegisterButton size="xl" />
        <Countdown now={now} />
      </div>
      <DitherReveal src={IMG.boxes} className="final__boxes" cell={9} duration={1600} />
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <DitherField className="footer__fade" mode="rise" pixel={4} strength={1} interactive={false} />
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__word">catalyst</span>
          <p>A 24-hour open source hackathon by the Technical Society.</p>
        </div>
        <div className="footer__cols">
          <div>
            <h4>Dates</h4>
            <p>Nov 18 · Registration closes, 5 PM</p>
            <p>Nov 18 · PS reveal, 6 PM</p>
            <p>Nov 19 · Build ends, 6 PM</p>
            <p>Nov 20 · Pitch & results, on campus</p>
          </div>
          <div>
            <h4>Jump to</h4>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer__base">
        <span>© 2026 Technical Society</span>
        <span>made with dithered pixels</span>
      </div>
    </footer>
  )
}

export default function App() {
  const now = useNow(1000)
  return (
    <>
      <Nav />
      <main>
        <Hero now={now} />
        <Marquee />
        <About />
        <Poll />
        <Timeline now={now} />
        <Prizes />
        <Format />
        <Faq />
        <Partners />
        <FinalCta now={now} />
      </main>
      <Footer />
    </>
  )
}
