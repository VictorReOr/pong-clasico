import { PAPEL_CREMA, PAPEL_TINTA_VERDE } from '../config/constants.js';

export function dibujarFondoCancha(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#33553A');
  grad.addColorStop(1, PAPEL_TINTA_VERDE);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  dibujarFranjasCesped(ctx, W, H);

  ctx.save();
  ctx.globalAlpha = .05;
  ctx.fillStyle = PAPEL_CREMA;
  const paso = 14;
  for (let y = paso / 2; y < H; y += paso) {
    for (let x = (((y / paso) | 0) % 2 === 0 ? paso / 2 : paso); x < W; x += paso) {
      ctx.beginPath(); 
      ctx.arc(x, y, 1.4, 0, Math.PI * 2); 
      ctx.fill();
    }
  }
  ctx.restore();

  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,.35)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

export function dibujarFranjasCesped(ctx, W, H) {
  const franjas = 10;
  const alturaFranja = H / franjas;
  ctx.save();
  for (let i = 0; i < franjas; i++) {
    ctx.fillStyle = (i % 2 === 0) ? 'rgba(242,232,213,0.06)' : 'rgba(26,23,18,0.10)';
    ctx.fillRect(0, i * alturaFranja, W, alturaFranja);
  }
  ctx.restore();
}

export function dibujarSunburstCentro(ctx, W, H, anguloSunburst) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(anguloSunburst);
  const radios = 82;
  const rayos = 22;
  for (let i = 0; i < rayos; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const a0 = (Math.PI * 2 / rayos) * i;
    const a1 = a0 + (Math.PI * 2 / rayos) * 0.5;
    ctx.arc(0, 0, radios, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(217,164,65,.14)' : 'rgba(217,164,65,.05)';
    ctx.fill();
  }
  ctx.restore();

  ctx.beginPath(); 
  ctx.arc(W / 2, H / 2, 72, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(242,232,213,0.16)'; 
  ctx.lineWidth = 2; 
  ctx.stroke();
}

export function dibujarLineasCancha(ctx, W, H) {
  ctx.strokeStyle = 'rgba(242,232,213,0.22)';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, W - 20, H - 20);

  ctx.setLineDash([14, 14]);
  ctx.beginPath(); 
  ctx.moveTo(W / 2, 10); 
  ctx.lineTo(W / 2, H - 10);
  ctx.strokeStyle = 'rgba(242,232,213,0.16)'; 
  ctx.stroke();
  ctx.setLineDash([]);
}
