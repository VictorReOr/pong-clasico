import { state } from './gameState.js';
import { CONFIG, DIFICULTADES_CPU, PALA_ALTURA } from '../config/gameConfig.js';
import { H } from '../rendering/canvas.js';

export function moverCPU() {
  const p = DIFICULTADES_CPU[CONFIG.dificultad] || DIFICULTADES_CPU.normal;
  const ph = PALA_ALTURA();
  
  state.cpuTimerRecalculo--;
  if (state.cpuTimerRecalculo <= 0) {
    state.cpuTimerRecalculo = 10;
    if (state.bola.vx > 0) {
      state.cpuObjetivoY = state.bola.y + (Math.random() * 2 - 1) * p.error;
    } else {
      state.cpuObjetivoY = H / 2;
    }
  }
  
  const centroActual = state.palaArg.y + ph / 2;
  const diferencia = state.cpuObjetivoY - centroActual;
  if (Math.abs(diferencia) > 4) {
    state.palaArg.y += Math.sign(diferencia) * Math.min(Math.abs(diferencia), p.vel);
  }
  
  if (state.readyArg && !state.armedArg) state.armedArg = true;
}
