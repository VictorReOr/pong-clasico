import { state } from './gameState.js';
import { TOQUES_PARA_CARGA, PALA_W } from '../config/constants.js';
import { actualizarBarras } from '../ui/scoreboard.js';

export function dispararEfectoSuper(lado) {
  state.efectoSuper = { 
    activo: true, 
    lado, 
    inicio: performance.now(), 
    equipo: lado === 'esp' ? state.equipoEsp : state.equipoArg 
  };
}

export function registrarGolpe(lado) {
  if (lado === 'esp') {
    if (state.readyEsp) return;
    state.chargeEsp = Math.min(state.chargeEsp + 1, TOQUES_PARA_CARGA);
    if (state.chargeEsp >= TOQUES_PARA_CARGA) state.readyEsp = true;
  } else {
    if (state.readyArg) return;
    state.chargeArg = Math.min(state.chargeArg + 1, TOQUES_PARA_CARGA);
    if (state.chargeArg >= TOQUES_PARA_CARGA) state.readyArg = true;
  }
  actualizarBarras();
}

export function consumirCarga(lado) {
  if (lado === 'esp') { 
    state.chargeEsp = 0; 
    state.readyEsp = false; 
    state.armedEsp = false; 
  } else { 
    state.chargeArg = 0; 
    state.readyArg = false; 
    state.armedArg = false; 
  }
  actualizarBarras();
}

export function iniciarOrbita(pala, lado) {
  state.orbitando = {
    activo: true,
    lado,
    pala,
    angulo: 0,
    frame: 0,
    duracion: 50,
    radio: 36,
    equipo: lado === 'esp' ? state.equipoEsp : state.equipoArg
  };
  state.efectoContador++;
  dispararEfectoSuper(lado);
}

export function lanzarSupertiro(lado) {
  const pala = lado === 'esp' ? state.palaEsp : state.palaArg;
  const dirBase = lado === 'esp' ? 1 : -1;
  const velocidad = 40;
  const angulo = (Math.random() * 2 - 1) * 0.85;
  state.bola.vx = dirBase * velocidad * Math.cos(angulo);
  state.bola.vy = velocidad * Math.sin(angulo);
  state.bola.x = pala.x + (lado === 'esp' ? PALA_W + state.bola.r + 3 : -(state.bola.r + 3));
}

export function reiniciarCargas() {
  state.chargeEsp = 0; 
  state.chargeArg = 0;
  state.readyEsp = false; 
  state.readyArg = false;
  state.armedEsp = false; 
  state.armedArg = false;
  state.orbitando = { activo: false };
  actualizarBarras();
}
