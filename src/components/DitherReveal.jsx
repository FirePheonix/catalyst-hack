import { useEffect, useRef, useState } from 'react'
import { BAYER8, prefersReducedMotion } from './dither.js'

/**
 * Shows an image by "dithering it in": cells appear in Bayer-matrix order
 * when the image scrolls into view, then the real <img> takes over.
 */
export default function DitherReveal({
  src,
  alt = '',
  cell = 7,
  duration = 1300,
  delay = 0,
  className = '',
  imgClassName = '',
  style,
  eager = false,
}) {
  const wrap = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const el = wrap.current
    const canvas = canvasRef.current
    const image = imgRef.current
    if (!el || !canvas || !image) return
    if (prefersReducedMotion()) {
      setDone(true)
      return
    }

    let raf = 0
    let timer = 0
    let started = false
    let cancelled = false

    const run = () => {
      if (started || cancelled) return
      started = true
      const r = el.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = Math.max(1, Math.round(r.width * dpr))
      const H = Math.max(1, Math.round(r.height * dpr))
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      const c = Math.max(2, Math.round(cell * dpr))
      const cols = Math.ceil(W / c)
      const rows = Math.ceil(H / c)

      // order every cell by its Bayer value + a bit of noise
      const order = new Float32Array(cols * rows)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++)
          order[y * cols + x] = (BAYER8[((y & 7) << 3) + (x & 7)] + Math.random() * 6) / 70

      const t0 = performance.now() + delay
      const frame = (now) => {
        if (cancelled) return
        const p = Math.min(1, Math.max(0, (now - t0) / duration))
        const eased = 1 - Math.pow(1 - p, 2)
        ctx.clearRect(0, 0, W, H)
        ctx.save()
        ctx.beginPath()
        for (let i = 0; i < order.length; i++) {
          if (order[i] < eased) {
            const x = i % cols
            const y = (i / cols) | 0
            ctx.rect(x * c, y * c, c, c)
          }
        }
        ctx.clip()
        ctx.drawImage(image, 0, 0, W, H)
        ctx.restore()
        if (p < 1) raf = requestAnimationFrame(frame)
        else setDone(true)
      }
      raf = requestAnimationFrame(frame)
    }

    const whenLoaded = (fn) => {
      if (image.complete && image.naturalWidth) fn()
      else image.addEventListener('load', fn, { once: true })
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect()
          whenLoaded(run)
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    // safety net: never leave an image hidden
    timer = window.setTimeout(() => !started && whenLoaded(() => setDone(true)), 8000)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      io.disconnect()
    }
  }, [src, cell, duration, delay])

  return (
    <div ref={wrap} className={`dither-reveal ${done ? 'is-done' : ''} ${className}`} style={style}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={imgClassName}
        draggable="false"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
