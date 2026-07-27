export function initTrails() {
  return {
    esp: [],
    arg: []
  };
}

export function actualizarTrails(trails, state) {
  const maxTrailLength = 7;

  // Si la pala de España se mueve rápido, guardamos su posición en la estela
  if (Math.abs(state.velPalaEspY) > 0.8 || Math.abs(state.velPalaEspX) > 0.8) {
    trails.esp.unshift({
      x: state.palaEsp.x,
      y: state.palaEsp.y,
      colores: state.equipoEsp.colores,
      vida: 1.0
    });
  }

  // Si la pala de Argentina se mueve rápido, guardamos su posición en la estela
  if (Math.abs(state.velPalaArgY) > 0.8 || Math.abs(state.velPalaArgX) > 0.8) {
    trails.arg.unshift({
      x: state.palaArg.x,
      y: state.palaArg.y,
      colores: state.equipoArg.colores,
      vida: 1.0
    });
  }

  // Reducir vida de cada partícula del trail y filtrar
  trails.esp.forEach(t => t.vida -= 0.12);
  trails.arg.forEach(t => t.vida -= 0.12);

  trails.esp = trails.esp.filter(t => t.vida > 0).slice(0, maxTrailLength);
  trails.arg = trails.arg.filter(t => t.vida > 0).slice(0, maxTrailLength);
}

export function dibujarTrails(ctx, trails, renderPalaFn) {
  ctx.save();
  
  // Dibujar trails de España
  trails.esp.forEach(t => {
    ctx.globalAlpha = t.vida * 0.35;
    renderPalaFn(ctx, { x: t.x, y: t.y }, t.colores, true);
  });

  // Dibujar trails de Argentina
  trails.arg.forEach(t => {
    ctx.globalAlpha = t.vida * 0.35;
    renderPalaFn(ctx, { x: t.x, y: t.y }, t.colores, true);
  });

  ctx.restore();
}
