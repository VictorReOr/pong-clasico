export const DOM = {};

export function initDOM() {
  DOM.cv = document.getElementById('cancha');
  DOM.scoreEspEl = document.getElementById('scoreEsp');
  DOM.scoreArgEl = document.getElementById('scoreArg');
  DOM.barraEspEl = document.getElementById('barraEsp');
  DOM.barraArgEl = document.getElementById('barraArg');
  DOM.overlay = document.getElementById('overlay');
  DOM.estadoConexionEl = document.getElementById('estadoConexion');
  DOM.pieEsp = document.getElementById('pieEsp');
  DOM.pieArg = document.getElementById('pieArg');
  DOM.pieCentro = document.getElementById('pieCentro');
  DOM.nombreEspEl = document.querySelector('.equipo.esp .nombre');
  DOM.nombreArgEl = document.querySelector('.equipo.arg .nombre');
  DOM.numEspEl = document.querySelector('.equipo.esp .num');
  DOM.numArgEl = document.querySelector('.equipo.arg .num');
  DOM.tituloEl = document.getElementById('titulo');
}
