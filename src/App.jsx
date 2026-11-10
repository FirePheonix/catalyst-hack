import { useEffect, useState } from 'react'
import DitherField from './components/DitherField.jsx'
import DitherReveal from './components/DitherReveal.jsx'
import { Countdown, DitherHeading, Kicker, RegisterButton, getStage, useNow } from './components/bits.jsx'
import { FAQS, IMG, PHASES } from './data.js'

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
        <b>Nov 17</b>
        <span>Problem statements revealed · 12 noon</span>
      </li>
      <li>
        <b>Nov 19</b>
        <span>Build round ends · 12 noon</span>
      </li>
      <li>
        <b>Nov 20</b>
        <span>Offline pitching round & results</span>
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
          48 hours hackathon to solve the
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
  const items = ['catalyst', '48 hours', 'open source', 'nov 17 → 20', 'build', 'ship', 'pitch', 'prizes for top 3', 'register now']
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
            A <em>48-hour hackathon</em> where you take on the biggest problems in open source: the bugs nobody fixed,
            the tools nobody built, and the rough edges every developer trips over.
          </p>
          <p className="body">
            Problem statements drop at <b>12 noon on Nov 17</b>. From that moment you have exactly 48 hours to build a
            working solution. On <b>Nov 20</b>, the best teams pitch their work offline, in front of the judges, and the
            results are announced the same day.
          </p>
          <div className="about__cta">
            <RegisterButton />
          </div>
        </div>

        <div className="about__visual">
          <DitherReveal src={IMG.statue} className="about__statue" cell={6} />
          <div className="stats">
            <div className="stat">
              <span className="stat__num">48</span>
              <span className="stat__label">hours to build</span>
            </div>
            <div className="stat">
              <span className="stat__num">03</span>
              <span className="stat__label">rounds</span>
            </div>
            <div className="stat">
              <span className="stat__num">01</span>
              <span className="stat__label">offline pitch day</span>
            </div>
            <div className="stat">
              <span className="stat__num">∞</span>
              <span className="stat__label">commits allowed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function phaseStatus(phase, now) {
  if (now >= phase.end && phase.end > phase.start) return 'done'
  if (phase.end.getTime() === phase.start.getTime()) return now >= phase.start ? 'done' : 'upcoming'
  if (now >= phase.start) return 'live'
  return 'upcoming'
}

function Timeline({ now }) {
  const stage = getStage(now)
  return (
    <section className="section timeline" id="timeline">
      <div className="container">
        <Kicker n="02">timeline</Kicker>
        <DitherHeading>Three rounds. One clock.</DitherHeading>
        <p className="section__sub">All times in IST. The 48-hour build clock starts the second the problem statements go live.</p>

        <ol className="phases">
          {PHASES.map((p) => {
            const status = phaseStatus(p, now)
            const span = p.end - p.start
            const pct = span > 0 ? Math.min(100, Math.max(0, ((now - p.start) / span) * 100)) : status === 'done' ? 100 : 0
            return (
              <li key={p.id} className={`phase phase--${status}`}>
                <div className="phase__top">
                  <span className="phase__id">{p.id}</span>
                  <span className={`chip chip--${status}`}>{status === 'live' ? '● live' : status}</span>
                </div>
                <p className="phase__kicker">{p.kicker}</p>
                <h3 className="phase__title">{p.title}</h3>
                <p className="phase__date">{p.date}</p>
                <p className="phase__time">{p.time}</p>
                <p className="phase__body">{p.body}</p>
                {span > 0 && (
                  <div className="phase__bar" aria-label={`${Math.round(pct)}% elapsed`}>
                    <span style={{ width: `${pct}%` }} />
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        <div className="timeline__now">
          <Countdown now={now} />
          {stage.key === 'pre' && <RegisterButton />}
        </div>
      </div>
    </section>
  )
}

const PRIZES = [
  { rank: '1', suffix: 'st', label: 'Winner', tier: 'gold' },
  { rank: '2', suffix: 'nd', label: 'Runner up', tier: 'silver' },
  { rank: '3', suffix: 'rd', label: 'Second runner up', tier: 'bronze' },
]

function Prizes() {
  return (
    <section className="section prizes" id="prizes">
      <div className="container">
        <Kicker n="03">prizes</Kicker>
        <DitherHeading>Prize pool: ???</DitherHeading>
        <p className="section__sub">
          The prize money isn’t fixed yet. <b>It grows with participation</b>: the more teams that register, the
          bigger the pool. Once registrations close, the final amount is announced and split across the top 3.
        </p>

        <div className="podium">
          {PRIZES.map((p) => (
            <article key={p.rank} className={`podium__slot podium__slot--${p.tier}`}>
              <div className="podium__card">
                <p className="podium__label">{p.label}</p>
                <p className="podium__amount" aria-label="Amount to be announced">
                  <span className="podium__cur">₹</span>
                  <span className="podium__q" data-text="?">?</span>
                </p>
                <p className="podium__note">to be announced</p>
              </div>
              <div className="podium__block">
                {p.tier === 'gold' && (
                  <DitherField className="podium__field" mode="rise" pixel={3} strength={1.15} interactive={false} />
                )}
                <span className="podium__rank">
                  {p.rank}
                  <small>{p.suffix}</small>
                </span>
              </div>
            </article>
          ))}
        </div>

        <ol className="pool">
          <li>
            <span className="pool__n">01</span>
            <span>More teams register</span>
          </li>
          <li aria-hidden="true" className="pool__arrow">→</li>
          <li>
            <span className="pool__n">02</span>
            <span>Prize pool grows</span>
          </li>
          <li aria-hidden="true" className="pool__arrow">→</li>
          <li>
            <span className="pool__n">03</span>
            <span>Split across the top 3</span>
          </li>
        </ol>

        <div className="prizes__cta">
          <RegisterButton label="Grow the pool: register" />
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  ['Register', 'Fill in the Google Form with your team details before the problem statements drop.'],
  ['Pick a problem', 'At 12 noon on Nov 17, statements go live. Choose the open source problem your team wants to own.'],
  ['Build in the open', 'Spend 48 hours shipping a real, working solution. Push early, push often.'],
  ['Submit by noon', 'Lock in your project before 12 noon on Nov 19. When the clock hits zero, the build round is over.'],
  ['Pitch it live', 'Teams present their builds offline on Nov 20. Demo it, defend it, win it.'],
]

function Format() {
  return (
    <section className="section format" id="format">
      <DitherReveal src={IMG.cloud2} className="format__cloud drift-b" cell={6} />
      <div className="container">
        <Kicker n="04">format</Kicker>
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
          <Kicker n="05">faq</Kicker>
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
            <img src={IMG.iiits} alt="IIIT Sonipat logo" />
            <figcaption>IIIT Sonipat</figcaption>
          </figure>
          <figure>
            <img src={IMG.algozenith} alt="AlgoZenith logo" className="partners__az" />
            <figcaption>AlgoZenith</figcaption>
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
          <span className="kicker__n">06</span>
          <span className="kicker__slash">/</span>register
        </p>
        <DitherHeading className="final__title">Your 48 hours start Nov 17.</DitherHeading>
        <p className="final__sub">Grab your spot and lock in your team before the problem statements drop.</p>
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
          <p>A 48-hour open source hackathon by the Technical Society.</p>
        </div>
        <div className="footer__cols">
          <div>
            <h4>Dates</h4>
            <p>Nov 17 · PS reveal, 12 noon</p>
            <p>Nov 19 · Build ends, 12 noon</p>
            <p>Nov 20 · Pitch & results</p>
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
