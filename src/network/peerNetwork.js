import * as PeerModule from 'peerjs';
import { state } from '../core/gameState.js';
import { CONFIG } from '../config/gameConfig.js';
import { TEAMS } from '../config/teams.js';
import { generarCodigo } from '../utils/helpers.js';
import { mostrarVista } from '../ui/views.js';
import { DOM } from '../ui/dom.js';
import { actualizarBarras, actualizarMarcador, actualizarTitulo, actualizarPie, ocultarOverlay } from '../ui/scoreboard.js';
import { celebrarGol } from '../rendering/confetti.js';
import { dispararEfectoSuper, reiniciarCargas } from '../core/superShot.js';

// Fallback universal para PeerJS (funciona con Vite bundle y con script CDN en GitHub Pages)
const Peer = (typeof window !== 'undefined' && window.Peer)
  ? window.Peer
  : (PeerModule.Peer || PeerModule.default || PeerModule);

export let peer = null;
export let conn = null;

export function limpiarConexion() {
  if (conn) { try { conn.close(); } catch(e){} conn = null; }
  if (peer) { try { peer.destroy(); } catch(e){} peer = null; }
  if (DOM.estadoConexionEl) DOM.estadoConexionEl.textContent = '';
}

export function estadoRed() {
  return {
    t: 'state',
    bx: state.bola.x, 
    by: state.bola.y,
    pex: state.palaEsp.x, 
    pey: state.palaEsp.y, 
    pax: state.palaArg.x, 
    pay: state.palaArg.y,
    se: state.scoreEsp, 
    sa: state.scoreArg, 
    st: state.estado,
    ef: state.efectoContador, 
    efLado: state.efectoSuper.lado,
    ce: state.chargeEsp, 
    ca: state.chargeArg, 
    re: state.readyEsp, 
    ra: state.readyArg
  };
}

export function aplicarEstadoRemoto(data) {
  if (data.t !== 'state') return;
  state.bola.x = data.bx; 
  state.bola.y = data.by;
  state.palaEsp.x = data.pex; 
  state.palaEsp.y = data.pey;
  state.palaArg.x = data.pax; 
  state.palaArg.y = data.pay;
  state.chargeEsp = data.ce; 
  state.chargeArg = data.ca; 
  state.readyEsp = data.re; 
  state.readyArg = data.ra;
  
  actualizarBarras();

  if (data.se !== state.scoreEsp || data.sa !== state.scoreArg) {
    if (data.se > state.scoreEsp) celebrarGol(state.confeti, state.equipoEsp.colores, 900, 560);
    if (data.sa > state.scoreArg) celebrarGol(state.confeti, state.equipoArg.colores, 900, 560);
    state.scoreEsp = data.se; 
    state.scoreArg = data.sa; 
    actualizarMarcador();
  }

  if (data.ef !== state.efectoVisto) {
    state.efectoVisto = data.ef;
    dispararEfectoSuper(data.efLado);
  }

  if (data.st === 'pausa' && state.estado !== 'pausa') { 
    state.estado = 'pausa'; 
    mostrarVista('pausa'); 
  } else if (data.st === 'jugando' && state.estado === 'pausa') { 
    state.estado = 'jugando'; 
    ocultarOverlay(); 
  } else if (data.st === 'fin' && state.estado !== 'fin') {
    state.estado = 'fin';
    const ganaEsp = state.scoreEsp >= CONFIG.meta;
    mostrarVista('fin', {
      titulo: `¡${(ganaEsp ? state.equipoEsp : state.equipoArg).nombre.toUpperCase()} CAMPEÓN!`,
      texto: `${state.scoreEsp} - ${state.scoreArg}`,
      revancha: false
    });
  }
}

export function manejarDesconexion() {
  if (state.estado === 'menu') return;
  state.estado = 'pausa';
  if (DOM.estadoConexionEl) DOM.estadoConexionEl.textContent = 'Desconectado';
  mostrarVista('error', { msg: 'Tu rival se desconectó de la partida.' });
}

export function crearPartidaOnline(intentos = 0) {
  state.modo = 'host';
  mostrarVista('generando');
  const codigo = generarCodigo();
  peer = new Peer('clasico-' + codigo, { debug: 0 });

  peer.on('open', () => {
    mostrarVista('esperando', { codigo });
    peer.on('connection', c => {
      conn = c;
      conn.on('open', () => { 
        if (DOM.estadoConexionEl) DOM.estadoConexionEl.textContent = 'Conectado'; 
      });
      conn.on('data', data => {
        if (data.t === 'equipoGuest') {
          state.equipoArg = TEAMS.find(t => t.id === data.id) || state.equipoArg;
          actualizarTitulo(); 
          actualizarPie();
          conn.send({ t: 'config', config: CONFIG, equipoEspId: state.equipoEsp.id, equipoArgId: state.equipoArg.id });
          arrancarCuentaAtras();
        } else if (data.t === 'input') {
          state.remoteInputDx = data.dx; 
          state.remoteInputDy = data.dy;
        } else if (data.t === 'espacio') {
          if (state.readyArg && !state.armedArg) state.armedArg = true;
        }
      });
      conn.on('close', () => manejarDesconexion());
    });
  });

  peer.on('error', err => {
    if (err.type === 'unavailable-id' && intentos < 5) crearPartidaOnline(intentos + 1);
    else mostrarVista('error', { msg: 'No se pudo crear la sala. Inténtalo de nuevo.' });
  });
}

export function conectarComoGuest(codigo) {
  state.modo = 'guest';
  mostrarVista('conectando', { codigo });
  peer = new Peer();

  peer.on('open', () => {
    conn = peer.connect('clasico-' + codigo, { reliable: true });
    conn.on('open', () => {
      if (DOM.estadoConexionEl) DOM.estadoConexionEl.textContent = 'Conectado';
      conn.send({ t: 'equipoGuest', id: state.equipoArg.id });
    });
    conn.on('data', data => {
      if (data.t === 'config') {
        Object.assign(CONFIG, data.config);
        state.equipoEsp = TEAMS.find(t => t.id === data.equipoEspId) || state.equipoEsp;
        state.equipoArg = TEAMS.find(t => t.id === data.equipoArgId) || state.equipoArg;
        actualizarTitulo(); 
        actualizarPie();
        arrancarCuentaAtras();
      } else {
        aplicarEstadoRemoto(data);
      }
    });
    conn.on('close', () => manejarDesconexion());
    conn.on('error', () => mostrarVista('error', { msg: 'Se perdió la conexión con la sala.' }));
  });

  peer.on('error', err => {
    if (err.type === 'peer-unavailable') mostrarVista('error', { msg: 'Ese código no existe o la partida ya cerró.' });
    else mostrarVista('error', { msg: 'No se pudo conectar. Revisa el código e inténtalo otra vez.' });
  });
}

export function arrancarCuentaAtras() {
  mostrarVista('cuenta-atras');
  state.scoreEsp = 0; 
  state.scoreArg = 0; 
  actualizarMarcador();
  reiniciarCargas();
  posicionInicialPalas();

  let n = 3;
  const txt = document.getElementById('cuentaTxt');
  const iv = setInterval(() => {
    n--;
    if (n > 0) { 
      if (txt) txt.textContent = 'Empieza en ' + n + '…'; 
    } else {
      clearInterval(iv);
      ocultarOverlay();
      state.estado = 'jugando';
      if (state.modo === 'host') { centrarBola(Math.random() > 0.5 ? 1 : -1); }
    }
  }, 800);
}

export function posicionInicialPalas() {
  const ph = (CONFIG.tamPala === 'pequena' ? 76 : (CONFIG.tamPala === 'grande' ? 130 : 100));
  state.palaEsp = { x: 30, y: 560 / 2 - ph / 2 };
  state.palaArg = { x: 900 - 30 - 16, y: 560 / 2 - ph / 2 };
}

export function centrarBola(direccion) {
  state.bola.x = 900 / 2; 
  state.bola.y = 560 / 2 + (Math.random() * 160 - 80);
  const velBase = (CONFIG.velocidad === 'lenta' ? 4.6 : (CONFIG.velocidad === 'rapida' ? 8.4 : 6.2));
  const angulo = (Math.random() * 0.7 - 0.35);
  state.bola.vx = velBase * direccion;
  state.bola.vy = velBase * angulo * 2;
}
