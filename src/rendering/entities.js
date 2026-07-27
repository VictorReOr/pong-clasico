import { PALA_W, PAPEL_TINTA, PAPEL_CREMA } from '../config/constants.js';
import { PALA_ALTURA } from '../config/gameConfig.js';

export function dibujarPala(ctx, pala, colores, esTrail = false, velY = 0, lado = 'esp') {
  const ph = PALA_ALTURA();
  const cx = pala.x + PALA_W / 2;
  const cy = pala.y + ph / 2;

  ctx.save();

  // Inclinación dinámica de la carrera (Tilt al subir o bajar)
  const tilt = esTrail ? 0 : Math.max(-0.18, Math.min(0.18, velY * 0.025));
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-cx, -cy);

  // 1. Sombra ovalada de contacto en el césped
  if (!esTrail) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#0F1A12';
    ctx.beginPath();
    ctx.ellipse(cx, pala.y + ph + 2, PALA_W * 0.75, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Proporciones de futbolista de fútbol europeo (Soccer) - Atletismo sin hombreras
  const rCabeza = PALA_W * 0.46;
  const yCabeza = pala.y + rCabeza + 2;
  const yCuello = yCabeza + rCabeza - 1;
  const yTorsoTop = yCuello + 3;
  const hCuerpo = (pala.y + ph) - yTorsoTop;
  
  const hTorso = hCuerpo * 0.36;
  const hShorts = hCuerpo * 0.24;
  const hPiernas = hCuerpo * 0.30;
  const hBotas = hCuerpo * 0.10;

  // Hombros entallados de camiseta de fútbol (Soccer jersey)
  const anchoHombros = PALA_W * 0.88;
  const anchoPecho = PALA_W * 0.80;
  const anchoCintura = PALA_W * 0.70;

  const TONO_PIEL = '#F5C29B';
  const COLOR_PELO = '#2C1B10';

  // --- BRAZOS Y MANOS (Postura atlética de carrera) ---
  ctx.fillStyle = TONO_PIEL;
  // Brazo izquierdo (ligeramente separado)
  ctx.beginPath();
  ctx.ellipse(cx - anchoHombros * 0.52, yTorsoTop + hTorso * 0.5, 2.5, hTorso * 0.4, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Brazo derecho
  ctx.beginPath();
  ctx.ellipse(cx + anchoHombros * 0.52, yTorsoTop + hTorso * 0.5, 2.5, hTorso * 0.4, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // --- CUELLO ---
  ctx.fillStyle = TONO_PIEL;
  ctx.fillRect(cx - 2.5, yCuello - 1, 5, 4);

  // --- CAMISETA DE FÚTBOL (SOCCER JERSEY) ---
  // Cuerpo principal de la camiseta
  ctx.fillStyle = colores[0];
  ctx.beginPath();
  ctx.moveTo(cx - anchoHombros / 2, yTorsoTop);
  ctx.lineTo(cx + anchoHombros / 2, yTorsoTop);
  ctx.lineTo(cx + anchoCintura / 2, yTorsoTop + hTorso);
  ctx.lineTo(cx - anchoCintura / 2, yTorsoTop + hTorso);
  ctx.closePath();
  ctx.fill();

  // Cuello redondito / deportivo con color secundario
  ctx.fillStyle = colores[1] || '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, yTorsoTop, 3.5, 0, Math.PI);
  ctx.fill();

  // Mangas cortas de fútbol
  ctx.fillStyle = colores[0];
  ctx.fillRect(cx - anchoHombros / 2 - 3, yTorsoTop + 1, 3.5, 6);
  ctx.fillRect(cx + anchoHombros / 2 - 0.5, yTorsoTop + 1, 3.5, 6);

  // Remate/Goma de las mangas cortas
  ctx.fillStyle = colores[1] || '#FFFFFF';
  ctx.fillRect(cx - anchoHombros / 2 - 3, yTorsoTop + 6, 3.5, 1.5);
  ctx.fillRect(cx + anchoHombros / 2 - 0.5, yTorsoTop + 6, 3.5, 1.5);

  // Franja central vertical estilizada
  ctx.fillStyle = colores[1] || 'rgba(255,255,255,0.3)';
  ctx.fillRect(cx - 2, yTorsoTop + 4, 4, hTorso - 4);

  // Dorsal estilizado del futbolista (#10)
  ctx.fillStyle = colores[2] || '#FFFFFF';
  ctx.font = "bold 8px 'Anton', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('10', cx, yTorsoTop + hTorso * 0.58);

  // --- PANTALÓN CORTO DE FÚTBOL (SOCCER SHORTS) ---
  const yShorts = yTorsoTop + hTorso;
  ctx.fillStyle = colores[1] || '#FFFFFF';
  ctx.fillRect(cx - anchoCintura / 2, yShorts, anchoCintura, hShorts);

  // Apertura central entre las perneras del pantalón
  ctx.fillStyle = PAPEL_TINTA;
  ctx.beginPath();
  ctx.moveTo(cx - 1, yShorts + hShorts - 3);
  ctx.lineTo(cx + 1, yShorts + hShorts - 3);
  ctx.lineTo(cx, yShorts + hShorts);
  ctx.closePath();
  ctx.fill();

  // Franja o vivo lateral del pantalón
  ctx.fillStyle = colores[0];
  ctx.fillRect(cx - anchoCintura / 2, yShorts, 1.8, hShorts);
  ctx.fillRect(cx + anchoCintura / 2 - 1.8, yShorts, 1.8, hShorts);

  // --- PIERNAS ATLÉTICAS Y MEDIAS ---
  const yPiernas = yShorts + hShorts;
  const anchoPierna = (anchoCintura * 0.38);
  const xPiernaIzq = cx - anchoCintura / 2 + 0.5;
  const xPiernaDer = cx + anchoCintura / 2 - anchoPierna - 0.5;

  const hRodilla = hPiernas * 0.35;
  const hMedias = hPiernas * 0.65;

  // Piernas / Rodillas al descubierto (piel)
  ctx.fillStyle = TONO_PIEL;
  ctx.fillRect(xPiernaIzq, yPiernas, anchoPierna, hRodilla);
  ctx.fillRect(xPiernaDer, yPiernas, anchoPierna, hRodilla);

  // Medias altas de fútbol (Soccer Socks)
  ctx.fillStyle = colores[2] || colores[0];
  ctx.fillRect(xPiernaIzq, yPiernas + hRodilla, anchoPierna, hMedias);
  ctx.fillRect(xPiernaDer, yPiernas + hRodilla, anchoPierna, hMedias);

  // Vuelta superior de la media
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(xPiernaIzq - 0.5, yPiernas + hRodilla, anchoPierna + 1, 2);
  ctx.fillRect(xPiernaDer - 0.5, yPiernas + hRodilla, anchoPierna + 1, 2);

  // --- BOTAS DE FÚTBOL CON TACOS (SOCCER CLEATS) ---
  const yPies = yPiernas + hPiernas;
  ctx.fillStyle = '#111111'; // Botas negras
  // Bota izquierda
  ctx.fillRect(xPiernaIzq - 1.5, yPies, anchoPierna + 2.5, hBotas + 1);
  // Bota derecha
  ctx.fillRect(xPiernaDer - 1, yPies, anchoPierna + 2.5, hBotas + 1);

  // Cordones blancos de la bota
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(xPiernaIzq, yPies + 1, anchoPierna - 1, 1);
  ctx.fillRect(xPiernaDer, yPies + 1, anchoPierna - 1, 1);

  // Tacos/Suela
  ctx.fillStyle = colores[0];
  ctx.fillRect(xPiernaIzq - 1, yPies + hBotas, 2, 1.5);
  ctx.fillRect(xPiernaIzq + anchoPierna - 1, yPies + hBotas, 2, 1.5);
  ctx.fillRect(xPiernaDer - 0.5, yPies + hBotas, 2, 1.5);
  ctx.fillRect(xPiernaDer + anchoPierna - 1.5, yPies + hBotas, 2, 1.5);

  // --- CABEZA Y CARA DE FUTBOLISTA ---
  // Pelo estilo corto deportivo
  ctx.fillStyle = COLOR_PELO;
  ctx.beginPath();
  ctx.arc(cx, yCabeza - 1, rCabeza + 0.5, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();

  // Cara
  ctx.fillStyle = TONO_PIEL;
  ctx.beginPath();
  ctx.arc(cx, yCabeza, rCabeza, 0, Math.PI * 2);
  ctx.fill();

  // Flequillo / Pelo frontal
  ctx.fillStyle = COLOR_PELO;
  ctx.beginPath();
  ctx.arc(cx, yCabeza - rCabeza * 0.6, rCabeza * 0.8, Math.PI, Math.PI * 2);
  ctx.fill();

  // Ojos orientados hacia el balón
  ctx.fillStyle = PAPEL_TINTA;
  const ladoOffset = lado === 'esp' ? 0.8 : -0.8;
  ctx.fillRect(cx - 3.5 + ladoOffset, yCabeza - 0.5, 2, 2.5);
  ctx.fillRect(cx + 1.5 + ladoOffset, yCabeza - 0.5, 2, 2.5);

  // Expresión / Sonrisa deportiva
  ctx.beginPath();
  ctx.arc(cx + ladoOffset, yCabeza + 3, 2.5, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = PAPEL_TINTA;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Trazo de contorno sutil (Outline retro arcade)
  ctx.strokeStyle = 'rgba(26,23,18,0.7)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(cx - anchoHombros / 2, yTorsoTop, anchoHombros, hTorso + hShorts);

  ctx.restore();
}

export function dibujarPentagono(ctx, cx, cy, r, color, rotBase = 0) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = rotBase + (Math.PI * 2 / 5) * i - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y); 
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function dibujarBola(ctx, bola, orbitando) {
  ctx.save();
  ctx.translate(bola.x, bola.y);
  ctx.rotate(bola.giro);

  ctx.beginPath(); 
  ctx.arc(0, 0, bola.r, 0, Math.PI * 2);
  ctx.fillStyle = PAPEL_CREMA;
  ctx.fill();
  ctx.lineWidth = 1.5; 
  ctx.strokeStyle = PAPEL_TINTA; 
  ctx.stroke();

  dibujarPentagono(ctx, 0, 0, bola.r * 0.42, PAPEL_TINTA);

  const n = 5;
  for (let i = 0; i < n; i++) {
    const ang = (Math.PI * 2 / n) * i + Math.PI / 2;
    const px = Math.cos(ang) * bola.r * 0.7;
    const py = Math.sin(ang) * bola.r * 0.7;
    dibujarPentagono(ctx, px, py, bola.r * 0.30, PAPEL_TINTA, ang);
  }

  ctx.strokeStyle = 'rgba(26,23,18,.35)'; 
  ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const ang = (Math.PI * 2 / n) * i + Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang) * bola.r * 0.95, Math.sin(ang) * bola.r * 0.95);
    ctx.stroke();
  }
  ctx.restore();

  if (orbitando && orbitando.activo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, bola.r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = orbitando.equipo.colores[0];
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.restore();
  }
}
