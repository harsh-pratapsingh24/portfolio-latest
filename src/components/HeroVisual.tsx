"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number; size: number };

/** A lightweight canvas portrait: no image asset, WebGL dependency or layout shift. */
export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0; let height = 0; let ratio = 1;
    let points: Point[] = [];

    const portrait = (x: number, y: number) => {
      // Layered ellipses form a sculptural side-facing digital bust.
      const head = ((x - 0.46) / 0.28) ** 2 + ((y - 0.40) / 0.34) ** 2 < 1;
      const jaw = ((x - 0.48) / 0.26) ** 2 + ((y - 0.59) / 0.18) ** 2 < 1 && y > .43;
      const neck = x > .43 && x < .68 && y > .61 && y < .92;
      const nose = x > .17 && x < .40 && y > .42 && y < .50 && y < 1.34 - 2.1 * x;
      const chin = x > .23 && x < .5 && y > .61 && y < .72;
      const shoulder = ((x - .61) / .48) ** 2 + ((y - .92) / .18) ** 2 < 1;
      // Eyes/mouth produce readable negative-space contour lines.
      const eye = Math.abs(y - (.406 + .06 * (x - .34))) < .012 && x > .27 && x < .48;
      const mouth = Math.abs(y - (.585 + .035 * (x - .26))) < .011 && x > .22 && x < .43;
      return (head || jaw || neck || nose || chin || shoulder) && !eye && !mouth;
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = [];
      const density = Math.min(2100, Math.floor(width * height / 145));
      for (let i = 0; i < density; i++) {
        const x = Math.random(); const y = Math.random();
        if (portrait(x, y) && Math.random() > .21) points.push({ x, y, z: Math.random(), size: Math.random() * 1.1 + .3 });
      }
    };
    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      // scanline field
      ctx.strokeStyle = "rgba(255,255,255,.055)"; ctx.lineWidth = .5;
      for (let y = 9; y < height; y += 9) { ctx.beginPath(); ctx.moveTo(0, y + Math.sin(t * 1.8 + y) * .7); ctx.lineTo(width, y); ctx.stroke(); }
      // point cloud
      points.forEach((p, i) => {
        const drift = reduced ? 0 : Math.sin(t * 1.3 + p.z * 22 + i) * 1.8;
        const x = p.x * width + drift; const y = p.y * height + Math.cos(t + p.z * 14) * .8;
        const lum = 118 + Math.floor(p.z * 130);
        ctx.fillStyle = `rgba(${lum},${lum},${lum + 5},${.28 + p.z * .65})`;
        ctx.fillRect(x, y, p.size + (p.z > .83 ? 1.4 : 0), p.size);
        if (i % 17 === 0) { ctx.fillStyle = "rgba(28,101,255,.74)"; ctx.fillRect(x, y, 2.6, 2.6); }
      });
      // technical wireframe
      const pad = width * .075; const top = height * .07; const right = width - pad; const bottom = height * .93;
      ctx.strokeStyle = "rgba(210,224,255,.32)"; ctx.lineWidth = 1;
      ctx.strokeRect(pad, top, right - pad, bottom - top);
      ctx.beginPath(); ctx.moveTo(pad, top); ctx.lineTo(pad + width * .23, top - height * .05); ctx.lineTo(right, top + height * .12); ctx.moveTo(right, top + height * .12); ctx.lineTo(right, bottom); ctx.lineTo(right - width * .24, bottom + height * .04); ctx.lineTo(pad, bottom); ctx.stroke();
      ctx.strokeStyle = "rgba(39,105,255,.78)"; ctx.beginPath(); ctx.moveTo(width*.24,height*.58); ctx.lineTo(width*.67,height*.24); ctx.lineTo(width*.57,height*.84); ctx.stroke();
      [[.24,.58,"572676"],[.67,.24,"572693"],[.57,.84,"572695"],[.49,.42,"72492"]].forEach(([px,py,label]) => {
        const x = Number(px)*width, y = Number(py)*height;
        ctx.fillStyle = "#2365ff"; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "rgba(238,242,255,.87)"; ctx.font = "10px monospace"; ctx.fillText(String(label),x+7,y-6);
      });
      ctx.fillStyle = "rgba(225,232,250,.55)"; ctx.font = "9px monospace";
      ["311354", "334656", "0987698", "0123350", "913902", "512305"].forEach((n,i) => ctx.fillText(n, width*.11, height*.15+i*13));
      ctx.fillStyle = "rgba(91,138,255,.68)"; ctx.fillText("IDENTITY / 01", width*.10, height*.89);
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    if (reduced) draw(0);
    else frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <div className="hero-visual" aria-label="Animated generative digital portrait"><canvas ref={canvasRef} /></div>;
}
