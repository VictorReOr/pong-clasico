import { VEL_PALA_MOV } from './constants.js';

export const CONFIG = {
  meta: 7,
  velocidad: 'normal',
  superActivo: true,
  tamPala: 'normal',
  dificultad: 'normal'
};

export const DIFICULTADES_CPU = {
  facil:   { vel: VEL_PALA_MOV * 0.42, error: 52, nombre: 'Fácil' },
  normal:  { vel: VEL_PALA_MOV * 0.70, error: 24, nombre: 'Normal' },
  dificil: { vel: VEL_PALA_MOV * 0.95, error: 8,  nombre: 'Difícil' }
};

export function PALA_ALTURA(){
  return CONFIG.tamPala === 'pequena' ? 76 : (CONFIG.tamPala === 'grande' ? 130 : 100);
}

export function VEL_BASE(){
  return CONFIG.velocidad === 'lenta' ? 4.6 : (CONFIG.velocidad === 'rapida' ? 8.4 : 6.2);
}
