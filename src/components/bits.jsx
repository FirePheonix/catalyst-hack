import { useEffect, useRef, useState } from 'react'
import { DATES, REGISTER_URL } from '../data.js'

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

/** Which stage of the event we're in right now. */
export function getStage(now) {
  if (now < DATES.psReveal) return { key: 'pre', label: 'Problem statements drop in and registration time ends', target: DATES.psReveal }
  if (now < DATES.buildEnd) return { key: 'build', label: 'Build round ends in', target: DATES.buildEnd }
  if (now < DATES.pitchDay) return { key: 'gap', label: 'Pitching round starts in', target: DATES.pitchDay }
  if (now < DATES.pitchEnd) return { key: 'pitch', label: 'Pitching round is live', target: null }
  return { key: 'over', label: 'That’s a wrap. See you next time', target: null }
}

const pad = (n) => String(n).padStart(2, '0')

export function Countdown({ now }) {
  const stage = getStage(now)
  if (!stage.target) {
    return (
      <div className="countdown countdown--static">
        <span className="countdown__label">{stage.label}</span>
      </div>
    )
  }
  const diff = Math.max(0, stage.target - now)
  const s = Math.floor(diff / 1000)
  const parts = [
    ['days', Math.floor(s / 86400)],
    ['hrs', Math.floor((s % 86400) / 3600)],
    ['min', Math.floor((s % 3600) / 60)],
    ['sec', s % 60],
  ]
  return (
    <div className="countdown" role="timer" aria-live="off">
      <span className="countdown__label">
        <i className="blink" /> {stage.label}
      </span>
      <div className="countdown__cells">
        {parts.map(([unit, val], i) => (
          <div className="countdown__cell" key={unit}>
            <span className="countdown__num">{pad(val)}</span>
            <span className="countdown__unit">{unit}</span>
            {i < parts.length - 1 && <span className="countdown__sep">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export function RegisterButton({ size = 'md', label = 'Register now', variant = 'primary', className = '' }) {
  const live = Boolean(REGISTER_URL)
  const [soon, setSoon] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = (e) => {
    if (live) return
    e.preventDefault()
    setSoon(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSoon(false), 1800)
  }

  return (
    <a
      className={`btn btn--${variant} btn--${size} ${soon ? 'is-soon' : ''} ${className}`}
      href={live ? REGISTER_URL : '#register'}
      target={live ? '_blank' : undefined}
      rel={live ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      <span className="btn__label">{soon ? 'form link drops soon' : label}</span>
      <span className="btn__arrow" aria-hidden="true">
        →
      </span>
    </a>
  )
}

/** Section kicker like  [ 02 / timeline ] */
export function Kicker({ n, children }) {
  return (
    <p className="kicker">
      <span className="kicker__n">{n}</span>
      <span className="kicker__slash">/</span>
      {children}
    </p>
  )
}

/** Heading with an offset, checker-dithered shadow copy of the text. */
export function DitherHeading({ as: Tag = 'h2', children, className = '' }) {
  const text = typeof children === 'string' ? children : undefined
  return (
    <Tag className={`dither-heading ${className}`} data-text={text}>
      {children}
    </Tag>
  )
}
