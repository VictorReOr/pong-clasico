import { state } from '../core/gameState.js';
import { mostrarVista } from '../ui/views.js';
import { ocultarOverlay } from '../ui/scoreboard.js';
import { estadoRed, conn } from '../network/peerNetwork.js';

export const teclas = {};

export function initKeyboard() {
  window.addEventListener('keydown', e => {
    teclas[e.key] = true;

    if (e.key === ' ') {
      e.preventDefault();
      if (state.estado === 'jugando') {
        if (state.modo === 'local') {
          if (state.readyEsp && !state.armedEsp) state.armedEsp = true;
          if (state.readyArg && !state.armedArg) state.armedArg = true;
        } else if (state.modo === 'host' || state.modo === 'cpu') {
          if (state.readyEsp && !state.armedEsp) state.armedEsp = true;
        } else if (state.modo === 'guest') {
          if (conn && conn.open) conn.send({ t: 'espacio' });
        }
      }
    }

    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      if (state.estado === 'jugando' && (state.modo === 'local' || state.modo === 'host' || state.modo === 'cpu')) {
        state.estado = 'pausa'; 
        mostrarVista('pausa');
        if (conn && conn.open) conn.send(estadoRed());
      } else if (state.estado === 'pausa' && (state.modo === 'local' || state.modo === 'host' || state.modo === 'cpu')) {
        state.estado = 'jugando'; 
        ocultarOverlay();
        if (conn && conn.open) conn.send(estadoRed());
      }
    }

    if (state.modo === 'guest') enviarInputGuest();
  });

  window.addEventListener('keyup', e => {
    teclas[e.key] = false;
    if (state.modo === 'guest') enviarInputGuest();
  });
}

export function enviarInputGuest() {
  if (!conn || !conn.open) return;
  let dx = 0, dy = 0;
  if (teclas['w'] || teclas['W'] || teclas['ArrowUp']) dy -= 1;
  if (teclas['s'] || teclas['S'] || teclas['ArrowDown']) dy += 1;
  if (teclas['a'] || teclas['A'] || teclas['ArrowLeft']) dx -= 1;
  if (teclas['d'] || teclas['D'] || teclas['ArrowRight']) dx += 1;
  conn.send({ t: 'input', dx, dy });
}
