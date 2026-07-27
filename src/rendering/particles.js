import { PAPEL_CREMA } from '../config/constants.js';

export function initParticulas(W, H) {
  const particulas = [];
  for(let i=0; i<26; i++){
    particulas.push({
      x: Math.random()*W, 
      y: Math.random()*H,
      r: 1 + Math.random()*2, 
      fase: Math.random()*Math.PI*2,
      vel: 0.15 + Math.random()*0.3
    });
  }
  return particulas;
}

export function actualizarParticulas(particulas, W, H) {
  particulas.forEach(p => {
    p.fase += p.vel * 0.02;
    p.y -= p.vel * 0.3;
    p.x += Math.sin(p.fase) * 0.3;
    if (p.y < -5) { 
      p.y = H + 5; 
      p.x = Math.random() * W; 
    }
  });
}

export function dibujarParticulas(ctx, particulas) {
  ctx.save();
  particulas.forEach(p => {
    ctx.globalAlpha = 0.10 + 0.05 * Math.sin(p.fase);
    ctx.fillStyle = PAPEL_CREMA;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}
