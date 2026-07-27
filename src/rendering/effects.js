import { PAPEL_CREMA } from '../config/constants.js';

export function dibujarEfectoSuper(ctx, efectoSuper, W) {
  if (!efectoSuper.activo) return;

  const t = performance.now() - efectoSuper.inicio;
  if (t > 1000) {
    efectoSuper.activo = false;
  } else {
    const progreso = Math.min(t / 160, 1);
    const escala = 1.5 - 0.5 * progreso;
    ctx.save();
    ctx.translate(W / 2, 56);
    ctx.rotate(-0.05);
    ctx.scale(escala, escala);
    ctx.globalAlpha = t < 800 ? 1 : 1 - (t - 800) / 200;

    const texto = '¡SUPERTIRO ' + efectoSuper.equipo.nombre.toUpperCase() + '!';
    ctx.font = "bold 30px 'Anton', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const metrica = ctx.measureText(texto);
    const padX = 22, padY = 14;

    ctx.strokeStyle = efectoSuper.equipo.colores[0];
    ctx.lineWidth = 4;
    ctx.strokeRect(-metrica.width / 2 - padX, -18 - padY, metrica.width + padX * 2, 36 + padY * 2);

    ctx.fillStyle = efectoSuper.equipo.colores[0];
    ctx.fillText(texto, 1, 1);
    ctx.fillStyle = PAPEL_CREMA;
    ctx.fillText(texto, 0, 0);
    ctx.restore();
  }
}
