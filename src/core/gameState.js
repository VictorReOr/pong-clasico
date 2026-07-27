import { TEAMS } from '../config/teams.js';
import { BOLA_R } from '../config/constants.js';

export const state = {
  estado: 'menu',
  modo: null,
  scoreEsp: 0,
  scoreArg: 0,
  
  peer: null,
  conn: null,
  remoteInputDx: 0,
  remoteInputDy: 0,

  chargeEsp: 0,
  chargeArg: 0,
  readyEsp: false,
  readyArg: false,
  armedEsp: false,
  armedArg: false,
  orbitando: { activo: false },

  efectoSuper: { activo: false, lado: null, inicio: 0, equipo: null },
  efectoContador: 0,
  efectoVisto: 0,

  equipoEsp: TEAMS.find(t => t.id === 'esp'),
  equipoArg: TEAMS.find(t => t.id === 'arg'),

  palaEsp: { x: 30, y: 230 },
  palaArg: { x: 854, y: 230 },
  velPalaEspX: 0,
  velPalaEspY: 0,
  velPalaArgX: 0,
  velPalaArgY: 0,
  
  bola: { x: 450, y: 280, vx: 0, vy: 0, r: BOLA_R, giro: 0 },

  particulas: [],
  confeti: [],
  anguloSunburst: 0,

  cpuObjetivoY: 0,
  cpuTimerRecalculo: 0
};
