import { useEffect, useRef } from 'react';

/** Floating particle mesh (canvas, DPR-aware) over slow-drifting cream light. */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext('2d')!;
    let w = 0, h = 0, raf = 0;
    const resize = () => { const d = Math.min(devicePixelRatio, 2); w = innerWidth; h = innerHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize(); addEventListener('resize', resize);
    const N = innerWidth < 700 ? 38 : 70;
    const P = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of P) { p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h; }
      for (let i = 0; i < N; i++) {
        ctx.fillStyle = 'rgba(222,219,200,.55)'; ctx.fillRect(P[i].x, P[i].y, 1.4, 1.4);
        for (let j = i + 1; j < N; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = dx * dx + dy * dy;
          if (d < 14000) { ctx.strokeStyle = `rgba(222,219,200,${0.12 * (1 - d / 14000)})`; ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke(); }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden" aria-hidden>
      <div className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(222,219,200,.10),transparent_65%)] animate-drift" />
      <div className="absolute -bottom-1/3 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(150,120,80,.12),transparent_65%)] animate-drift [animation-delay:-11s]" />
      <canvas ref={ref} className="absolute inset-0 w-full h-full" />
      <div className="noise absolute inset-0 opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
