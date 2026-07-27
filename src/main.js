import { initCanvas, ctx, W, H } from './rendering/canvas.js';
import { initDOM } from './ui/dom.js';
import { initKeyboard } from './input/keyboard.js';
import { state } from './core/gameState.js';
import { initParticulas, actualizarParticulas, dibujarParticulas } from './rendering/particles.js';
import { actualizarConfeti, dibujarConfeti } from './rendering/confetti.js';
import { dibujarFondoCancha, dibujarSunburstCentro, dibujarLineasCancha } from './rendering/field.js';
import { dibujarPala, dibujarBola } from './rendering/entities.js';
import { dibujarEfectoSuper } from './rendering/effects.js';
import { initTrails, actualizarTrails, dibujarTrails } from './rendering/trail.js';
import { actualizar } from './core/physics.js';
import { mostrarVista } from './ui/views.js';
import { mostrarTituloNeutro, actualizarBarras } from './ui/scoreboard.js';

let trails = null;

function dibujarCancha() {
  ctx.clearRect(0, 0, W, H);
  dibujarFondoCancha(ctx, W, H);
  dibujarParticulas(ctx, state.particulas);
  dibujarLineasCancha(ctx, W, H);
  dibujarSunburstCentro(ctx, W, H, state.anguloSunburst);

  // Dibuja las estelas de velocidad (afterimages) detrás de los jugadores
  if (trails) {
    dibujarTrails(ctx, trails, (c, p, col, esTrail) => dibujarPala(c, p, col, esTrail));
  }

  // Dibuja los futbolistas de cada equipo con inclinación dinámica de carrera
  dibujarPala(ctx, state.palaEsp, state.equipoEsp.colores, false, state.velPalaEspY, 'esp');
  dibujarPala(ctx, state.palaArg, state.equipoArg.colores, false, state.velPalaArgY, 'arg');
  
  dibujarBola(ctx, state.bola, state.orbitando);
  dibujarConfeti(ctx, state.confeti);

  dibujarEfectoSuper(ctx, state.efectoSuper, W);
}

function loop() {
  actualizarParticulas(state.particulas, W, H);
  state.confeti = actualizarConfeti(state.confeti);
  if (trails) actualizarTrails(trails, state);

  actualizar();
  dibujarCancha();

  requestAnimationFrame(loop);
}

function init() {
  initCanvas();
  initDOM();
  initKeyboard();

  state.particulas = initParticulas(W, H);
  trails = initTrails();

  mostrarTituloNeutro();
  actualizarBarras();
  mostrarVista('menu');

  loop();
}

window.addEventListener('DOMContentLoaded', init);
