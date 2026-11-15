import { useEffect, useId, useRef, useState } from 'react'

/*
 * Pixel-art bits from the poster frames: trophies, laurels, "rays" tick marks,
 * and the hand-drawn hackathon doodle from the timeline frame.
 *
 * Pixel maps: '1' = outline, '2' = halftone fill, '3' = solid fill, '.' = empty.
 */
const TROPHY = [
  '..111111111111..',
  '1111222222221111',
  '1..1222222221..1',
  '1..1222222221..1',
  '.1.1222222221.1.',
  '..112222222211..',
  '...1222222221...',
  '....12222221....',
  '.....122221.....',
  '......1221......',
  '......1221......',
  '.....111111.....',
  '....12222221....',
  '....11111111....',
]

const TROPHY_STAR = [
  '..111111111111..',
  '1111222332221111',
  '1..1222332221..1',
  '1..1333333331..1',
  '.1.1233333321.1.',
  '..112233332211..',
  '...1233223321...',
  '....12222221....',
  '.....122221.....',
  '......1221......',
  '......1221......',
  '.....111111.....',
  '....12222221....',
  '....11111111....',
]

function PixelArt({ map, className = '', title }) {
  const id = useId().replace(/:/g, '')
  const w = map[0].length
  const h = map.length
  const cells = []
  map.forEach((row, y) => {
    ;[...row].forEach((c, x) => {
      if (c === '.') return
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1.02"
          height="1.02"
          fill={c === '2' ? `url(#ht-${id})` : 'currentColor'}
        />
      )
    })
  })
  return (
    <svg
      className={`pixel ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
    >
      {title && <title>{title}</title>}
      <defs>
        <pattern id={`ht-${id}`} width="0.5" height="0.5" patternUnits="userSpaceOnUse">
          <rect width="0.5" height="0.5" fill="#fff" />
          <rect width="0.25" height="0.25" fill="currentColor" />
        </pattern>
      </defs>
      {cells}
    </svg>
  )
}

export function PixelTrophy({ star = false, className = '', title }) {
  return <PixelArt map={star ? TROPHY_STAR : TROPHY} className={className} title={title} />
}

const BRIEFCASE = [
  '....111111....',
  '....1....1....',
  '11111111111111',
  '1............1',
  '1............1',
  '111111..111111',
  '1....1111....1',
  '1............1',
  '1............1',
  '11111111111111',
]

const GRAD_CAP = [
  '.......11.......',
  '.....111111.....',
  '...1112222111...',
  '.11122222222111.',
  '.11122222222111.',
  '...1112222111.1.',
  '...1..1111..1.1.',
  '...1........1.1.',
  '....11111111..1.',
]

const CODE = [
  '...1.......1.1...',
  '..1.......1...1..',
  '.1.......1.....1.',
  '1.......1.......1',
  '.1.....1.......1.',
  '..1...1.......1..',
  '...1.1.......1...',
]

/** Small outlined icons for mentor cards. */
export function PixelIcon({ name, className = '' }) {
  if (name === 'trophy') return <PixelTrophy className={className} />
  const map = name === 'work' ? BRIEFCASE : name === 'grad' ? GRAD_CAP : CODE
  return <PixelArt map={map} className={className} />
}

/** Laurel branch; `flip` mirrors it for the right-hand side. */
export function Laurel({ flip = false, className = '' }) {
  const leaves = [
    [14, 40, -55],
    [10, 32, -40],
    [8, 23, -25],
    [9, 14, -5],
    [13, 6, 15],
  ]
  return (
    <svg
      className={`laurel ${className}`}
      viewBox="0 0 26 50"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M20 48 C 8 40, 3 26, 12 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse cx="-4" cy="0" rx="4.6" ry="2" fill="currentColor" />
          <ellipse cx="4" cy="-1" rx="4.2" ry="1.8" fill="currentColor" transform="rotate(-50)" />
        </g>
      ))}
    </svg>
  )
}

/** The three little "spark" strokes that sit next to headings in the frames. */
export function Rays({ className = '' }) {
  return (
    <svg className={`rays ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <line x1="6" y1="22" x2="4" y2="6" />
        <line x1="16" y1="26" x2="28" y2="12" />
        <line x1="20" y1="36" x2="36" y2="32" />
      </g>
    </svg>
  )
}

/** Adds `is-in` once the element scrolls into view (for one-shot animations). */
export function useInView(options = { threshold: 0.35 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [inView])
  return [ref, inView]
}

// A tangled "idea" scribble, generated once so it's stable between renders.
const SCRIBBLE = (() => {
  const pts = []
  for (let i = 0; i <= 64; i++) {
    const a = i * 0.83
    const r = 15 + 7 * Math.sin(i * 1.71) + 3 * Math.cos(i * 0.53)
    pts.push([200 + r * 1.55 * Math.cos(a), 74 + r * 0.82 * Math.sin(a)])
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length - 1; i += 2) {
    d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`
  }
  return d
})()

/** Hand-drawn flow from the timeline frame: hackathon → build / submit → winners! */
export function HackathonDoodle({ className = '' }) {
  return (
    <svg
      className={`doodle ${className}`}
      viewBox="0 0 400 340"
      role="img"
      aria-label="Doodle: the hackathon splits into build and submit, which lead to the trophy and the winners."
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* title + sparks */}
        <path d="M128 30 l-10 -8 M132 40 l-14 -2 M272 30 l10 -8 M268 40 l14 -2" />
        {/* scribble */}
        <path d={SCRIBBLE} strokeWidth="1.4" />

        {/* arrows out of the scribble, each with a little loop */}
        <path d="M172 92 C 150 110, 130 122, 112 150" />
        <ellipse cx="146" cy="114" rx="10" ry="7" transform="rotate(-40 146 114)" />
        <path d="M104 142 l8 10 l3 -13" />
        <path d="M228 92 C 250 110, 270 122, 288 150" />
        <ellipse cx="254" cy="114" rx="10" ry="7" transform="rotate(40 254 114)" />
        <path d="M296 142 l-8 10 l-3 -13" />

        {/* build: code page */}
        <path d="M84 158 l40 -6 l7 50 l-40 6 z" />
        <path d="M100 172 l-6 5 l7 4 M112 169 l-4 13 M118 168 l6 4 l-5 6 M95 191 l26 -4 M97 198 l20 -3" strokeWidth="1.8" />

        {/* submit: stacked pages with a tick */}
        <path d="M276 160 l38 -4 l4 46 l-38 4 z" />
        <path d="M282 156 l38 -6 l6 46" />
        <path d="M288 152 l38 -8 l6 44" strokeWidth="1.6" />
        <path d="M286 172 l18 -2 M287 180 l12 -1" strokeWidth="1.8" />
        <path d="M290 192 l6 6 l12 -16" />

        {/* arrows curving down to the winner */}
        <path d="M104 238 C 108 270, 130 286, 160 292" />
        <path d="M150 284 l11 8 l-12 6" />
        <path d="M300 238 C 296 270, 274 286, 244 292" />
        <path d="M254 284 l-11 8 l12 6" />

        {/* trophy */}
        <path d="M184 222 h32 v10 c0 12 -7 20 -16 20 c-9 0 -16 -8 -16 -20 z" />
        <path d="M184 228 c-8 0 -10 10 -1 13 M216 228 c8 0 10 10 1 13" />
        <path d="M200 252 v8 M190 262 h20 M188 266 h24" />
        <path d="M200 230 l2.6 5.4 l5.8 .7 l-4.3 4 l1.1 5.8 l-5.2 -2.8 l-5.2 2.8 l1.1 -5.8 l-4.3 -4 l5.8 -.7 z" fill="currentColor" strokeWidth="1" />
        <path d="M200 208 v6 M184 210 l3 6 M216 210 l-3 6 M172 218 l6 4 M228 218 l-6 4" strokeWidth="1.8" />

        {/* happy face */}
        <path d="M168 300 c0 -20 14 -30 32 -30 c18 0 32 10 32 30 c0 16 -14 28 -32 28 c-18 0 -32 -12 -32 -28 z" />
        <circle cx="188" cy="296" r="3" fill="currentColor" />
        <circle cx="212" cy="296" r="3" fill="currentColor" />
        <path d="M188 310 c6 6 18 6 24 0" />
        <path d="M168 300 c-5 0 -5 8 0 8 M232 300 c5 0 5 8 0 8" />

        {/* !! + underline for "winners!" */}
        <path d="M244 268 l3 -16 M252 270 l3 -16" strokeWidth="2.6" />
        <circle cx="243" cy="275" r="1.4" fill="currentColor" />
        <circle cx="251" cy="277" r="1.4" fill="currentColor" />
        <path d="M268 298 c 30 -8, 60 -14, 92 -20 M276 306 c 26 -6, 50 -10, 72 -14" strokeWidth="1.8" />
      </g>
      <g className="doodle__text" fill="currentColor">
        <text x="200" y="40" textAnchor="middle" fontSize="24">
          Hackathon
        </text>
        <text x="106" y="230" textAnchor="middle" fontSize="19">
          build
        </text>
        <text x="300" y="230" textAnchor="middle" fontSize="19">
          submit
        </text>
        <text x="266" y="292" fontSize="26" transform="rotate(-12 266 292)">
          winners!
        </text>
      </g>
    </svg>
  )
}
