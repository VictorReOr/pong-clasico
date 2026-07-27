import { DOM } from './dom.js';
import { state } from '../core/gameState.js';
import { TEAMS, banderaEmoji } from '../config/teams.js';
import { CONFIG, DIFICULTADES_CPU } from '../config/gameConfig.js';
import { TOQUES_PARA_CARGA } from '../config/constants.js';
import { actualizarTitulo, actualizarPie, actualizarMarcador, mostrarTituloNeutro, mostrarOverlayVisible, ocultarOverlay } from './scoreboard.js';
import { crearPartidaOnline, conectarComoGuest, limpiarConexion } from '../network/peerNetwork.js';
import { reiniciarCargas } from '../core/superShot.js';
import { iniciarPartido } from '../core/physics.js';

export function mostrarVista(nombre, datos = {}) {
  mostrarOverlayVisible();

  if (nombre === 'menu') {
    DOM.overlay.innerHTML = `
      <h2>ELIGE MODO DE JUEGO</h2>
      <p>Local en un mismo teclado, o crea/únete a una partida online. 32 selecciones del Mundial 2026 disponibles.</p>
      <div class="botonera">
        <button class="btn" id="btnCPU">1 Jugador · vs CPU</button>
        <button class="btn" id="btnLocal">Local · 2 jugadores</button>
        <button class="btn" id="btnCrear">Crear partida online</button>
        <button class="btn secundario" id="btnUnirse">Unirme con código</button>
        <button class="btn secundario" id="btnConfig">⚙️ Configuración</button>
      </div>`;
    document.getElementById('btnCPU').onclick = () => pedirEquipo('esp', () => mostrarVista('elegir-dificultad'));
    document.getElementById('btnLocal').onclick = () => pedirEquipo('esp', () => pedirEquipo('arg', () => { 
      state.modo = 'local'; 
      actualizarTitulo(); 
      actualizarPie(); 
      mostrarVista('listo-local'); 
    }));
    document.getElementById('btnCrear').onclick = () => pedirEquipo('esp', () => crearPartidaOnline());
    document.getElementById('btnUnirse').onclick = () => mostrarVista('unir-form');
    document.getElementById('btnConfig').onclick = () => mostrarVista('config');
  }

  else if (nombre === 'elegir-dificultad') {
    DOM.overlay.innerHTML = `
      <h2>ELIGE LA DIFICULTAD</h2>
      <p>La CPU maneja al equipo rival. Puedes cambiarla cuando quieras antes de sacar.</p>
      <div class="segmentado">
        ${Object.keys(DIFICULTADES_CPU).map(k => `<button class="seg-btn ${CONFIG.dificultad === k ? 'activo' : ''}" data-valor="${k}">${DIFICULTADES_CPU[k].nombre}</button>`).join('')}
      </div>
      <div class="botonera">
        <button class="btn" id="btnJugarCPU">Jugar</button>
        <button class="btn secundario" id="btnVolverDif">Volver al menú</button>
      </div>`;
    DOM.overlay.querySelectorAll('.seg-btn').forEach(b => {
      b.onclick = () => { CONFIG.dificultad = b.dataset.valor; mostrarVista('elegir-dificultad'); };
    });
    document.getElementById('btnJugarCPU').onclick = () => {
      const candidatos = TEAMS.filter(t => t.id !== state.equipoEsp.id);
      state.equipoArg = candidatos[Math.floor(Math.random() * candidatos.length)];
      state.modo = 'cpu';
      actualizarTitulo(); 
      actualizarPie();
      mostrarVista('listo-local');
    };
    document.getElementById('btnVolverDif').onclick = volverAlMenu;
  }

  else if (nombre === 'config') {
    DOM.overlay.innerHTML = `
      <h2>CONFIGURACIÓN DE LA PARTIDA</h2>
      <div class="config-fila">
        <div class="config-label">Goles para ganar</div>
        <div class="segmentado">
          ${[5,7,10].map(v => `<button class="seg-btn ${CONFIG.meta === v ? 'activo' : ''}" data-key="meta" data-valor="${v}">${v}</button>`).join('')}
        </div>
      </div>
      <div class="config-fila">
        <div class="config-label">Velocidad de la pelota</div>
        <div class="segmentado">
          ${[['lenta','Lenta'],['normal','Normal'],['rapida','Rápida']].map(v => `<button class="seg-btn ${CONFIG.velocidad === v[0] ? 'activo' : ''}" data-key="velocidad" data-valor="${v[0]}">${v[1]}</button>`).join('')}
        </div>
      </div>
      <div class="config-fila">
        <div class="config-label">Supertiros temáticos</div>
        <div class="segmentado">
          ${[[true,'Activados'],[false,'Desactivados']].map(v => `<button class="seg-btn ${CONFIG.superActivo === v[0] ? 'activo' : ''}" data-key="superActivo" data-valor="${v[0]}">${v[1]}</button>`).join('')}
        </div>
      </div>
      <div class="config-fila">
        <div class="config-label">Tamaño de las palas</div>
        <div class="segmentado">
          ${[['pequena','Pequeña'],['normal','Normal'],['grande','Grande']].map(v => `<button class="seg-btn ${CONFIG.tamPala === v[0] ? 'activo' : ''}" data-key="tamPala" data-valor="${v[0]}">${v[1]}</button>`).join('')}
        </div>
      </div>
      <div class="botonera">
        <button class="btn" id="btnGuardarConfig">Volver al menú</button>
      </div>`;
    DOM.overlay.querySelectorAll('.seg-btn').forEach(b => {
      b.onclick = () => {
        const key = b.dataset.key;
        let valor = b.dataset.valor;
        if (valor === 'true') valor = true;
        else if (valor === 'false') valor = false;
        else if (!isNaN(valor)) valor = parseInt(valor);
        CONFIG[key] = valor;
        mostrarVista('config');
      };
    });
    document.getElementById('btnGuardarConfig').onclick = () => mostrarVista('menu');
  }

  else if (nombre === 'elegir-equipo') {
    const titulo = datos.lado === 'esp' ? 'ELIGE TU SELECCIÓN (IZQUIERDA)' : 'ELIGE TU SELECCIÓN (DERECHA)';
    DOM.overlay.innerHTML = `
      <h2>${titulo}</h2>
      <p>Las 32 selecciones más destacadas del Mundial 2026.</p>
      <div class="equipos-grid">
        ${TEAMS.map(eq => `<button class="equipo-chip" data-id="${eq.id}">
            <span class="bandera-emoji">${banderaEmoji(eq.cc)}</span>
            ${eq.nombre}
          </button>`).join('')}
      </div>
      <div class="botonera"><button class="btn secundario" id="btnVolverEquipo">Volver al menú</button></div>`;
    DOM.overlay.querySelectorAll('.equipo-chip').forEach(chip => {
      chip.onclick = () => {
        const eq = TEAMS.find(t => t.id === chip.dataset.id);
        if (datos.lado === 'esp') state.equipoEsp = eq; else state.equipoArg = eq;
        datos.callback();
      };
    });
    document.getElementById('btnVolverEquipo').onclick = volverAlMenu;
  }

  else if (nombre === 'listo-local') {
    DOM.overlay.innerHTML = `
      <h2>EL CLÁSICO</h2>
      <p>El primero en llegar a ${CONFIG.meta} goles se lleva el título. Suma ${TOQUES_PARA_CARGA} toques para cargar tu supertiro y pulsa ESPACIO para activarlo.</p>
      <div class="botonera">
        <button class="btn" id="btnSacar">Sacar de centro</button>
        <button class="btn secundario" id="btnVolver">Volver al menú</button>
      </div>`;
    document.getElementById('btnSacar').onclick = () => {
      ocultarOverlay();
      iniciarPartido();
    };
    document.getElementById('btnVolver').onclick = volverAlMenu;
  }

  else if (nombre === 'generando') {
    DOM.overlay.innerHTML = `<h2>Creando sala...</h2><p>Generando código de partida.</p>`;
  }

  else if (nombre === 'esperando') {
    DOM.overlay.innerHTML = `
      <h2>${state.equipoEsp.nombre.toUpperCase()} — SALA CREADA</h2>
      <p>Pásale este código a tu rival para que se una desde su navegador (no necesita instalar nada):</p>
      <div class="codigo">${datos.codigo}</div>
      <p>Esperando a que se conecte…</p>
      <div class="botonera"><button class="btn secundario" id="btnCancelar">Cancelar</button></div>`;
    document.getElementById('btnCancelar').onclick = volverAlMenu;
  }

  else if (nombre === 'unir-form') {
    DOM.overlay.innerHTML = `
      <h2>UNIRSE A UNA PARTIDA</h2>
      <p>Introduce el código de 5 caracteres que te ha dado el anfitrión.</p>
      <input id="inputCodigo" maxlength="5" placeholder="XXXXX" autocomplete="off">
      <div class="botonera">
        <button class="btn" id="btnConectar">Conectar</button>
        <button class="btn secundario" id="btnVolver2">Volver</button>
      </div>`;
    document.getElementById('btnConectar').onclick = () => {
      const codigo = (document.getElementById('inputCodigo').value || '').trim().toUpperCase();
      if (codigo.length < 3) return;
      pedirEquipo('arg', () => conectarComoGuest(codigo));
    };
    document.getElementById('btnVolver2').onclick = volverAlMenu;
    const inp = document.getElementById('inputCodigo');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('btnConectar').click(); });
    }
  }

  else if (nombre === 'conectando') {
    DOM.overlay.innerHTML = `<h2>Conectando…</h2><p>Buscando la sala ${datos.codigo || ''}.</p>`;
  }
  else if (nombre === 'cuenta-atras') {
    DOM.overlay.innerHTML = `<h2>¡RIVAL CONECTADO!</h2><p id="cuentaTxt">Empieza en 3…</p>`;
  }
  else if (nombre === 'pausa') {
    DOM.overlay.innerHTML = `<h2>PAUSA</h2><p>ESC (o P) para continuar.</p>`;
  }
  else if (nombre === 'fin') {
    DOM.overlay.innerHTML = `
      <h2>${datos.titulo}</h2>
      <p>${datos.texto}</p>
      <div class="botonera">
        ${datos.revancha ? '<button class="btn" id="btnRevancha">Revancha</button>' : ''}
        <button class="btn secundario" id="btnVolver3">Volver al menú</button>
      </div>`;
    if (datos.revancha) {
      document.getElementById('btnRevancha').onclick = () => {
        ocultarOverlay();
        iniciarPartido();
      };
    }
    document.getElementById('btnVolver3').onclick = volverAlMenu;
  }
  else if (nombre === 'error') {
    DOM.overlay.innerHTML = `
      <h2>ALGO SALIÓ MAL</h2><p>${datos.msg}</p>
      <div class="botonera"><button class="btn secundario" id="btnVolver4">Volver al menú</button></div>`;
    document.getElementById('btnVolver4').onclick = volverAlMenu;
  }
}

export function pedirEquipo(lado, callback) { 
  mostrarVista('elegir-equipo', { lado, callback }); 
}

export function volverAlMenu() {
  limpiarConexion();
  state.modo = null; 
  state.estado = 'menu';
  state.scoreEsp = 0; 
  state.scoreArg = 0; 
  actualizarMarcador();
  reiniciarCargas();
  DOM.pieEsp.textContent = ''; 
  DOM.pieArg.textContent = ''; 
  DOM.pieCentro.textContent = '';
  mostrarTituloNeutro();
  mostrarVista('menu');
}
