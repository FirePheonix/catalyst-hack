import { useEffect, useRef } from 'react'
import { BAYER_T, BLUE, prefersReducedMotion } from './dither.js'

/**
 * A live, ordered-dithered canvas. A continuous scalar field is computed
 * per low-res pixel and thresholded against the Bayer matrix, so soft
 * shapes come out as crisp blue dot patterns.
 *
 * modes:
 *  - "blobs"    drifting soft blobs + one that follows the cursor
 *  - "rise"     density rising from the bottom edge, with a wavy front
 *  - "fall"     same, but from the top edge
 */
export default function DitherField({
  mode = 'blobs',
  pixel = 4,
  color = BLUE,
  strength = 1,
  interactive = true,
  fps = 30,
  className = '',
  style,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 1
    let h = 1
    let img = null
    let raf = 0
    let visible = true
    let last = 0
    const t0 = performance.now()
    const reduce = prefersReducedMotion()
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, a: 0, ta: 0 }
    const [cr, cg, cb] = color

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, Math.ceil(r.width / pixel))
      h = Math.max(1, Math.ceil(r.height / pixel))
      canvas.width = w
      canvas.height = h
      img = ctx.createImageData(w, h)
      draw(performance.now(), true)
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inside = x >= -80 && y >= -80 && x <= r.width + 80 && y <= r.height + 80
      mouse.tx = x / pixel
      mouse.ty = y / pixel
      mouse.ta = inside ? 1 : 0
      if (mouse.x < -999) {
        mouse.x = mouse.tx
        mouse.y = mouse.ty
      }
    }
    const onLeave = () => (mouse.ta = 0)

    const fieldBlobs = (t) => {
      const m = Math.min(w, h)
      // blobs orbit near the edges so the centre (text) stays readable
      return [
        { x: w * (0.02 + 0.03 * Math.sin(t * 0.31)), y: h * (0.78 + 0.1 * Math.cos(t * 0.23)), r: m * 0.15, a: 0.85 },
        { x: w * (0.99 + 0.02 * Math.cos(t * 0.27)), y: h * (0.22 + 0.12 * Math.sin(t * 0.19)), r: m * 0.13, a: 0.8 },
        { x: w * (0.86 + 0.08 * Math.sin(t * 0.17)), y: h * (1.04 + 0.03 * Math.cos(t * 0.41)), r: m * 0.17, a: 0.9 },
      ]
    }

    function draw(now, force = false) {
      if (!img) return
      const t = reduce ? 4 : (now - t0) / 1000
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      mouse.a += (mouse.ta - mouse.a) * 0.08
      const data = img.data
      const blobs = mode === 'blobs' ? fieldBlobs(t) : null
      const mr = Math.min(w, h) * 0.11
      const mr2 = mr * mr

      for (let y = 0; y < h; y++) {
        const row = (y & 7) << 3
        const ny = y / h
        for (let x = 0; x < w; x++) {
          let v = 0
          if (blobs) {
            for (let i = 0; i < blobs.length; i++) {
              const b = blobs[i]
              const dx = x - b.x
              const dy = y - b.y
              v += b.a * Math.exp(-(dx * dx + dy * dy) / (b.r * b.r))
            }
          } else {
            const nx = x / w
            const wave =
              0.07 * Math.sin(nx * 9 + t * 1.1) +
              0.05 * Math.sin(nx * 23 - t * 1.7) +
              0.03 * Math.sin(nx * 47 + t * 2.3)
            const d = mode === 'rise' ? ny : 1 - ny
            v = Math.pow(Math.max(0, Math.min(1, (d - 0.12 + wave) / 0.88)), 1.35)
          }
          if (interactive && mouse.a > 0.01) {
            const dx = x - mouse.x
            const dy = y - mouse.y
            v += 0.75 * mouse.a * Math.exp(-(dx * dx + dy * dy) / mr2)
          }
          const on = v * strength > BAYER_T[row + (x & 7)]
          const i4 = (y * w + x) << 2
          data[i4] = cr
          data[i4 + 1] = cg
          data[i4 + 2] = cb
          data[i4 + 3] = on ? 255 : 0
        }
      }
      ctx.putImageData(img, 0, 0)
      if (force) last = now
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (!visible || now - last < 1000 / fps) return
      last = now
      draw(now)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    if (interactive) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }
    resize()
    if (!reduce) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [mode, pixel, strength, interactive, fps, color])

  return <canvas ref={ref} aria-hidden="true" className={`dither-field ${className}`} style={style} />
}
