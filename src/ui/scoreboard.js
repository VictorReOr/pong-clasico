import { DOM } from './dom.js';
import { state } from '../core/gameState.js';
import { TOQUES_PARA_CARGA } from '../config/constants.js';
import { banderaEmoji } from '../config/teams.js';
import { CONFIG, DIFICULTADES_CPU } from '../config/gameConfig.js';

export function ocultarOverlay() {
  DOM.overlay.classList.add('oculto');
}

export function mostrarOverlayVisible() {
  DOM.overlay.classList.remove('oculto');
}

export function actualizarMarcador() {
  DOM.scoreEspEl.textContent = state.scoreEsp;
  DOM.scoreArgEl.textContent = state.scoreArg;
}

export function actualizarBarras() {
  DOM.barraEspEl.style.width = (state.chargeEsp / TOQUES_PARA_CARGA * 100) + '%';
  DOM.barraArgEl.style.width = (state.chargeArg / TOQUES_PARA_CARGA * 100) + '%';
  DOM.barraEspEl.classList.toggle('lista', state.readyEsp);
  DOM.barraArgEl.classList.toggle('lista', state.readyArg);
}

export function actualizarTitulo() {
  DOM.tituloEl.innerHTML = `<span class="bandera-emoji-titulo">${banderaEmoji(state.equipoEsp.cc)}</span><span style="color:${state.equipoEsp.colores[0]}">${state.equipoEsp.nombre.toUpperCase()}</span> &nbsp;vs&nbsp; <span style="color:${state.equipoArg.colores[0]}">${state.equipoArg.nombre.toUpperCase()}</span><span class="bandera-emoji-titulo">${banderaEmoji(state.equipoArg.cc)}</span>`;
  DOM.nombreEspEl.innerHTML = `<span class="bandera-emoji-marcador">${banderaEmoji(state.equipoEsp.cc)}</span>${state.equipoEsp.nombre}`;
  DOM.nombreArgEl.innerHTML = `<span class="bandera-emoji-marcador">${banderaEmoji(state.equipoArg.cc)}</span>${state.equipoArg.nombre}`;
  DOM.numEspEl.style.color = state.equipoEsp.colores[0];
  DOM.numArgEl.style.color = state.equipoArg.colores[0];
  DOM.vsEl = document.getElementById('vs');
  if (DOM.vsEl && DOM.vsEl.firstChild) {
    DOM.vsEl.firstChild.textContent = 'FT. ' + CONFIG.meta;
  }
}

export function mostrarTituloNeutro() {
  DOM.tituloEl.textContent = 'PONG OFICIAL DE EVENTOS';
  DOM.nombreEspEl.textContent = 'EQUIPO A';
  DOM.nombreArgEl.textContent = 'EQUIPO B';
  DOM.numEspEl.style.color = '';
  DOM.numArgEl.style.color = '';
}

export function actualizarPie() {
  const suf = ' · WASD';
  if (state.modo === 'local') {
    DOM.pieEsp.textContent = state.equipoEsp.nombre.toUpperCase() + suf;
    DOM.pieArg.textContent = state.equipoArg.nombre.toUpperCase() + ' · FLECHAS';
    DOM.pieCentro.textContent = 'ESPACIO = supertiro (con carga) · ESC pausa';
  } else if (state.modo === 'host') {
    DOM.pieEsp.textContent = 'TÚ: ' + state.equipoEsp.nombre.toUpperCase() + suf;
    DOM.pieArg.textContent = 'RIVAL: ' + state.equipoArg.nombre.toUpperCase() + ' (remoto)';
    DOM.pieCentro.textContent = 'ESPACIO = tu supertiro · ESC pausa';
  } else if (state.modo === 'guest') {
    DOM.pieEsp.textContent = 'RIVAL: ' + state.equipoEsp.nombre.toUpperCase() + ' (remoto)';
    DOM.pieArg.textContent = 'TÚ: ' + state.equipoArg.nombre.toUpperCase() + suf;
    DOM.pieCentro.textContent = 'ESPACIO = tu supertiro · el anfitrión controla la pausa';
  } else if (state.modo === 'cpu') {
    const dif = DIFICULTADES_CPU[CONFIG.dificultad] || DIFICULTADES_CPU.normal;
    DOM.pieEsp.textContent = 'TÚ: ' + state.equipoEsp.nombre.toUpperCase() + suf;
    DOM.pieArg.textContent = 'CPU (' + dif.nombre.toUpperCase() + '): ' + state.equipoArg.nombre.toUpperCase();
    DOM.pieCentro.textContent = 'ESPACIO = tu supertiro · ESC pausa';
  }
}
