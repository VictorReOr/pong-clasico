import { state } from './gameState.js';
import { PALA_W, MARGEN_CENTRO, VEL_PALA_MOV } from '../config/constants.js';
import { CONFIG, PALA_ALTURA, VEL_BASE } from '../config/gameConfig.js';
import { W, H } from '../rendering/canvas.js';
import { consumirCarga, registrarGolpe, iniciarOrbita, lanzarSupertiro } from './superShot.js';
import { actualizarMarcador } from '../ui/scoreboard.js';
import { celebrarGol } from '../rendering/confetti.js';
import { centrarBola, conn, estadoRed, posicionInicialPalas } from '../network/peerNetwork.js';
import { moverCPU } from './cpuAI.js';
import { teclas } from '../input/keyboard.js';
import { mostrarVista } from '../ui/views.js';

export function limitesEsp() {
  return { xMin: 14, xMax: W / 2 - MARGEN_CENTRO - PALA_W, yMin: 14, yMax: H - 14 - PALA_ALTURA() };
}

export function limitesArg() {
  return { xMin: W / 2 + MARGEN_CENTRO, xMax: W - 14 - PALA_W, yMin: 14, yMax: H - 14 - PALA_ALTURA() };
}

export function colisionaConPala(pala) {
  const ph = PALA_ALTURA();
  const cercaX = Math.max(pala.x, Math.min(state.bola.x, pala.x + PALA_W));
  const cercaY = Math.max(pala.y, Math.min(state.bola.y, pala.y + ph));
  const dx = state.bola.x - cercaX, dy = state.bola.y - cercaY;
  return (dx * dx + dy * dy) <= state.bola.r * state.bola.r;
}

export function respuestaColision(pala, ladoQueGolpea) {
  const armado = (ladoQueGolpea === 'esp' && state.armedEsp) || (ladoQueGolpea === 'arg' && state.armedArg);

  if (armado && CONFIG.superActivo) {
    consumirCarga(ladoQueGolpea);
    iniciarOrbita(pala, ladoQueGolpea);
    return;
  }

  const ph = PALA_ALTURA();
  const cercaX = Math.max(pala.x, Math.min(state.bola.x, pala.x + PALA_W));
  const cercaY = Math.max(pala.y, Math.min(state.bola.y, pala.y + ph));
  let dx = state.bola.x - cercaX, dy = state.bola.y - cercaY;
  let dist = Math.hypot(dx, dy);
  if (dist === 0) { dx = (ladoQueGolpea === 'esp') ? 1 : -1; dy = 0; dist = 1; }
  const nx = dx / dist, ny = dy / dist;

  registrarGolpe(ladoQueGolpea);

  let velocidad = Math.min(Math.hypot(state.bola.vx, state.bola.vy) * 1.018, VEL_BASE() * 2.1);

  const offsetVertical = (state.bola.y - (pala.y + ph / 2)) / (ph / 2);
  const dirBase = ladoQueGolpea === 'esp' ? 1 : -1;
  let vx = Math.abs(nx * velocidad + dirBase * velocidad * 0.4) * dirBase;
  let vy = ny * velocidad * 0.5 + offsetVertical * velocidad * 0.7;

  const magnitudResultante = Math.hypot(vx, vy) || velocidad;
  const factorNormalizacion = velocidad / magnitudResultante;
  vx *= factorNormalizacion;
  vy *= factorNormalizacion;

  const inerciaY = ladoQueGolpea === 'esp' ? state.velPalaEspY : state.velPalaArgY;
  const inerciaX = ladoQueGolpea === 'esp' ? state.velPalaEspX : state.velPalaArgX;
  vy += inerciaY * 1.6;
  vx += inerciaX * 0.8;

  const techoConInercia = VEL_BASE() * 2.6;
  const magConInercia = Math.hypot(vx, vy);
  if (magConInercia > techoConInercia) {
    const f = techoConInercia / magConInercia;
    vx *= f; vy *= f;
  }

  state.bola.vx = vx; 
  state.bola.vy = vy;
  state.bola.x = cercaX + nx * (state.bola.r + 1);
  state.bola.y = cercaY + ny * (state.bola.r + 1);
}

export function comprobarFin() {
  if (state.scoreEsp >= CONFIG.meta || state.scoreArg >= CONFIG.meta) {
    state.estado = 'fin';
    const ganaEsp = state.scoreEsp >= CONFIG.meta;
    mostrarVista('fin', {
      titulo: `¡${(ganaEsp ? state.equipoEsp : state.equipoArg).nombre.toUpperCase()} CAMPEÓN!`,
      texto: `${state.scoreEsp} - ${state.scoreArg}`,
      revancha: (state.modo === 'local' || state.modo === 'cpu')
    });
    if (state.modo === 'host' && conn && conn.open) conn.send(estadoRed());
    return true;
  }
  return false;
}

export function iniciarPartido() {
  state.scoreEsp = 0; 
  state.scoreArg = 0; 
  actualizarMarcador();
  state.chargeEsp = 0; state.chargeArg = 0;
  state.readyEsp = false; state.readyArg = false;
  state.armedEsp = false; state.armedArg = false;
  state.orbitando = { activo: false };
  posicionInicialPalas();
  state.estado = 'jugando';
  centrarBola(Math.random() > 0.5 ? 1 : -1);
}

export function actualizar() {
  state.anguloSunburst += 0.0025;

  if (state.estado !== 'jugando') return;
  if (state.modo === 'guest') return;

  const lEsp = limitesEsp(), lArg = limitesArg();
  const prevEspX = state.palaEsp.x, prevEspY = state.palaEsp.y;
  const prevArgX = state.palaArg.x, prevArgY = state.palaArg.y;

  if (state.modo === 'local') {
    if (teclas['w'] || teclas['W']) state.palaEsp.y -= VEL_PALA_MOV;
    if (teclas['s'] || teclas['S']) state.palaEsp.y += VEL_PALA_MOV;
    if (teclas['a'] || teclas['A']) state.palaEsp.x -= VEL_PALA_MOV;
    if (teclas['d'] || teclas['D']) state.palaEsp.x += VEL_PALA_MOV;
    if (teclas['ArrowUp']) state.palaArg.y -= VEL_PALA_MOV;
    if (teclas['ArrowDown']) state.palaArg.y += VEL_PALA_MOV;
    if (teclas['ArrowLeft']) state.palaArg.x -= VEL_PALA_MOV;
    if (teclas['ArrowRight']) state.palaArg.x += VEL_PALA_MOV;
  } else if (state.modo === 'cpu') {
    if (teclas['w'] || teclas['W']) state.palaEsp.y -= VEL_PALA_MOV;
    if (teclas['s'] || teclas['S']) state.palaEsp.y += VEL_PALA_MOV;
    if (teclas['a'] || teclas['A']) state.palaEsp.x -= VEL_PALA_MOV;
    if (teclas['d'] || teclas['D']) state.palaEsp.x += VEL_PALA_MOV;
    moverCPU();
  } else if (state.modo === 'host') {
    if (teclas['w'] || teclas['W']) state.palaEsp.y -= VEL_PALA_MOV;
    if (teclas['s'] || teclas['S']) state.palaEsp.y += VEL_PALA_MOV;
    if (teclas['a'] || teclas['A']) state.palaEsp.x -= VEL_PALA_MOV;
    if (teclas['d'] || teclas['D']) state.palaEsp.x += VEL_PALA_MOV;
    state.palaArg.x += state.remoteInputDx * VEL_PALA_MOV;
    state.palaArg.y += state.remoteInputDy * VEL_PALA_MOV;
  }

  state.palaEsp.x = Math.max(lEsp.xMin, Math.min(lEsp.xMax, state.palaEsp.x));
  state.palaEsp.y = Math.max(lEsp.yMin, Math.min(lEsp.yMax, state.palaEsp.y));
  state.palaArg.x = Math.max(lArg.xMin, Math.min(lArg.xMax, state.palaArg.x));
  state.palaArg.y = Math.max(lArg.yMin, Math.min(lArg.yMax, state.palaArg.y));

  state.velPalaEspX = state.palaEsp.x - prevEspX; 
  state.velPalaEspY = state.palaEsp.y - prevEspY;
  state.velPalaArgX = state.palaArg.x - prevArgX; 
  state.velPalaArgY = state.palaArg.y - prevArgY;

  if (state.orbitando.activo) {
    state.orbitando.frame++;
    state.orbitando.angulo += 0.38;
    const ph = PALA_ALTURA();
    const signoLado = state.orbitando.lado === 'esp' ? 1 : -1;
    const centroX = state.orbitando.pala.x + PALA_W / 2 + signoLado * state.orbitando.radio * 0.75;
    const centroY = state.orbitando.pala.y + ph / 2;
    state.bola.x = centroX + Math.cos(state.orbitando.angulo) * state.orbitando.radio;
    state.bola.y = centroY + Math.sin(state.orbitando.angulo) * state.orbitando.radio * 0.7;
    state.bola.giro += 0.45;

    if (state.orbitando.frame >= state.orbitando.duracion) {
      lanzarSupertiro(state.orbitando.lado);
      state.orbitando.activo = false;
    }

    if (state.modo === 'host' && conn && conn.open) conn.send(estadoRed());
    return;
  }

  state.bola.x += state.bola.vx; 
  state.bola.y += state.bola.vy; 
  state.bola.giro += 0.12;

  if (state.bola.y - state.bola.r < 10) { state.bola.y = 10 + state.bola.r; state.bola.vy *= -1; }
  if (state.bola.y + state.bola.r > H - 10) { state.bola.y = H - 10 - state.bola.r; state.bola.vy *= -1; }

  if (state.bola.vx < 0 && colisionaConPala(state.palaEsp)) { respuestaColision(state.palaEsp, 'esp'); }
  if (state.bola.vx > 0 && colisionaConPala(state.palaArg)) { respuestaColision(state.palaArg, 'arg'); }

  if (state.bola.x < -30) {
    state.scoreArg++; 
    actualizarMarcador(); 
    celebrarGol(state.confeti, state.equipoArg.colores, W, H); 
    if (!comprobarFin()) centrarBola(1);
  } else if (state.bola.x > W + 30) {
    state.scoreEsp++; 
    actualizarMarcador(); 
    celebrarGol(state.confeti, state.equipoEsp.colores, W, H); 
    if (!comprobarFin()) centrarBola(-1);
  }

  if (state.modo === 'host' && conn && conn.open) conn.send(estadoRed());
}
